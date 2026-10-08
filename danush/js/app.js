/**
 * ==============================================================================
 * GALAXY & PIXEL ART PORTFOLIO - CORE JAVASCRIPT
 * Author: Danush
 * Description: Interactive functionality covering Starfield Canvas, Theme Detection,
 *              Active Navigation, Project Detail Modals, Simulated AI Chat, and
 *              Contact Form with Resend API integration placeholders.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSystem();
  initCosmicStarfield();
  initNavigation();
  initSkillsProgress();
  initProjectsModal();
  initAiChatSection();
  initContactForm();
});

/* ------------------------------------------------------------------------------
 * PROMPT 1: Night Mode Toggle with CSS Media Query Detection
 * Detects the user's default browser theme using matchMedia('(prefers-color-scheme: dark)')
 * and enables manual override toggle with persistence in localStorage.
 * ------------------------------------------------------------------------------ */
function initThemeSystem() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeToggleText = document.getElementById('theme-toggle-text');
  const rootElement = document.documentElement;

  // Media query listener for default browser preference
  const mediaQueryDark = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('portfolio-theme');

  // Determine starting theme: saved preference -> browser preference -> fallback 'dark'
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (mediaQueryDark.matches) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  // Listen to system changes if user hasn't explicitly locked a preference
  mediaQueryDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Toggle button click event
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme') || (mediaQueryDark.matches ? 'dark' : 'light');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  }

  function applyTheme(theme) {
    rootElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`);
    }
    if (themeToggleText) {
      themeToggleText.textContent = theme === 'dark' ? 'Void (Dark)' : 'Solar (Light)';
    }
  }
}

/* ------------------------------------------------------------------------------
 * Dynamic Starfield Simulation (Canvas 60fps Ambient Cosmic Particle Engine)
 * ------------------------------------------------------------------------------ */
function initCosmicStarfield() {
  const canvas = document.getElementById('cosmic-starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const starsCount = 180;
  const stars = [];

  // Generate cosmic stars with varied depths, speeds, and spectral colors
  const colors = ['#ffffff', '#00f0ff', '#9d4edd', '#ffe66d', '#ff007f'];

  for (let i = 0; i < starsCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.4 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    });
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  function renderStars() {
    ctx.clearRect(0, 0, width, height);

    for (let star of stars) {
      star.y -= star.speed;
      if (star.y < 0) {
        star.y = height;
        star.x = Math.random() * width;
      }

      // Sine wave twinkle
      star.alpha += star.twinkleSpeed;
      const currentAlpha = Math.abs(Math.sin(star.alpha));

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = currentAlpha;
      ctx.shadowBlur = star.size * 2;
      ctx.shadowColor = star.color;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    requestAnimationFrame(renderStars);
  }

  renderStars();
}

/* ------------------------------------------------------------------------------
 * PROMPT 2: Vertical Navigation Bar Interactions & Accessibility
 * Handles section highlighting via IntersectionObserver and mobile menu toggle.
 * ------------------------------------------------------------------------------ */
function initNavigation() {
  const sidebar = document.getElementById('sidebar-nav');
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Mobile menu open / close toggle
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
      const isOpen = sidebar.classList.contains('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close menu when clicking outside or clicking any nav link
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target) && sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = '☰';
      }
    });
  }

  // Close mobile nav when clicking a link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
        if (mobileToggle) {
          mobileToggle.setAttribute('aria-expanded', 'false');
          mobileToggle.innerHTML = '☰';
        }
      }
    });
  });

  // IntersectionObserver to highlight currently visible section in left navbar
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/* ------------------------------------------------------------------------------
 * PROMPT 4: Skills Section Progress Bar Animations
 * Comments in code describe how each element represents a specific technical skill.
 * ------------------------------------------------------------------------------ */
function initSkillsProgress() {
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const skillsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-width') || '85%';
          bar.style.width = targetWidth;
          skillsObserver.unobserve(bar);
        }
      });
    },
    { threshold: 0.25 }
  );

  skillBars.forEach((bar) => {
    // Starts with 0% width until scrolled into viewport
    bar.style.width = '0%';
    skillsObserver.observe(bar);
  });
}

/* ------------------------------------------------------------------------------
 * PROMPT 6: Projects Section with Clickable Thumbnails and Detailed Modal View
 * Each thumbnail connects to a rich project detail item in the projectsData array.
 * ------------------------------------------------------------------------------ */
const projectsData = [
  {
    id: 'aethelred-telemetry',
    title: 'Aethelred Star Navigation (Nebula Cloud Telemetry)',
    category: 'Cloud Architecture & WebGL',
    image: 'assets/project_nebula_cloud.jpg',
    description:
      'A high-performance mission telemetry console designed for monitoring distributed cloud microservices with celestial-themed star charts. Features real-time WebSockets streaming, sub-50ms latency metrics, and interactive 3D constellation orbital calculations.',
    technologies: ['TypeScript', 'WebGL', 'Three.js', 'Node.js', 'Redis', 'Docker'],
    metrics: 'Handles 100K+ concurrent event telemetry packets per second',
    liveLink: 'https://github.com',
    codeLink: 'https://github.com',
  },
  {
    id: 'pixel-synth-engine',
    title: 'Pixel Synth Studio (Retro Game Engine)',
    category: 'Game Engine & WebAssembly',
    image: 'assets/project_pixel_synth.jpg',
    description:
      'An in-browser retro-futuristic sprite animator and 2D physics sandbox. Built with WebAssembly and Web Audio API, enabling developers to prototype 16-bit cyber-synth games with realtime hot-reloading and chiptune sound synthesis.',
    technologies: ['Rust', 'WebAssembly', 'Canvas API', 'Web Audio', 'TypeScript'],
    metrics: 'Full 60fps physics simulation with zero garbage collection spikes',
    liveLink: 'https://github.com',
    codeLink: 'https://github.com',
  },
  {
    id: 'cosmos-ai-assistant',
    title: 'Cosmos AI (Neural Astrological Intelligence)',
    category: 'Generative AI & LLM Systems',
    image: 'assets/project_cosmic_ai.jpg',
    description:
      'An autonomous conversational intelligence platform that maps conceptual knowledge into celestial neural clusters. Integrates vector search embeddings, dynamic context pruning, and multi-model orchestration for automated codebase refactoring.',
    technologies: ['Python', 'FastAPI', 'Next.js', 'OpenAI API', 'Pinecone', 'LangChain'],
    metrics: '99.4% intent accuracy with dynamic semantic retrieval',
    liveLink: 'https://github.com',
    codeLink: 'https://github.com',
  },
];

function initProjectsModal() {
  const modalOverlay = document.getElementById('project-modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDesc = document.getElementById('modal-desc');
  const modalTags = document.getElementById('modal-tags');
  const modalLive = document.getElementById('modal-live-link');
  const modalCode = document.getElementById('modal-code-link');

  // Attach click listener to each project thumbnail and "View Project" trigger
  const projectTriggers = document.querySelectorAll('[data-project-id]');

  projectTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = trigger.getAttribute('data-project-id');
      const project = projectsData.find((p) => p.id === projectId);

      if (project && modalOverlay) {
        modalImage.src = project.image;
        modalImage.alt = project.title;
        modalTitle.textContent = project.title;
        modalCategory.textContent = project.category;
        modalDesc.textContent = project.description;

        // Render tech tags
        modalTags.innerHTML = '';
        project.technologies.forEach((tech) => {
          const span = document.createElement('span');
          span.className = 'tech-tag';
          span.textContent = tech;
          modalTags.appendChild(span);
        });

        modalLive.href = project.liveLink;
        modalCode.href = project.codeLink;

        // Open modal
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
      }
    });
  });

  // Close modal handlers
  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ------------------------------------------------------------------------------
 * PROMPT 8: Interactive Chat Section (Simulated AI Version of Portfolio Owner)
 * Note for future API integration:
 * To connect to an actual LLM backend (such as OpenAI, Anthropic, or Gemini):
 * 1. Replace the simulateBotResponse() function with a fetch() call to your backend:
 *    Example:
 *    const response = await fetch('/api/chat', {
 *      method: 'POST',
 *      headers: { 'Content-Type': 'application/json' },
 *      body: JSON.stringify({ message: userMessage })
 *    });
 *    const data = await response.json();
 *    appendMessage('bot', data.reply);
 * ------------------------------------------------------------------------------ */
function initAiChatSection() {
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatForm = document.getElementById('chat-form');
  const typingIndicator = document.getElementById('typing-indicator');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');

  if (!chatForm || !chatInput || !chatMessages) return;

  // Pre-programmed smart cosmic responses matching queries
  const responsesDictionary = [
    {
      keywords: ['skills', 'stack', 'technologies', 'tech', 'languages'],
      reply:
        "🚀 My core competencies include full-stack mastery in TypeScript/JavaScript, React, Node.js, and Python, coupled with cloud containerization (Docker, Kubernetes) and high-performance WebGL/Three.js graphic rendering.",
    },
    {
      keywords: ['projects', 'work', 'built', 'portfolio', 'portfolio highlight'],
      reply:
        "🪐 I have engineered mission-critical systems like Aethelred Star Navigation (cloud telemetry), Pixel Synth Studio (in-browser game engine), and Cosmos AI (realtime neural intelligence). Check out the Projects section for full technical teardowns!",
    },
    {
      keywords: ['experience', 'timeline', 'background', 'career', 'education'],
      reply:
        "🛰️ I've spent over 5+ years building distributed applications, architecting low-latency microservices, and leading frontend design systems. You can explore the Timeline section above for my milestones from university to lead engineer!",
    },
    {
      keywords: ['hire', 'contact', 'email', 'reach', 'collaborate', 'freelance'],
      reply:
        "✨ I am currently open for full-time cosmic engineering roles and select contract missions! Drop me a message through the Contact form below or shoot an email directly to danush@galaxydev.space.",
    },
    {
      keywords: ['who are you', 'about', 'bio', 'name', 'danush'],
      reply:
        "👾 Greetings, star traveler! I'm Danush, a software engineer obsessed with the intersection of elegant UI design, cosmic aesthetics, and robust distributed backend systems.",
    },
  ];

  const defaultReplies = [
    "🌟 That's a great thought! My focus is always on creating high-performance, aesthetically elevated digital experiences. Would you like to hear about my projects, skills, or how we can collaborate?",
    "🛸 Transmission received! Feel free to ask about my software architecture decisions, technical stack, or explore the interactive project thumbnails above.",
    "✨ In the digital universe, clean code and cosmic aesthetics go hand in hand. Ask me about my experience or let's discuss your next project!",
  ];

  // Submit handler
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    // Append user message
    appendMessage('user', message);
    chatInput.value = '';

    // Simulate AI thinking and response
    showTyping(true);

    setTimeout(() => {
      showTyping(false);
      const reply = generateBotReply(message);
      appendMessage('bot', reply);
    }, 900);
  });

  // Suggestion chips click handler
  suggestionChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const text = chip.getAttribute('data-prompt') || chip.textContent.trim();
      chatInput.value = text;
      chatForm.dispatchEvent(new Event('submit'));
    });
  });

  function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = text;

    msgDiv.appendChild(bubble);
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping(show) {
    if (typingIndicator) {
      typingIndicator.style.display = show ? 'flex' : 'none';
      if (show) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }
  }

  function generateBotReply(query) {
    const lower = query.toLowerCase();
    for (let item of responsesDictionary) {
      if (item.keywords.some((k) => lower.includes(k))) {
        return item.reply;
      }
    }
    return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
  }
}

/* ------------------------------------------------------------------------------
 * PROMPT 9: Contact Form with Email API Integration Placeholder (e.g., Resend API)
 * Note for Resend / Serverless Email API integration:
 * In a production deployment, route this form to an edge function or API route:
 * Example Resend API Integration:
 * ```javascript
 * const response = await fetch('/api/send-email', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     from: 'portfolio@yourdomain.com',
 *     to: 'danush@galaxydev.space',
 *     subject: `New Transmission from ${name}: ${subject}`,
 *     text: `Sender: ${name} (${email})\n\nMessage:\n${message}`
 *   })
 * });
 * ```
 * ------------------------------------------------------------------------------ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedbackBanner = document.getElementById('contact-feedback');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (!form || !feedbackBanner || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      alert('Please fill out all required transmission coordinates.');
      return;
    }

    // Indicate submission loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>🚀 Transmitting signal...</span>';
    submitBtn.disabled = true;

    // Simulate network delay / Email API call
    setTimeout(() => {
      /*
       * ==============================================================
       * RESEND API / EMAIL SERVICE INTEGRATION PLACEHOLDER:
       * Replace the mock setTimeout block below with your actual API endpoint:
       * fetch('https://api.resend.com/emails', {
       *    method: 'POST',
       *    headers: {
       *      'Authorization': 'Bearer YOUR_RESEND_API_KEY',
       *      'Content-Type': 'application/json'
       *    },
       *    body: JSON.stringify({
       *      from: 'onboarding@resend.dev',
       *      to: 'danush@galaxydev.space',
       *      subject: `New Portfolio Message from ${name}`,
       *      html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`
       *    })
       * });
       * ==============================================================
       */

      // Display prompt-compliant confirmation message
      feedbackBanner.style.display = 'block';
      feedbackBanner.innerHTML = `
        <strong>✨ Transmission Confirmed!</strong><br>
        Thank you, <strong>${name}</strong>. Your cosmic signal has safely reached Danush's terminal. Expect an interstellar reply shortly!
      `;

      form.reset();
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;

      // Smooth scroll into view of confirmation
      feedbackBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1000);
  });
}
