/* ==========================================================================
   MAIN UI LOGIC, AUDIO SYNTHESIZER & INTERACTIVE MODALS
   ========================================================================== */

let soundEnabled = true;
let audioCtx = null;

// Web Audio API Futuristic Sound Synthesizer
window.playPopSound = function (freq = 520, type = 'sine') {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, audioCtx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } catch (e) {
    console.log('Audio Context muted:', e);
  }
};

// Sound Toggle Button
document.getElementById('sound-toggle')?.addEventListener('click', (e) => {
  soundEnabled = !soundEnabled;
  const icon = e.currentTarget.querySelector('i');
  if (soundEnabled) {
    icon.className = 'fa-solid fa-volume-high';
    window.playPopSound(880);
  } else {
    icon.className = 'fa-solid fa-volume-xmark';
  }
});

// TYPEWRITER EFFECT
(function () {
  const words = ['Full-Stack Developer', 'UI/UX Designer', 'Computer Science Student', 'AI/ML Enthusiast'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const target = document.getElementById('typewriter');
  if (!target) return;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 40 : 90;

    if (!isDeleting && charIndex === currentWord.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
})();

// PROJECT MODALS DATA & HANDLER
const projectDetailsData = {
  cattle: `
    <div class="modal-project-header">
      <div style="font-size: 2.5rem; color: var(--neon-cyan);"><i class="fa-solid fa-brain"></i></div>
      <span class="project-category">Featured Deep Learning & AI Project</span>
      <h2 style="font-size: 2rem; margin: 0.5rem 0;">Indian Cattle Breed Detection</h2>
      <p style="color: var(--neon-gold); font-family: var(--font-mono);"><i class="fa-solid fa-calendar"></i> Academic Year 2024 - 2025</p>
    </div>
    
    <div style="margin: 1.5rem 0; color: var(--color-text-muted); line-height: 1.7;">
      <p style="margin-bottom: 1rem;">
        Developed a state-of-the-art deep learning image classification system in Python using TensorFlow to accurately classify five major Indian cattle breeds: <strong>Gir, Red Sindhi, Kankrej, Jersey, and Hallikar</strong>.
      </p>
      
      <div style="background: rgba(10, 15, 30, 0.8); border: 1px solid var(--glass-border); padding: 1.2rem; border-radius: 12px; margin-bottom: 1.2rem;">
        <h4 style="color: var(--neon-cyan); margin-bottom: 0.6rem;"><i class="fa-solid fa-microchip"></i> Technical Highlights & Results:</h4>
        <ul style="padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.4rem; color: var(--color-text-main);">
          <li>Implemented EfficientNet-based Convolutional Neural Network (CNN) architecture.</li>
          <li>Achieved over <strong>90% validation accuracy</strong> on complex real-world agricultural dataset.</li>
          <li>Applied advanced Data Augmentation, dropout regularization, and learning rate decay to eliminate overfitting.</li>
          <li>Significantly out-performed traditional image processing techniques (SVM/Haar cascades) in prediction reliability.</li>
        </ul>
      </div>

      <h4 style="color: var(--neon-indigo); margin-bottom: 0.5rem;">Tech Stack Used:</h4>
      <div class="tech-tags">
        <span class="tag">Python</span>
        <span class="tag">TensorFlow</span>
        <span class="tag">Keras</span>
        <span class="tag">EfficientNet</span>
        <span class="tag">OpenCV</span>
        <span class="tag">NumPy / Pandas</span>
      </div>
    </div>
  `,
  fullstack: `
    <div class="modal-project-header">
      <div style="font-size: 2.5rem; color: var(--neon-indigo);"><i class="fa-solid fa-layer-group"></i></div>
      <span class="project-category">EduSkills Foundation Internship</span>
      <h2 style="font-size: 2rem; margin: 0.5rem 0;">Web Full Stack Developer Solutions</h2>
    </div>
    <div style="margin: 1.5rem 0; color: var(--color-text-muted); line-height: 1.7;">
      <p style="margin-bottom: 1rem;">
        Engineered modern full-stack web applications featuring secure authentication, RESTful API backend architecture, and high-performance MongoDB datastores.
      </p>
      <div class="tech-tags">
        <span class="tag">Node.js</span>
        <span class="tag">Express.js</span>
        <span class="tag">MongoDB</span>
        <span class="tag">HTML5 & CSS3</span>
        <span class="tag">JavaScript ES6</span>
      </div>
    </div>
  `,
  aiml: `
    <div class="modal-project-header">
      <div style="font-size: 2.5rem; color: var(--neon-pink);"><i class="fa-brands fa-google"></i></div>
      <span class="project-category">Google AI-ML Virtual Internship</span>
      <h2 style="font-size: 2rem; margin: 0.5rem 0;">Predictive AI Pipelines & Machine Learning</h2>
    </div>
    <div style="margin: 1.5rem 0; color: var(--color-text-muted); line-height: 1.7;">
      <p style="margin-bottom: 1rem;">
        Completed rigorous virtual internship program focusing on practical machine learning pipelines, model optimization, feature engineering, and neural network evaluations.
      </p>
      <div class="tech-tags">
        <span class="tag">Python</span>
        <span class="tag">Machine Learning</span>
        <span class="tag">Scikit-Learn</span>
        <span class="tag">Supervised Learning</span>
      </div>
    </div>
  `
};

window.openProjectModal = function (projectId) {
  window.playPopSound(600);
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  if (modal && modalBody && projectDetailsData[projectId]) {
    modalBody.innerHTML = projectDetailsData[projectId];
    modal.classList.add('open');
  }
};

window.openProjectModalCustom = function (htmlContent) {
  window.playPopSound(600);
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  if (modal && modalBody) {
    modalBody.innerHTML = htmlContent;
    modal.classList.add('open');
  }
};

window.closeProjectModal = function () {
  window.playPopSound(350);
  const modal = document.getElementById('project-modal');
  if (modal) modal.classList.remove('open');
};

// Copy Email Utility
window.copyEmail = function () {
  navigator.clipboard.writeText('sidduash31@gmail.com');
  window.playPopSound(750);
  alert('Email address sidduash31@gmail.com copied to clipboard!');
};

// Form Submission Simulation
window.handleFormSubmit = function (e) {
  e.preventDefault();
  window.playPopSound(900);

  const feedback = document.getElementById('form-feedback');
  const btn = document.getElementById('btn-send');

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Transmitting...';

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Transmitted Successfully!';
    feedback.innerHTML = '<span style="color: var(--neon-green);">🚀 Message launched into zero-gravity space! Marisiddappa will respond soon.</span>';
    document.getElementById('contact-form').reset();

    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-shuttle-space"></i> Transmit Into Zero-G';
    }, 4000);
  }, 1500);
};

// Mobile Navigation Toggle
document.getElementById('mobile-toggle')?.addEventListener('click', () => {
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    if (navLinks.style.display === 'flex') {
      navLinks.style.display = 'none';
    } else {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.background = 'rgba(10, 15, 30, 0.95)';
      navLinks.style.padding = '1.5rem';
      navLinks.style.borderRadius = '20px';
    }
  }
});
