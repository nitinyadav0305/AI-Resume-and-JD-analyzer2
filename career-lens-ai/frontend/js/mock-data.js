/* ==========================================================================
   CareerLens AI — Mock Analysis Data
   This file provides realistic demonstration data for the frontend.
   
   FUTURE:
   Replace this mock data with responses from POST /api/analyze
   ========================================================================== */

const MOCK_ANALYSIS = {
  overallScore: 82,

  scoreLabel: 'Strong Match',

  scoreDescription: 'Your profile aligns well with this role. With a few targeted improvements, you could be an excellent candidate.',

  scoreBreakdown: {
    skills:     { score: 90, weight: 45 },
    experience: { score: 84, weight: 25 },
    projects:   { score: 78, weight: 15 },
    education:  { score: 100, weight: 10 },
    other:      { score: 70, weight: 5 }
  },

  executiveSummary: 'Your backend and Python experience align strongly with the role. Docker and AWS are the biggest gaps. Prioritize deployment experience and cloud certifications before applying.',

  matchedSkills: [
    {
      name: 'Python',
      matchType: 'Strong match',
      evidence: 'Developed ML pipelines using Python and scikit-learn, processing 50K+ records daily.'
    },
    {
      name: 'JavaScript',
      matchType: 'Strong match',
      evidence: 'Built interactive dashboards with React and Node.js for internal analytics tools.'
    },
    {
      name: 'SQL',
      matchType: 'Strong match',
      evidence: 'Designed and optimized complex SQL queries across PostgreSQL and MySQL databases.'
    },
    {
      name: 'REST APIs',
      matchType: 'Strong match',
      evidence: 'Designed RESTful APIs using FastAPI serving 10K+ requests per minute.'
    },
    {
      name: 'Git',
      matchType: 'Strong match',
      evidence: 'Maintained Git workflows with feature branching, code reviews, and CI/CD integration.'
    },
    {
      name: 'Machine Learning',
      matchType: 'Strong match',
      evidence: 'Implemented classification and regression models using scikit-learn and TensorFlow.'
    },
    {
      name: 'NLP',
      matchType: 'Strong match',
      evidence: 'Built text classification system using spaCy and transformer models for customer support automation.'
    },
    {
      name: 'Linux',
      matchType: 'Strong match',
      evidence: 'Managed Ubuntu-based servers and automated deployments using shell scripts.'
    }
  ],

  partialMatches: [
    {
      name: 'AWS',
      matchType: 'Partial match',
      evidence: 'Deployed applications to cloud environments; limited direct AWS experience mentioned.'
    },
    {
      name: 'CI/CD',
      matchType: 'Partial match',
      evidence: 'Experience with GitHub Actions for testing; no mention of full deployment pipelines.'
    }
  ],

  missingSkills: [
    {
      name: 'Docker',
      matchType: 'Not found',
      evidence: 'Required by job description. No Docker experience found in resume.'
    },
    {
      name: 'Kubernetes',
      matchType: 'Not found',
      evidence: 'Required by job description. No Kubernetes experience found in resume.'
    },
    {
      name: 'Terraform',
      matchType: 'Not found',
      evidence: 'Required by job description. No infrastructure-as-code experience found.'
    }
  ],

  evidence: [
    {
      requirement: '3+ years Python development',
      resumeEvidence: 'Developed ML pipelines using Python and scikit-learn (2021–2024)',
      matchType: 'matched',
      confidence: 'High'
    },
    {
      requirement: 'Experience with REST API design',
      resumeEvidence: 'Designed RESTful APIs using FastAPI serving 10K+ requests/min',
      matchType: 'matched',
      confidence: 'High'
    },
    {
      requirement: 'SQL and database management',
      resumeEvidence: 'Optimized complex queries across PostgreSQL and MySQL databases',
      matchType: 'matched',
      confidence: 'High'
    },
    {
      requirement: 'Docker containerization',
      resumeEvidence: 'No direct Docker experience mentioned',
      matchType: 'missing',
      confidence: 'Low'
    },
    {
      requirement: 'AWS cloud services',
      resumeEvidence: 'Deployed applications to cloud environments',
      matchType: 'partial',
      confidence: 'Medium'
    },
    {
      requirement: 'Machine Learning experience',
      resumeEvidence: 'Implemented classification and regression models using scikit-learn',
      matchType: 'matched',
      confidence: 'High'
    },
    {
      requirement: 'CI/CD pipeline management',
      resumeEvidence: 'Used GitHub Actions for automated testing',
      matchType: 'partial',
      confidence: 'Medium'
    },
    {
      requirement: 'Kubernetes orchestration',
      resumeEvidence: 'No Kubernetes experience mentioned',
      matchType: 'missing',
      confidence: 'Low'
    }
  ],

  experienceAnalysis: {
    score: 84,
    strongAlignment: [
      'Over 3 years of hands-on Python development in production environments',
      'Significant experience building and shipping ML-powered products',
      'Proven API design and backend architecture skills',
      'Collaborative development with code reviews and agile workflows'
    ],
    missingEvidence: [
      'No container orchestration or microservices architecture experience documented',
      'Cloud infrastructure management experience is vague',
      'No mention of on-call or production incident experience'
    ],
    potentialConcerns: [
      'Cloud deployment experience may be limited to basic deployments',
      'No evidence of working in large-scale distributed systems'
    ]
  },

  projectRelevance: [
    {
      name: 'AI Resume Analyzer',
      relevantSkills: ['Python', 'NLP', 'LangChain', 'REST APIs'],
      relevance: 'High'
    },
    {
      name: 'Customer Support Chatbot',
      relevantSkills: ['Machine Learning', 'NLP', 'Python', 'FastAPI'],
      relevance: 'High'
    },
    {
      name: 'Analytics Dashboard',
      relevantSkills: ['JavaScript', 'React', 'SQL', 'REST APIs'],
      relevance: 'Medium'
    }
  ],

  recommendations: [
    {
      priority: 'HIGH',
      text: 'Add Docker deployment experience to your project section.',
      reason: 'Docker is listed as a required skill in the target JD. Even a personal project using Docker Compose would demonstrate familiarity.'
    },
    {
      priority: 'HIGH',
      text: 'Gain hands-on AWS experience and add it to your resume.',
      reason: 'AWS is a core requirement. Consider getting an AWS Cloud Practitioner certification as a starting point.'
    },
    {
      priority: 'MEDIUM',
      text: 'Document your CI/CD pipeline experience in more detail.',
      reason: 'Your GitHub Actions experience could be expanded to show full deployment automation.'
    },
    {
      priority: 'MEDIUM',
      text: 'Quantify your ML project impact with metrics.',
      reason: 'Adding accuracy, latency, or cost-saving metrics strengthens your ML experience narrative.'
    },
    {
      priority: 'LOW',
      text: 'Consider adding Kubernetes basics to your skillset.',
      reason: 'While not immediately blocking, K8s knowledge would complement your Docker skills and strengthen your DevOps profile.'
    }
  ],

  learningPriorities: [
    {
      name: 'Docker',
      why: 'Docker is a hard requirement in the JD and a fundamental containerization skill.',
      whatToLearn: 'Dockerfile creation, Docker Compose, multi-stage builds, container networking.',
      nextStep: 'Containerize one of your existing Python projects and push the image to Docker Hub.'
    },
    {
      name: 'AWS',
      why: 'Cloud deployment is a core responsibility of the role.',
      whatToLearn: 'EC2, S3, IAM, Lambda basics, and deploying a web application on AWS.',
      nextStep: 'Deploy your FastAPI application to AWS using EC2 or Elastic Beanstalk.'
    },
    {
      name: 'Kubernetes',
      why: 'Container orchestration is increasingly expected for backend/ML engineering roles.',
      whatToLearn: 'Pods, Deployments, Services, ConfigMaps, and basic kubectl usage.',
      nextStep: 'Set up a local Minikube cluster and deploy a simple app with a Kubernetes manifest.'
    }
  ],

  interviewQuestions: [
    {
      category: 'Technical',
      difficulty: 'Medium',
      question: 'How would you containerize a Python ML application for production deployment?',
      reason: 'Docker appears as a required skill in the JD and your resume lacks Docker experience.',
      answerFramework: 'Start by explaining Dockerfile basics: choosing a base image (e.g., python:3.11-slim), copying requirements, installing dependencies, and setting an entrypoint. Then discuss Docker Compose for multi-service setups, multi-stage builds to optimize image size, and how you would handle model artifacts and environment variables.'
    },
    {
      category: 'Technical',
      difficulty: 'Hard',
      question: 'Describe how you would design an API to serve ML model predictions at scale.',
      reason: 'Your FastAPI experience is strong; this tests depth of knowledge in scaling.',
      answerFramework: 'Discuss async request handling with FastAPI, model loading strategies (lazy vs. eager), batching predictions, caching frequently requested results, horizontal scaling with load balancers, and monitoring prediction latency and accuracy in production.'
    },
    {
      category: 'Project',
      difficulty: 'Medium',
      question: 'Walk me through your AI Resume Analyzer project. What were the biggest technical challenges?',
      reason: 'This project is highly relevant to ML engineering and NLP.',
      answerFramework: 'Structure your answer around: problem statement, architecture decisions, NLP pipeline design, challenges faced (e.g., text extraction from PDFs, handling diverse resume formats), and measurable outcomes.'
    },
    {
      category: 'Behavioral',
      difficulty: 'Easy',
      question: 'Tell me about a time you had to learn a new technology quickly for a project.',
      reason: 'This assesses your ability to close skill gaps, which is relevant given Docker/AWS gaps.',
      answerFramework: 'Use the STAR method: describe the Situation (project requirement), Task (what you needed to learn), Action (how you approached learning — courses, docs, prototyping), and Result (successful implementation and timeline).'
    },
    {
      category: 'Skill Gap',
      difficulty: 'Medium',
      question: 'What is your experience with cloud infrastructure and deployment pipelines?',
      reason: 'Your resume shows limited cloud experience, which is a gap for this role.',
      answerFramework: 'Be honest about your current level, then pivot to related experience (deploying to servers, using GitHub Actions). Show enthusiasm for learning and mention any cloud-related self-study or certifications in progress.'
    },
    {
      category: 'Technical',
      difficulty: 'Hard',
      question: 'How would you implement a real-time data processing pipeline using Python?',
      reason: 'Tests depth in backend engineering and data processing — core to the role.',
      answerFramework: 'Discuss message queues (RabbitMQ, Kafka), async processing with Celery or asyncio, data validation and transformation, error handling and retry logic, monitoring and alerting, and how you would ensure data consistency.'
    }
  ],

  ragInsights: {
    roleExpectations: 'Companies hiring for Software Engineer roles with ML focus typically expect candidates to have production deployment experience, not just model-building skills. The ability to containerize, deploy, and monitor ML applications is increasingly a baseline expectation.',
    skillContext: 'Docker and Kubernetes are critical because modern ML deployment relies on containerization for reproducibility and scaling. Without these skills, candidates often struggle with the transition from development to production environments.',
    learningPath: 'Start with Docker fundamentals (1–2 weeks), then move to basic AWS deployment (2–3 weeks), and finally explore Kubernetes basics (2–3 weeks). This sequence builds on each step and closes the three main gaps identified in your analysis.'
  },

  resumeImprovements: [
    {
      current: 'Built a machine learning model for customer classification.',
      suggested: 'Built and deployed a gradient-boosted classification model achieving 94% accuracy on customer segmentation, reducing manual review time by 35% across 50K+ monthly records.',
      note: 'Adding metrics and deployment context strengthens the impact statement.'
    },
    {
      current: 'Worked with REST APIs using FastAPI.',
      suggested: 'Designed and maintained RESTful APIs using FastAPI, handling 10K+ requests/minute with 99.9% uptime, including authentication, rate limiting, and structured error handling.',
      note: 'Quantifying throughput and adding reliability details demonstrates production-grade experience.'
    },
    {
      current: 'Used Python for data analysis.',
      suggested: 'Developed automated data analysis pipelines in Python using pandas and NumPy, processing 2M+ records daily to generate actionable business intelligence dashboards.',
      note: 'Specifying tools, scale, and business impact makes the experience concrete and compelling.'
    }
  ]
};


