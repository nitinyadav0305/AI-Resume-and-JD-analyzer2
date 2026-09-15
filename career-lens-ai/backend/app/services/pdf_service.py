"""
CareerLens AI — PDF Service
Extracts text from uploaded PDFs using PyPDFLoader.
"""

import os
import tempfile
import logging

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.exceptions import PDFParseError

logger = logging.getLogger("careerlens.pdf")


def extract_text(pdf_bytes: bytes) -> str:
    """
    Write PDF bytes to a temp file, load with PyPDFLoader,
    split, merge, and return the full text.
    """
    tmp_dir = tempfile.mkdtemp()
    tmp_path = os.path.join(tmp_dir, "upload.pdf")

    try:
        with open(tmp_path, "wb") as f:
            f.write(pdf_bytes)

        loader = PyPDFLoader(tmp_path)
        documents = loader.load()

        if not documents:
            raise PDFParseError("PDF contains no readable pages.")

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
        )
        chunks = splitter.split_documents(documents)

        text = "\n\n".join(chunk.page_content for chunk in chunks)

        if not text.strip():
            raise PDFParseError("PDF contains no extractable text. It may be a scanned image.")

        logger.info(f"Extracted {len(chunks)} chunks, {len(text)} chars from PDF")
        return text

    except PDFParseError:
        raise
    except Exception as e:
        logger.error(f"PDF extraction failed: {e}")
        raise PDFParseError(f"Failed to parse PDF: {str(e)}")
    finally:
        # Cleanup temp files
        try:
            os.remove(tmp_path)
            os.rmdir(tmp_dir)
        except OSError:
            pass
