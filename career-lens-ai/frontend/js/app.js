/* ==========================================================================
   CareerLens AI — Application Controller
   State machine, event orchestration, and view management.
   Connected to real FastAPI backend.
   ========================================================================== */

const App = (() => {

  /* ---------- Application State ---------- */
  const state = {
    view: 'home',       // home | processing | results | how-it-works | insights
    resume: null,       // File object
    jd: {
      type: 'paste',   // 'upload' | 'paste'
      file: null,       // File object
      text: ''          // pasted text
    },
    analysisStatus: 'idle', // idle | validating | processing | success | error
    progressStep: 0,
    result: null,
    theme: 'light'
  };

  let processingTimer = null;
  let isAnalyzing = false; // duplicate-submission guard


  /* ======================================================================
     INITIALIZATION
     ====================================================================== */

  function init() {
    initTheme();
    renderCurrentView();
    bindGlobalEvents();
    initScrollObserver();
    checkBackendHealth();
  }


  /* ======================================================================
     BACKEND HEALTH CHECK
     ====================================================================== */

  async function checkBackendHealth() {
    try {
      const health = await checkHealth();
      if (health.status === 'ok') {
        console.log('✅ Backend connected');
      } else {
        console.warn('⚠️ Backend unreachable — analysis will not work');
      }
    } catch (e) {
      console.warn('⚠️ Backend health check failed:', e.message);
    }
  }


  /* ======================================================================
     THEME
     ====================================================================== */

  function initTheme() {
    const saved = localStorage.getItem('careerLensTheme');
    if (saved) {
      state.theme = saved;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      state.theme = 'dark';
    }
    applyTheme();
  }

  function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('careerLensTheme', state.theme);
    applyTheme();
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    UI.updateThemeIcon(state.theme);
  }


  /* ======================================================================
     VIEW MANAGEMENT
     ====================================================================== */

  function navigateTo(view) {
    // Hide all views
    document.querySelectorAll('.app-view').forEach(v => v.classList.add('hidden'));

    state.view = view;

    switch (view) {
      case 'home':
        UI.renderHomeView(state);
        document.getElementById('view-home').classList.remove('hidden');
        bindHomeEvents();
        updateAnalyzeButton();
        break;
      case 'processing':
        UI.renderProcessingView(state);
        document.getElementById('view-processing').classList.remove('hidden');
        break;
      case 'results':
        UI.renderResultsView(state);
        document.getElementById('view-results').classList.remove('hidden');
        bindResultsEvents();
        break;
      case 'how-it-works':
        UI.renderHowItWorksPage();
        document.getElementById('view-how-it-works').classList.remove('hidden');
        break;
      case 'insights':
        UI.renderInsightsPage();
        document.getElementById('view-insights').classList.remove('hidden');
        bindInsightsEvents();
        break;
    }

    updateActiveNav(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderCurrentView() {
    navigateTo(state.view);
  }

  function updateActiveNav(view) {
    document.querySelectorAll('.header__nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.view === view) link.classList.add('active');
    });
    document.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.view === view) link.classList.add('active');
    });
  }


  /* ======================================================================
     GLOBAL EVENTS
     ====================================================================== */

  function bindGlobalEvents() {
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Desktop nav
    document.querySelectorAll('.header__nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.dataset.view;
        if (view === 'home' && state.view === 'home') {
          document.getElementById('section-analyze')?.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigateTo(view);
        }
      });
    });

    // New Analysis CTA in header
    document.getElementById('header-new-analysis')?.addEventListener('click', () => {
      resetAnalysis();
      navigateTo('home');
    });

    // Mobile toggle
    document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => {
      const drawer = document.getElementById('mobile-nav');
      drawer.classList.toggle('open');
      document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
    });

    // Mobile nav links
    document.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.dataset.view;
        document.getElementById('mobile-nav').classList.remove('open');
        document.body.style.overflow = '';
        navigateTo(view);
      });
    });

    // Mobile new analysis
    document.getElementById('mobile-new-analysis')?.addEventListener('click', () => {
      document.getElementById('mobile-nav').classList.remove('open');
      document.body.style.overflow = '';
      resetAnalysis();
      navigateTo('home');
    });
  }


  /* ======================================================================
     HOME VIEW EVENTS
     ====================================================================== */

  function bindHomeEvents() {
    // Hero CTA
    document.getElementById('hero-cta')?.addEventListener('click', () => {
      document.getElementById('analyzer-section')?.scrollIntoView({ behavior: 'smooth' });
    });

    // See how it works link
    document.getElementById('hero-secondary-cta')?.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('section-how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    });

    // Resume upload
    bindFileUpload('resume-dropzone', 'resume-input', (file) => {
      state.resume = file;
      refreshAnalyzerUI();
    });

    // Resume remove
    document.getElementById('resume-remove')?.addEventListener('click', (e) => {
      e.stopPropagation();
      state.resume = null;
      refreshAnalyzerUI();
      UI.showToast('info', 'Resume removed.');
    });

    // JD tabs
    document.getElementById('jd-tab-upload')?.addEventListener('click', () => {
      state.jd.type = 'upload';
      refreshAnalyzerUI();
    });
    document.getElementById('jd-tab-paste')?.addEventListener('click', () => {
      state.jd.type = 'paste';
      refreshAnalyzerUI();
    });

    // JD file upload
    bindFileUpload('jd-dropzone', 'jd-file-input', (file) => {
      state.jd.file = file;
      refreshAnalyzerUI();
    });

    // JD remove
    document.getElementById('jd-remove')?.addEventListener('click', (e) => {
      e.stopPropagation();
      state.jd.file = null;
      refreshAnalyzerUI();
      UI.showToast('info', 'Job description removed.');
    });

    // JD text input
    document.getElementById('jd-text-input')?.addEventListener('input', (e) => {
      state.jd.text = e.target.value;
      const count = document.getElementById('jd-char-count');
      if (count) count.textContent = `${e.target.value.length.toLocaleString()} / 20,000 characters`;
      updateAnalyzeButton();
      UI.updateInputPreview(state);
    });

    // Analyze button
    document.getElementById('analyze-btn')?.addEventListener('click', startAnalysis);
  }


  /* ---------- File Upload Handler ---------- */
  function bindFileUpload(dropzoneId, inputId, onFile) {
    const dropzone = document.getElementById(dropzoneId);
    const input = document.getElementById(inputId);
    if (!dropzone) return;

    // Click to browse
    if (input) {
      input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          handleFileSelect(e.target.files[0], onFile);
        }
      });
    }

    // Drag events
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('drag-over');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      if (e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0], onFile);
      }
    });
  }

  function handleFileSelect(file, onFile) {
    // Validate: PDF only
    if (file.type !== 'application/pdf') {
      UI.showToast('error', 'Invalid file. Please upload a PDF.');
      return;
    }
    // Validate: Max 10 MB
    if (file.size > 10 * 1024 * 1024) {
      UI.showToast('error', 'File too large. Maximum size is 10 MB.');
      return;
    }
    onFile(file);
    UI.showToast('success', `${file.name} uploaded successfully.`);
  }


  /* ---------- Refresh Analyzer UI ---------- */
  function refreshAnalyzerUI() {
    // Re-render the analyzer grid
    const grid = document.querySelector('.analyzer__grid');
    if (grid) {
      grid.innerHTML = '';
      grid.appendChild(UI.renderResumeUpload(state));
      grid.appendChild(UI.renderJDInput(state));
    }

    // Rebind events
    bindHomeEvents();
    UI.updateInputPreview(state);
    updateAnalyzeButton();
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }


  /* ---------- Analyze Button State ---------- */
  function updateAnalyzeButton() {
    const btn = document.getElementById('analyze-btn');
    if (!btn) return;

    const hasResume = state.resume !== null;
    const hasJD = state.jd.file !== null || (state.jd.text && state.jd.text.trim().length > 0);

    btn.disabled = !(hasResume && hasJD);
  }


  /* ======================================================================
     ANALYSIS FLOW — REAL BACKEND
     ====================================================================== */

  async function startAnalysis() {
    if (isAnalyzing) return;

    // Validate inputs
    if (!state.resume) {
      UI.showToast('error', 'Please upload your resume.');
      return;
    }
    if (!state.jd.file && (!state.jd.text || state.jd.text.trim().length === 0)) {
      UI.showToast('error', 'Please provide a job description.');
      return;
    }

    isAnalyzing = true;
    state.analysisStatus = 'validating';

    // Show loading state on button
    const btn = document.getElementById('analyze-btn');
    if (btn) {
      btn.classList.add('btn--loading');
      btn.disabled = true;
      const btnText = btn.querySelector('.btn__text');
      if (btnText) btnText.textContent = 'Preparing analysis...';
    }

    // Short delay then switch to processing view
    setTimeout(async () => {
      state.analysisStatus = 'processing';
      state.progressStep = 0;
      navigateTo('processing');
      await runRealAnalysis();
    }, 600);
  }

  async function runRealAnalysis() {
    // Animate progress steps
    const totalSteps = UI.PROCESSING_STEPS.length;
    let stepIndex = 0;

    const stepInterval = setInterval(() => {
      if (stepIndex < totalSteps - 1) {
        stepIndex++;
        state.progressStep = stepIndex;
        UI.updateProcessingTimeline(stepIndex);
      }
    }, 2000);

    try {
      // Build FormData
      const formData = new FormData();
      formData.append('resume', state.resume);

      if (state.jd.file) {
        formData.append('jd_file', state.jd.file);
      } else if (state.jd.text) {
        formData.append('jd_text', state.jd.text);
      }

      // Call real backend
      const data = await analyzeResume(formData);

      clearInterval(stepInterval);

      // Mark all steps complete
      state.progressStep = totalSteps;
      UI.updateProcessingTimeline(totalSteps);

      // Wait a beat then show results
      setTimeout(() => {
        state.analysisStatus = 'success';
        state.result = data.result;
        isAnalyzing = false;
        navigateTo('results');
        UI.showToast('success', 'Analysis complete!');
      }, 800);

    } catch (error) {
      clearInterval(stepInterval);
      console.error('Analysis failed:', error);

      state.analysisStatus = 'error';
      isAnalyzing = false;

      UI.showToast('error', error.message || 'Analysis failed. Please try again.');

      // Go back to home
      setTimeout(() => {
        navigateTo('home');
      }, 1500);
    }
  }


  /* ======================================================================
     RESULTS VIEW EVENTS
     ====================================================================== */

  function bindResultsEvents() {
    // New Analysis buttons
    document.getElementById('results-new-analysis')?.addEventListener('click', () => {
      resetAnalysis();
      navigateTo('home');
    });
    document.getElementById('action-new-analysis')?.addEventListener('click', () => {
      resetAnalysis();
      navigateTo('home');
    });

    // Download report (placeholder)
    document.getElementById('action-download')?.addEventListener('click', () => {
      UI.showToast('info', 'Report download will be available in a future update.');
    });

    // Skills search
    document.getElementById('skills-search')?.addEventListener('input', (e) => {
      filterSkills(e.target.value);
    });

    // Skills filter tabs
    document.querySelectorAll('.skills-analysis__filter').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.skills-analysis__filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterSkillsByType(btn.dataset.filter);
      });
    });

    // Interview filter tabs
    document.querySelectorAll('.interview__filter').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.interview__filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const list = document.getElementById('interview-list');
        UI.renderInterviewCards(list, state.result.interviewQuestions, btn.dataset.category);
      });
    });
  }

  function filterSkills(query) {
    const cards = document.querySelectorAll('.skill-card');
    const q = query.toLowerCase();
    cards.forEach(card => {
      const name = card.dataset.name;
      card.style.display = name.includes(q) ? '' : 'none';
    });
  }

  function filterSkillsByType(type) {
    const cards = document.querySelectorAll('.skill-card');
    cards.forEach(card => {
      if (type === 'all') {
        card.style.display = '';
      } else {
        card.style.display = card.dataset.type === type ? '' : 'none';
      }
    });
    const search = document.getElementById('skills-search');
    if (search) search.value = '';
  }


  /* ======================================================================
     INSIGHTS VIEW EVENTS
     ====================================================================== */

  function bindInsightsEvents() {
    document.getElementById('skill-explorer-search')?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const cards = document.querySelectorAll('.skill-explore-card');
      cards.forEach(card => {
        const name = card.dataset.skillName;
        card.style.display = name.includes(q) ? '' : 'none';
      });
    });
  }


  /* ======================================================================
     RESET
     ====================================================================== */

  function resetAnalysis() {
    state.resume = null;
    state.jd = { type: 'paste', file: null, text: '' };
    state.analysisStatus = 'idle';
    state.progressStep = 0;
    state.result = null;
    isAnalyzing = false;

    if (processingTimer) {
      clearTimeout(processingTimer);
      processingTimer = null;
    }
  }


  /* ======================================================================
     SCROLL OBSERVER (fade-in animations)
     ====================================================================== */

  function initScrollObserver() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  }


  /* ======================================================================
     BOOT
     ====================================================================== */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { state, navigateTo, resetAnalysis, toggleTheme };

})();