/* ==========================================================================
   Static Data for Insights Page
   ========================================================================== */

const MOCK_ROLES = [
  {
    title: 'AI Engineer',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'LLMs', 'MLOps', 'Docker'],
    responsibilities: 'Design and deploy AI/ML models for production applications. Build inference pipelines and optimize model performance.',
    interviewFocus: 'System design for ML, model optimization, production deployment, LLM fine-tuning'
  },
  {
    title: 'ML Engineer',
    skills: ['Python', 'scikit-learn', 'Spark', 'AWS SageMaker', 'Docker', 'SQL'],
    responsibilities: 'Build scalable ML pipelines. Manage model training, evaluation, and deployment lifecycles.',
    interviewFocus: 'Feature engineering, model evaluation, A/B testing, data pipeline design'
  },
  {
    title: 'Data Scientist',
    skills: ['Python', 'R', 'SQL', 'Tableau', 'Statistics', 'Machine Learning'],
    responsibilities: 'Analyze complex datasets to derive business insights. Build predictive models and communicate findings to stakeholders.',
    interviewFocus: 'Statistical analysis, hypothesis testing, data storytelling, SQL proficiency'
  },
  {
    title: 'Backend Developer',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'Docker', 'REST APIs'],
    responsibilities: 'Design and maintain server-side applications. Build APIs, manage databases, and ensure system reliability.',
    interviewFocus: 'System design, API design, database optimization, concurrency handling'
  },
  {
    title: 'Software Engineer',
    skills: ['Python', 'Java', 'Git', 'Docker', 'AWS', 'SQL'],
    responsibilities: 'Develop, test, and deploy software across the full stack. Collaborate with cross-functional teams on product features.',
    interviewFocus: 'Data structures, algorithms, system design, code quality, collaboration'
  },
  {
    title: 'Data Analyst',
    skills: ['SQL', 'Excel', 'Python', 'Tableau', 'Power BI', 'Statistics'],
    responsibilities: 'Transform raw data into meaningful reports and visualizations. Support business decisions with data-driven insights.',
    interviewFocus: 'SQL queries, data visualization, business metrics, analytical reasoning'
  }
];

