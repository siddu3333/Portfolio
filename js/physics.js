/* ==========================================================================
   MATTER.JS ANTIGRAVITY PHYSICS ENGINE & FLOATING SKILL LAB
   ========================================================================== */

let physicsEngine = null;

(function () {
  const container = document.getElementById('physics-container');
  if (!container) return;

  // Skill Items List based on Resume
  const skillData = [
    { id: 'python', label: 'Python 🐍', category: 'Language', icon: 'fa-brands fa-python', desc: 'Intermediate | ML & Computer Vision' },
    { id: 'js', label: 'JavaScript ⚡', category: 'Language', icon: 'fa-brands fa-js', desc: 'Basics & ES6+ Frontend Logic' },
    { id: 'c', label: 'C Language 💻', category: 'Language', icon: 'fa-solid fa-code', desc: 'Core Programming & Data Structures' },
    { id: 'nodejs', label: 'Node.js 🟢', category: 'Backend', icon: 'fa-brands fa-node-js', desc: 'IBM Certified | Express REST APIs' },
    { id: 'htmlcss', label: 'HTML5 & CSS3 🎨', category: 'Frontend', icon: 'fa-brands fa-html5', desc: 'Glassmorphic Responsive UI Design' },
    { id: 'mysql', label: 'MySQL 🗄️', category: 'Database', icon: 'fa-solid fa-database', desc: 'Relational Database Queries & Schema' },
    { id: 'mongodb', label: 'MongoDB 🍃', category: 'Database', icon: 'fa-solid fa-leaf', desc: 'NoSQL Document Store for Full-Stack' },
    { id: 'aws', label: 'AWS Cloud ☁️', category: 'Cloud', icon: 'fa-brands fa-aws', desc: 'Ethnotec Cloud Computing Certified' },
    { id: 'docker', label: 'Docker 🐳', category: 'DevOps', icon: 'fa-brands fa-docker', desc: 'Containerization Basics' },
    { id: 'antigravity', label: 'AntiGravity ⚛️', category: 'Platform', icon: 'fa-solid fa-atom', desc: 'Creative Front-End Physics & UI' },
    { id: 'tensorflow', label: 'TensorFlow 🧠', category: 'AI/ML', icon: 'fa-solid fa-brain', desc: 'Google AI-ML Internship | EfficientNet' },
    { id: 'git', label: 'Git & GitHub 🐙', category: 'Tools', icon: 'fa-brands fa-github', desc: 'Version Control & Collaboration' },
    { id: 'uiux', label: 'UI/UX Design ✨', category: 'Design', icon: 'fa-solid fa-pen-ruler', desc: 'User-Centric Prototyping & Layouts' },
    { id: 'problem', label: 'Problem Solving 💡', category: 'Soft Skill', icon: 'fa-solid fa-lightbulb', desc: 'Algorithmic Thinking & Debugging' },
    { id: 'teamwork', label: 'Teamwork 🤝', category: 'Soft Skill', icon: 'fa-solid fa-people-group', desc: 'Hackathons & Collaborative Projects' }
  ];

  let Engine, Render, Runner, Bodies, Composite, Constraint, Mouse, MouseConstraint, Body;
  let engine, world, runner;
  let nodes = [];
  let currentCursorMode = 'repel'; // 'repel' or 'attract'
  let isFrozen = false;

  function initPhysics() {
    if (typeof Matter === 'undefined') {
      console.warn('Matter.js CDN not loaded, creating fallback floating animation.');
      createFallbackPhysics();
      return;
    }

    Engine = Matter.Engine;
    Render = Matter.Render;
    Runner = Matter.Runner;
    Bodies = Matter.Bodies;
    Composite = Matter.Composite;
    Mouse = Matter.Mouse;
    MouseConstraint = Matter.MouseConstraint;
    Body = Matter.Body;

    // Create Engine
    engine = Engine.create({
      gravity: { x: 0, y: 0, scale: 0.001 } // ZERO GRAVITY DEFAULT
    });
    world = engine.world;
    physicsEngine = engine;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create Invisible Boundary Walls
    const wallOptions = { isStatic: true, restitution: 0.9, friction: 0 };
    const ground = Bodies.rectangle(width / 2, height + 30, width * 2, 60, wallOptions);
    const ceiling = Bodies.rectangle(width / 2, -30, width * 2, 60, wallOptions);
    const leftWall = Bodies.rectangle(-30, height / 2, 60, height * 2, wallOptions);
    const rightWall = Bodies.rectangle(width + 30, height / 2, 60, height * 2, wallOptions);

    Composite.add(world, [ground, ceiling, leftWall, rightWall]);

    // Spawn Floating Skill Badges
    skillData.forEach((skill, index) => {
      const radius = 38 + Math.random() * 12;
      const startX = 100 + Math.random() * (width - 200);
      const startY = 80 + Math.random() * (height - 160);

      // Create Physics Circle Body
      const body = Bodies.circle(startX, startY, radius, {
        restitution: 0.88, // Bouncy!
        frictionAir: 0.005, // Zero-gravity drift
        friction: 0.01,
        density: 0.001
      });

      // Give random initial zero-g float velocity vector
      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 3,
        y: (Math.random() - 0.5) * 3
      });

      Composite.add(world, body);

      // Create DOM HTML Node Element
      const el = document.createElement('div');
      el.className = `physics-node ${index % 3 === 0 ? 'node-special' : ''}`;
      el.innerHTML = `<i class="${skill.icon}"></i> ${skill.label}`;
      el.dataset.id = skill.id;
      container.appendChild(el);

      nodes.push({ body, el, skill, radius });

      // Click event on node
      el.addEventListener('click', (e) => {
        if (window.playPopSound) window.playPopSound(440 + index * 40);
        showSkillModal(skill);
      });
    });

    // Add Mouse Drag Control
    const mouse = Mouse.create(container);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    Composite.add(world, mouseConstraint);

    // Mouse Repulsion / Attraction Force Loop
    let mousePos = { x: -1000, y: -1000 };
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      mousePos.x = e.clientX - rect.left;
      mousePos.y = e.clientY - rect.top;
    });

    container.addEventListener('mouseleave', () => {
      mousePos.x = -1000;
      mousePos.y = -1000;
    });

    // Run Engine
    runner = Runner.create();
    Runner.run(runner, engine);

    // Update Frame Loop (Sync DOM nodes with Physics Bodies)
    function updateLoop() {
      if (!isFrozen) {
        // Apply Gravitational/Repulsion Cursor Forces
        if (mousePos.x > 0) {
          nodes.forEach(({ body }) => {
            const dx = mousePos.x - body.position.x;
            const dy = mousePos.y - body.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 180 && dist > 5) {
              const forceMagnitude = (180 - dist) * 0.00002;
              const dir = currentCursorMode === 'repel' ? -1 : 1;
              Body.applyForce(body, body.position, {
                x: (dx / dist) * forceMagnitude * dir,
                y: (dy / dist) * forceMagnitude * dir
              });
            }
          });
        }
      }

      // Update HTML Elements Position & Rotation
      nodes.forEach(({ body, el, radius }) => {
        const x = body.position.x - el.offsetWidth / 2;
        const y = body.position.y - el.offsetHeight / 2;
        const angle = body.angle;
        el.style.transform = `translate3d(${x}px, ${y}px, 0px) rotate(${angle}rad)`;
      });

      requestAnimationFrame(updateLoop);
    }

    requestAnimationFrame(updateLoop);
  }

  // Fallback if Matter.js CDN isn't accessible
  function createFallbackPhysics() {
    skillData.forEach((skill, index) => {
      const el = document.createElement('div');
      el.className = 'physics-node';
      el.style.position = 'relative';
      el.style.margin = '10px';
      el.style.display = 'inline-flex';
      el.innerHTML = `<i class="${skill.icon}"></i> ${skill.label}`;
      container.appendChild(el);
    });
  }

  // Toolbar Event Listeners
  document.getElementById('gravity-slider')?.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    document.getElementById('gravity-value').innerText = `${val.toFixed(1)} G`;
    if (engine) engine.gravity.y = val;
  });

  document.getElementById('mode-repel')?.addEventListener('click', () => {
    currentCursorMode = 'repel';
    document.getElementById('mode-repel').classList.add('active');
    document.getElementById('mode-attract').classList.remove('active');
  });

  document.getElementById('mode-attract')?.addEventListener('click', () => {
    currentCursorMode = 'attract';
    document.getElementById('mode-attract').classList.add('active');
    document.getElementById('mode-repel').classList.remove('active');
  });

  document.getElementById('btn-thruster')?.addEventListener('click', () => {
    if (window.playPopSound) window.playPopSound(800);
    nodes.forEach(({ body }) => {
      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 18,
        y: (Math.random() - 0.5) * 18
      });
    });
  });

  document.getElementById('btn-freeze')?.addEventListener('click', (e) => {
    isFrozen = !isFrozen;
    e.target.classList.toggle('active');
    nodes.forEach(({ body }) => {
      Body.setStatic(body, isFrozen);
    });
  });

  document.getElementById('btn-reset-physics')?.addEventListener('click', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    nodes.forEach(({ body }) => {
      Body.setPosition(body, {
        x: 100 + Math.random() * (width - 200),
        y: 80 + Math.random() * (height - 160)
      });
      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4
      });
    });
  });

  function showSkillModal(skill) {
    if (window.openProjectModalCustom) {
      window.openProjectModalCustom(`
        <div style="text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 1rem; color: var(--neon-cyan);"><i class="${skill.icon}"></i></div>
          <span style="font-family: var(--font-mono); color: var(--neon-pink); text-transform: uppercase;">${skill.category}</span>
          <h2 style="font-size: 2rem; margin: 0.5rem 0;">${skill.label}</h2>
          <p style="color: var(--color-text-muted); font-size: 1.1rem; margin-bottom: 1.5rem;">${skill.desc}</p>
          <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 12px; text-align: left;">
            <h4 style="color: var(--neon-indigo); margin-bottom: 0.5rem;">Proficiency & Context</h4>
            <p style="font-size: 0.95rem; color: var(--color-text-main);">Integrated across academic projects at Srinivas Institute of Technology and industry internships via EduSkills Foundation.</p>
          </div>
        </div>
      `);
    }
  }

  window.addEventListener('load', initPhysics);
})();
