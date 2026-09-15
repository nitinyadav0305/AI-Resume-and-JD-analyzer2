/* ==========================================================================
   CareerLens AI — UI Rendering Module
   SANKET-inspired organic, premium design.
   ========================================================================== */

const UI = (() => {

  /* ---------- SVG Icons (inline) ---------- */
  const ICONS = {
    upload: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>',
    file: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>',
    x: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>',
    search: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>',
    sun: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/></svg>',
    moon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>',
    arrowRight: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>',
    sparkle: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"/></svg>',
    clipboard: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"/></svg>',
    target: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    lightbulb: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/></svg>',
    rocket: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/></svg>',
    shield: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>',
    chartBar: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>',
    warning: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/></svg>',
    download: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>',
    brain: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z"/></svg>',
    academic: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/></svg>',
  };

  /* ---------- Processing Steps ---------- */
  const PROCESSING_STEPS = [
    'Extracting resume content',
    'Parsing job description',
    'Analyzing skills match',
    'Scoring experience & projects',
    'Generating insights & recommendations',
    'Preparing interview questions',
  ];

  /* ---------- Helper Functions ---------- */
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function getScoreColor(score) {
    if (score >= 75) return 'var(--score-high)';
    if (score >= 50) return 'var(--score-medium)';
    return 'var(--score-low)';
  }

  function getScoreLabel(score) {
    if (score >= 85) return 'Excellent Match';
    if (score >= 70) return 'Strong Match';
    if (score >= 50) return 'Moderate Match';
    return 'Needs Improvement';
  }


  /* ======================================================================
     RENDER: Home / Analyzer View
     ====================================================================== */

  function renderHomeView(state) {
    const container = document.getElementById('view-home');
    container.innerHTML = '';
    container.className = 'view-enter';

    // Hero Section
    container.innerHTML = `
      <section class="hero" id="section-analyze">
        <div class="container">
          <span class="hero__eyebrow">${ICONS.sparkle} AI-Powered Career Intelligence</span>
          <h1 class="hero__title">See exactly how well <span class="highlight">your resume</span> fits the job.</h1>
          <p class="hero__subtitle">Upload your resume and a job description to uncover your match score, skill gaps, evidence, and personalized interview preparation.</p>
          <div class="hero__actions">
            <button class="btn btn--primary btn--lg" id="hero-cta">
              <span>Analyze My Resume</span> ${ICONS.arrowRight}
            </button>
            <a class="btn btn--secondary btn--lg" href="#section-how-it-works" id="hero-secondary-cta">See How It Works</a>
          </div>
          <div class="hero__trust">
            <span class="hero__trust-item">${ICONS.check} No account required</span>
            <span class="hero__trust-item">${ICONS.shield} Files deleted after analysis</span>
            <span class="hero__trust-item">${ICONS.sparkle} AI-powered insights</span>
          </div>
        </div>
      </section>

      <section class="stats-bar">
        <div class="container">
          <div class="stats-bar__inner">
            <div class="stats-bar__grid">
              <div class="stats-bar__item">
                <div class="stats-bar__value">5</div>
                <div class="stats-bar__label">Score Categories</div>
              </div>
              <div class="stats-bar__item">
                <div class="stats-bar__value">AI</div>
                <div class="stats-bar__label">Powered Analysis</div>
              </div>
              <div class="stats-bar__item">
                <div class="stats-bar__value">6+</div>
                <div class="stats-bar__label">Interview Questions</div>
              </div>
              <div class="stats-bar__item">
                <div class="stats-bar__value">100%</div>
                <div class="stats-bar__label">Privacy First</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="analyzer-section" id="analyzer-section">
        <div class="container">
          <div class="analyzer-section__title">
            <h2>Start Your Analysis</h2>
            <p>Upload your resume and provide a job description to begin</p>
          </div>
          <div class="analyzer__grid" id="analyzer-grid"></div>
          <div class="analyzer__actions">
            <button class="btn btn--primary btn--lg" id="analyze-btn" disabled>
              <span class="btn__text">Analyze Match</span> ${ICONS.arrowRight}
            </button>
          </div>
          <div class="analyzer__preview" id="input-preview" style="display:none"></div>
        </div>
      </section>

      <section class="how-it-works" id="section-how-it-works">
        <div class="container">
          <div class="section-header">
            <span class="section-badge">How It Works</span>
            <h2 class="section-title">Three Steps to Career Clarity</h2>
            <p class="section-subtitle">Our AI analyzes your resume against the job description using structured extraction, skill matching, and intelligent scoring.</p>
          </div>
          <div class="how-steps">
            <div class="how-step-card fade-up">
              <div class="how-step-card__icon">${ICONS.upload}</div>
              <div class="how-step-card__step">Step 01</div>
              <div class="how-step-card__title">Upload Documents</div>
              <div class="how-step-card__desc">Upload your resume PDF and provide the job description — paste text or upload a PDF.</div>
            </div>
            <div class="how-step-card fade-up">
              <div class="how-step-card__icon">${ICONS.brain}</div>
              <div class="how-step-card__step">Step 02</div>
              <div class="how-step-card__title">AI Analysis</div>
              <div class="how-step-card__desc">Our AI extracts structured data, normalizes skills, computes weighted scores, and generates evidence-based insights.</div>
            </div>
            <div class="how-step-card fade-up">
              <div class="how-step-card__icon">${ICONS.target}</div>
              <div class="how-step-card__step">Step 03</div>
              <div class="how-step-card__title">Get Results</div>
              <div class="how-step-card__desc">Receive your match score, skill gaps, recommendations, learning priorities, and personalized interview questions.</div>
            </div>
          </div>
        </div>
      </section>
    `;

    // Render upload components into the grid
    const grid = document.getElementById('analyzer-grid');
    grid.appendChild(renderResumeUpload(state));
    grid.appendChild(renderJDInput(state));
  }


  /* ---------- Resume Upload Component ---------- */
  function renderResumeUpload(state) {
    const section = document.createElement('div');
    section.className = 'upload-section';

    let content = `<label class="jd-input__section-label">${ICONS.file} Your Resume</label>`;

    if (state.resume) {
      content += `
        <div class="upload has-file" id="resume-dropzone">
          <div class="upload__icon">${ICONS.check}</div>
          <div class="upload__file-info">
            <div class="upload__file-name">📄 ${state.resume.name}</div>
            <div class="upload__file-size">${formatFileSize(state.resume.size)}</div>
            <div class="upload__file-status">Ready to analyze</div>
          </div>
          <button class="upload__remove" id="resume-remove">Remove</button>
        </div>`;
    } else {
      content += `
        <div class="upload" id="resume-dropzone">
          <div class="upload__icon">${ICONS.upload}</div>
          <div class="upload__label">Upload your resume</div>
          <div class="upload__hint">PDF • Max 10 MB</div>
          <div class="upload__browse">Drag & drop or <strong>Browse</strong></div>
          <input type="file" class="upload__input" id="resume-input" accept=".pdf" aria-label="Upload resume PDF">
        </div>`;
    }

    section.innerHTML = content;
    return section;
  }

  /* ---------- JD Input Component ---------- */
  function renderJDInput(state) {
    const section = document.createElement('div');
    section.className = 'jd-input-section';

    const jdType = state.jd.type || 'paste';
    let content = `
      <label class="jd-input__section-label">${ICONS.clipboard} Job Description</label>
      <div class="jd-input__tabs">
        <button class="jd-input__tab${jdType === 'upload' ? ' active' : ''}" id="jd-tab-upload">Upload PDF</button>
        <button class="jd-input__tab${jdType === 'paste' ? ' active' : ''}" id="jd-tab-paste">Paste Text</button>
      </div>`;

    if (jdType === 'upload') {
      if (state.jd.file) {
        content += `
          <div class="upload has-file" id="jd-dropzone">
            <div class="upload__icon">${ICONS.check}</div>
            <div class="upload__file-info">
              <div class="upload__file-name">📄 ${state.jd.file.name}</div>
              <div class="upload__file-size">${formatFileSize(state.jd.file.size)}</div>
              <div class="upload__file-status">Ready to analyze</div>
            </div>
            <button class="upload__remove" id="jd-remove">Remove</button>
          </div>`;
      } else {
        content += `
          <div class="upload" id="jd-dropzone">
            <div class="upload__icon">${ICONS.upload}</div>
            <div class="upload__label">Upload job description</div>
            <div class="upload__hint">PDF • Max 10 MB</div>
            <div class="upload__browse">Drag & drop or <strong>Browse</strong></div>
            <input type="file" class="upload__input" id="jd-file-input" accept=".pdf" aria-label="Upload job description PDF">
          </div>`;
      }
    } else {
      content += `
        <textarea class="jd-input__textarea" id="jd-text-input" placeholder="Paste the job description here..." aria-label="Paste job description text" rows="8">${state.jd.text || ''}</textarea>
        <div class="jd-input__char-count" id="jd-char-count">${(state.jd.text || '').length.toLocaleString()} / 20,000 characters</div>`;
    }

    section.innerHTML = content;
    return section;
  }


  /* ======================================================================
     RENDER: Processing View
     ====================================================================== */

  function renderProcessingView(state) {
    const container = document.getElementById('view-processing');
    container.innerHTML = '';
    container.className = 'view-enter';

    let stepsHTML = PROCESSING_STEPS.map((step, i) => `
      <div class="processing-step ${i === 0 ? 'active' : ''}" data-step="${i}">
        <div class="processing-step__indicator">${ICONS.check}</div>
        <div class="processing-step__text">${step}</div>
      </div>
    `).join('');

    container.innerHTML = `
      <section class="processing">
        <div class="container">
          <div class="processing__spinner"></div>
          <h1 class="processing__title">Analyzing Your Application</h1>
          <p class="processing__subtitle">Our AI is processing your resume and job description. This usually takes 30–60 seconds.</p>
          <div class="processing__timeline">${stepsHTML}</div>
        </div>
      </section>`;
  }

  function updateProcessingTimeline(currentStep) {
    const steps = document.querySelectorAll('.processing-step');
    steps.forEach((step, i) => {
      step.classList.remove('active', 'complete');
      if (i < currentStep) step.classList.add('complete');
      else if (i === currentStep) step.classList.add('active');
    });
  }


  /* ======================================================================
     RENDER: Results View
     ====================================================================== */

  function renderResultsView(state) {
    const container = document.getElementById('view-results');
    container.innerHTML = '';
    container.className = 'view-enter';

    const r = state.result;
    if (!r) return;

    const scoreColor = getScoreColor(r.overallScore);
    const scoreLabel = getScoreLabel(r.overallScore);

    // SVG circle math
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (r.overallScore / 100) * circumference;

    // Score breakdown items
    const breakdown = r.scoreBreakdown || {};
    const breakdownHTML = ['skills', 'experience', 'projects', 'education', 'other'].map(key => {
      const val = breakdown[key] || 0;
      const color = getScoreColor(val);
      return `
        <div class="score-breakdown__item">
          <div class="score-breakdown__value" style="color:${color}">${Math.round(val)}</div>
          <div class="score-breakdown__bar"><div class="score-breakdown__bar-fill" style="width:${val}%;background:${color}"></div></div>
          <div class="score-breakdown__label">${key}</div>
        </div>`;
    }).join('');

    // Skills cards
    const skillsHTML = [
      ...(r.matchedSkills || []).map(s => `<div class="skill-card" data-type="matched" data-name="${s.toLowerCase()}"><span class="skill-card__dot"></span>${s}</div>`),
      ...(r.partialMatches || []).map(s => `<div class="skill-card" data-type="partial" data-name="${s.toLowerCase()}"><span class="skill-card__dot"></span>${s}</div>`),
      ...(r.missingSkills || []).map(s => `<div class="skill-card" data-type="missing" data-name="${s.toLowerCase()}"><span class="skill-card__dot"></span>${s}</div>`),
    ].join('');

    // Evidence
    const evidenceHTML = (r.evidence || []).map(e => `
      <div class="evidence-card">
        <div class="evidence-card__dot evidence-card__dot--${e.matched ? 'matched' : 'missing'}"></div>
        <div class="evidence-card__content">
          <div class="evidence-card__skill">${e.skill}</div>
          <div class="evidence-card__source">${e.source}</div>
          <div class="evidence-card__reasoning">${e.reasoning}</div>
        </div>
      </div>`).join('');

    // Recommendations
    const recsHTML = (r.recommendations || []).map(rec => `
      <div class="rec-card">
        <div class="rec-card__header">
          <div class="rec-card__title">${rec.title}</div>
          <span class="rec-card__priority rec-card__priority--${rec.priority}">${rec.priority}</span>
        </div>
        <div class="rec-card__detail">${rec.detail}</div>
      </div>`).join('');

    // Learning priorities
    const learningHTML = (r.learningPriorities || []).map(lp => `
      <div class="learning-card">
        <div class="learning-card__skill">${lp.skill}</div>
        <div class="learning-card__reason">${lp.reason}</div>
        <div class="learning-card__resources">${(lp.suggestedResources || []).map(r => `<span class="learning-card__resource">${r}</span>`).join('')}</div>
      </div>`).join('');

    // Interview questions
    const questionsHTML = (r.interviewQuestions || []).map(q => `
      <div class="interview-card">
        <span class="interview-card__category interview-card__category--${q.category}">${q.category}</span>
        <div class="interview-card__question">${q.question}</div>
        ${q.relatedSkill ? `<div class="interview-card__skill">Related: ${q.relatedSkill}</div>` : ''}
      </div>`).join('');

    // RAG Insights
    const insightsHTML = (r.ragInsights || []).map(text => `
      <div class="insight-card">
        <div class="insight-card__icon">${ICONS.lightbulb}</div>
        <div class="insight-card__text">${text}</div>
      </div>`).join('');

    // Experience & Project analysis
    const expAnalysis = r.experienceAnalysis || {};
    const projAnalysis = r.projectAnalysis || {};

    const expDetailHTML = expAnalysis.summary ? `
      <div class="analysis-detail">
        <div class="analysis-detail__summary">${expAnalysis.summary}</div>
        ${expAnalysis.details?.length ? `<ul class="analysis-detail__list">${expAnalysis.details.map(d => `<li>${d}</li>`).join('')}</ul>` : ''}
      </div>` : '';

    const projDetailHTML = projAnalysis.summary ? `
      <div class="analysis-detail">
        <div class="analysis-detail__summary">${projAnalysis.summary}</div>
        ${projAnalysis.details?.length ? `<ul class="analysis-detail__list">${projAnalysis.details.map(d => `<li>${d}</li>`).join('')}</ul>` : ''}
      </div>` : '';

    container.innerHTML = `
      <section class="results">
        <div class="container">
          <div class="results__header">
            <h1>Your Analysis Results</h1>
            <p>${r.summary || ''}</p>
          </div>

          <div class="score-ring-container">
            <div class="score-ring">
              <svg viewBox="0 0 200 200">
                <circle class="score-ring__bg" cx="100" cy="100" r="${radius}" />
                <circle class="score-ring__fg" cx="100" cy="100" r="${radius}"
                  stroke="${scoreColor}"
                  stroke-dasharray="${circumference}"
                  stroke-dashoffset="${offset}" />
              </svg>
              <div class="score-ring__label">
                <div class="score-ring__value" style="color:${scoreColor}">${Math.round(r.overallScore)}</div>
                <div class="score-ring__text" style="color:${scoreColor}">${scoreLabel}</div>
              </div>
            </div>
          </div>

          <div class="score-breakdown">${breakdownHTML}</div>

          <div class="results__actions">
            <button class="btn btn--primary" id="action-new-analysis">${ICONS.arrowRight} New Analysis</button>
          </div>

          ${insightsHTML ? `
          <div class="results-section">
            <div class="results-section__header">
              <div class="results-section__icon">${ICONS.lightbulb}</div>
              <div class="results-section__title">AI Insights</div>
            </div>
            ${insightsHTML}
          </div>` : ''}

          <div class="results-section">
            <div class="results-section__header">
              <div class="results-section__icon">${ICONS.target}</div>
              <div class="results-section__title">Skills Analysis</div>
            </div>
            <div class="skills-analysis__controls">
              <button class="skills-analysis__filter active" data-filter="all">All</button>
              <button class="skills-analysis__filter" data-filter="matched">Matched</button>
              <button class="skills-analysis__filter" data-filter="partial">Partial</button>
              <button class="skills-analysis__filter" data-filter="missing">Missing</button>
              <input type="text" class="skills-search" id="skills-search" placeholder="Search skills...">
            </div>
            <div class="skills-grid">${skillsHTML}</div>
          </div>

          ${expDetailHTML ? `
          <div class="results-section">
            <div class="results-section__header">
              <div class="results-section__icon">${ICONS.chartBar}</div>
              <div class="results-section__title">Experience Analysis</div>
            </div>
            ${expDetailHTML}
          </div>` : ''}

          ${projDetailHTML ? `
          <div class="results-section">
            <div class="results-section__header">
              <div class="results-section__icon">${ICONS.rocket}</div>
              <div class="results-section__title">Project Analysis</div>
            </div>
            ${projDetailHTML}
          </div>` : ''}

          ${evidenceHTML ? `
          <div class="results-section">
            <div class="results-section__header">
              <div class="results-section__icon">${ICONS.shield}</div>
              <div class="results-section__title">Evidence</div>
            </div>
            ${evidenceHTML}
          </div>` : ''}

          ${recsHTML ? `
          <div class="results-section">
            <div class="results-section__header">
              <div class="results-section__icon">${ICONS.sparkle}</div>
              <div class="results-section__title">Recommendations</div>
            </div>
            ${recsHTML}
          </div>` : ''}

          ${learningHTML ? `
          <div class="results-section">
            <div class="results-section__header">
              <div class="results-section__icon">${ICONS.academic}</div>
              <div class="results-section__title">Learning Priorities</div>
            </div>
            ${learningHTML}
          </div>` : ''}

          ${questionsHTML ? `
          <div class="results-section">
            <div class="results-section__header">
              <div class="results-section__icon">${ICONS.brain}</div>
              <div class="results-section__title">Interview Preparation</div>
            </div>
            <div class="interview__filters">
              <button class="interview__filter active" data-category="all">All</button>
              <button class="interview__filter" data-category="technical">Technical</button>
              <button class="interview__filter" data-category="behavioral">Behavioral</button>
              <button class="interview__filter" data-category="gap-focused">Gap-Focused</button>
            </div>
            <div id="interview-list">${questionsHTML}</div>
          </div>` : ''}

          <div class="results__actions" style="margin-top:3rem">
            <button class="btn btn--primary btn--lg" id="results-new-analysis">Start New Analysis</button>
          </div>
        </div>
      </section>`;
  }

  function renderInterviewCards(container, questions, category) {
    if (!container) return;
    const filtered = category === 'all' ? questions : questions.filter(q => q.category === category);
    container.innerHTML = filtered.map(q => `
      <div class="interview-card">
        <span class="interview-card__category interview-card__category--${q.category}">${q.category}</span>
        <div class="interview-card__question">${q.question}</div>
        ${q.relatedSkill ? `<div class="interview-card__skill">Related: ${q.relatedSkill}</div>` : ''}
      </div>`).join('');
  }


  /* ======================================================================
     RENDER: How It Works Page
     ====================================================================== */

  function renderHowItWorksPage() {
    const container = document.getElementById('view-how-it-works');
    container.innerHTML = '';
    container.className = 'view-enter';

    container.innerHTML = `
      <section class="how-it-works">
        <div class="container">
          <div class="section-header">
            <span class="section-badge">Complete Guide</span>
            <h2 class="section-title">How CareerLens AI Works</h2>
            <p class="section-subtitle">A deep dive into our analysis pipeline — from document upload to personalized career insights.</p>
          </div>
          <div class="how-steps">
            <div class="how-step-card">
              <div class="how-step-card__icon">${ICONS.upload}</div>
              <div class="how-step-card__step">Step 01</div>
              <div class="how-step-card__title">Document Upload</div>
              <div class="how-step-card__desc">Your resume PDF is securely uploaded and parsed using PyPDFLoader. Text is extracted, chunked, and prepared for AI analysis. No data is stored permanently.</div>
            </div>
            <div class="how-step-card">
              <div class="how-step-card__icon">${ICONS.brain}</div>
              <div class="how-step-card__step">Step 02</div>
              <div class="how-step-card__title">Structured Extraction</div>
              <div class="how-step-card__desc">Our AI (powered by ChatGroq) extracts structured information from both your resume and the job description — skills, experience, education, projects, and certifications.</div>
            </div>
            <div class="how-step-card">
              <div class="how-step-card__icon">${ICONS.target}</div>
              <div class="how-step-card__step">Step 03</div>
              <div class="how-step-card__title">Skill Matching</div>
              <div class="how-step-card__desc">Skills are normalized (e.g. "ReactJS" → "react.js") and matched using set operations. Partial matches are identified through substring and word-overlap analysis.</div>
            </div>
            <div class="how-step-card">
              <div class="how-step-card__icon">${ICONS.chartBar}</div>
              <div class="how-step-card__step">Step 04</div>
              <div class="how-step-card__title">Weighted Scoring</div>
              <div class="how-step-card__desc">Five categories are scored: Skills (45%), Experience (25%), Projects (15%), Education (10%), and Other (5%). Each produces a 0–100 score for a weighted overall result.</div>
            </div>
            <div class="how-step-card">
              <div class="how-step-card__icon">${ICONS.sparkle}</div>
              <div class="how-step-card__step">Step 05</div>
              <div class="how-step-card__title">AI Insights</div>
              <div class="how-step-card__desc">The AI generates evidence-based recommendations, learning priorities for missing skills, interview preparation questions, and strategic insights about your fit.</div>
            </div>
            <div class="how-step-card">
              <div class="how-step-card__icon">${ICONS.shield}</div>
              <div class="how-step-card__step">Step 06</div>
              <div class="how-step-card__title">Privacy First</div>
              <div class="how-step-card__desc">Your documents are processed in memory and deleted immediately after analysis. No account required, no data persistence, no tracking. Complete privacy by design.</div>
            </div>
          </div>
        </div>
      </section>`;
  }


  /* ======================================================================
     RENDER: Insights Page
     ====================================================================== */

  function renderInsightsPage() {
    const container = document.getElementById('view-insights');
    container.innerHTML = '';
    container.className = 'view-enter';

    container.innerHTML = `
      <section class="insights-page">
        <div class="container">
          <div class="section-header">
            <span class="section-badge">Career Insights</span>
            <h2 class="section-title">Maximize Your Job Search</h2>
            <p class="section-subtitle">Expert tips and strategies to improve your resume-job fit and stand out in the application process.</p>
          </div>
          <div class="insights-grid">
            <div class="insight-tile">
              <div class="insight-tile__icon">${ICONS.target}</div>
              <div class="insight-tile__title">Tailor Every Application</div>
              <div class="insight-tile__desc">Customize your resume for each job posting. Mirror the language and keywords from the job description to improve ATS compatibility and recruiter engagement.</div>
            </div>
            <div class="insight-tile">
              <div class="insight-tile__icon">${ICONS.chartBar}</div>
              <div class="insight-tile__title">Quantify Achievements</div>
              <div class="insight-tile__desc">Replace vague descriptions with measurable outcomes. "Increased sales by 30%" is far more impactful than "responsible for sales growth."</div>
            </div>
            <div class="insight-tile">
              <div class="insight-tile__icon">${ICONS.brain}</div>
              <div class="insight-tile__title">Address Skill Gaps</div>
              <div class="insight-tile__desc">Missing a required skill? Take a quick online course or build a small project to demonstrate capability. Even basic proficiency counts.</div>
            </div>
            <div class="insight-tile">
              <div class="insight-tile__icon">${ICONS.academic}</div>
              <div class="insight-tile__title">Project Portfolio</div>
              <div class="insight-tile__desc">Include relevant projects that showcase the exact skills the job requires. Open source contributions and personal projects demonstrate initiative.</div>
            </div>
            <div class="insight-tile">
              <div class="insight-tile__icon">${ICONS.sparkle}</div>
              <div class="insight-tile__title">Keywords Matter</div>
              <div class="insight-tile__desc">Many companies use Applicant Tracking Systems. Include exact skill names from the job posting in your resume to pass automated screening.</div>
            </div>
            <div class="insight-tile">
              <div class="insight-tile__icon">${ICONS.rocket}</div>
              <div class="insight-tile__title">Interview Prep</div>
              <div class="insight-tile__desc">Use CareerLens AI's interview questions to prepare for technical and behavioral questions specifically tailored to the role you're targeting.</div>
            </div>
          </div>
        </div>
      </section>`;
  }


  /* ======================================================================
     UTILITIES
     ====================================================================== */

  function showToast(type, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const iconMap = { success: ICONS.check, error: ICONS.warning, info: ICONS.info, warning: ICONS.warning };

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `${iconMap[type] || ICONS.info} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast--exit');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
    }
  }

  function updateInputPreview(state) {
    const preview = document.getElementById('input-preview');
    if (!preview) return;

    const hasResume = state.resume !== null;
    const hasJD = state.jd.file !== null || (state.jd.text && state.jd.text.trim().length > 0);

    if (hasResume || hasJD) {
      preview.style.display = 'flex';
      let items = [];
      if (hasResume) items.push(`<span class="analyzer__preview-badge">${ICONS.check} Resume: ${state.resume.name}</span>`);
      if (hasJD) items.push(`<span class="analyzer__preview-badge">${ICONS.check} Job Description: ${state.jd.file ? state.jd.file.name : 'Text provided'}</span>`);
      preview.innerHTML = items.join('');
    } else {
      preview.style.display = 'none';
    }
  }


  /* ======================================================================
     PUBLIC API
     ====================================================================== */

  return {
    ICONS,
    PROCESSING_STEPS,
    renderHomeView,
    renderResumeUpload,
    renderJDInput,
    renderProcessingView,
    renderResultsView,
    renderHowItWorksPage,
    renderInsightsPage,
    renderInterviewCards,
    updateProcessingTimeline,
    showToast,
    updateThemeIcon,
    updateInputPreview,
  };

})();