const MOCK_SKILLS = [
  {
    name: 'Python',
    category: 'Programming Language',
    why: 'Python is the most widely used language in data science, ML, and backend development. Its rich ecosystem of libraries makes it indispensable.',
    roles: ['AI Engineer', 'ML Engineer', 'Data Scientist', 'Backend Developer']
  },
  {
    name: 'Machine Learning',
    category: 'AI / Data Science',
    why: 'ML powers predictive analytics, recommendation systems, and intelligent automation. Companies increasingly require ML literacy across engineering roles.',
    roles: ['AI Engineer', 'ML Engineer', 'Data Scientist']
  },
  {
    name: 'Docker',
    category: 'DevOps / Infrastructure',
    why: 'Docker enables consistent application deployment across environments. It is foundational for microservices, CI/CD, and cloud-native development.',
    roles: ['Software Engineer', 'Backend Developer', 'ML Engineer', 'AI Engineer']
  },
  {
    name: 'AWS',
    category: 'Cloud Platform',
    why: 'AWS dominates the cloud market. Knowledge of core services (EC2, S3, Lambda) is expected for most engineering and data roles.',
    roles: ['Software Engineer', 'Backend Developer', 'ML Engineer']
  },
  {
    name: 'Kubernetes',
    category: 'DevOps / Infrastructure',
    why: 'Kubernetes is the standard for container orchestration at scale. Essential for companies running distributed systems in production.',
    roles: ['Backend Developer', 'Software Engineer', 'ML Engineer']
  },
  {
    name: 'FastAPI',
    category: 'Web Framework',
    why: 'FastAPI is a modern, high-performance Python web framework ideal for building APIs. Its async support and automatic docs make it popular for ML serving.',
    roles: ['Backend Developer', 'AI Engineer', 'Software Engineer']
  },
  {
    name: 'SQL',
    category: 'Database / Query Language',
    why: 'SQL is the universal language for data retrieval. Every technical role requires at least intermediate SQL proficiency.',
    roles: ['Data Analyst', 'Data Scientist', 'Backend Developer', 'Software Engineer']
  },
  {
    name: 'LangChain',
    category: 'AI Framework',
    why: 'LangChain simplifies building applications with LLMs. Its tools for chains, agents, and RAG are increasingly sought after in AI engineering roles.',
    roles: ['AI Engineer', 'ML Engineer']
  }
];
