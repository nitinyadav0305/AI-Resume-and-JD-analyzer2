/* ==========================================================================
   CareerLens AI — API Service
   Real backend communication layer.
   ========================================================================== */

const API_BASE_URL = 'http://localhost:8000';

/**
 * Submit resume and job description for analysis.
 * @param {FormData} formData - Contains resume file and JD (file or text).
 * @returns {Promise<Object>} Analysis result conforming to the contract.
 */
async function analyzeResume(formData) {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    // Extract error message from the standard error shape
    const errorMsg = data?.error?.message
      || data?.detail?.error?.message
      || data?.detail
      || `Analysis failed (${response.status})`;
    throw new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
  }

  return data;
}

/**
 * Check backend health.
 * @returns {Promise<Object>}
 */
async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return await response.json();
  } catch (e) {
    return { status: 'unreachable' };
  }
}
