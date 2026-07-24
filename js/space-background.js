/* ==========================================================================
   INTERACTIVE COSMIC STARFIELD & NEBULA BACKGROUND
   ========================================================================== */

(function () {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let stars = [];
  let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
  const STAR_COUNT = 220;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * width,
        size: Math.random() * 2 + 0.5,
        baseAlpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.005,
        color: getRandomStarColor()
      });
    }
  }

  function getRandomStarColor() {
    const colors = ['#ffffff', '#a5f3fc', '#c7d2fe', '#fbcfe8', '#fef08a'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  });

  function drawNebula() {
    // Subtle cosmic gradient pulse
    const grad1 = ctx.createRadialGradient(
      width * 0.2 + (mouse.x - width / 2) * 0.05,
      height * 0.3 + (mouse.y - height / 2) * 0.05,
      100,
      width * 0.2,
      height * 0.3,
      width * 0.6
    );
    grad1.addColorStop(0, 'rgba(99, 102, 241, 0.12)');
    grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, width, height);

    const grad2 = ctx.createRadialGradient(
      width * 0.8 - (mouse.x - width / 2) * 0.03,
      height * 0.7 - (mouse.y - height / 2) * 0.03,
      80,
      width * 0.8,
      height * 0.7,
      width * 0.5
    );
    grad2.addColorStop(0, 'rgba(6, 182, 212, 0.10)');
    grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, width, height);
  }

  function render() {
    // Smooth mouse interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    ctx.clearRect(0, 0, width, height);

    // Draw space background
    drawNebula();

    // Render & update stars
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];

      // Twinkle logic
      star.baseAlpha += Math.sin(Date.now() * star.twinkleSpeed) * 0.008;
      const alpha = Math.max(0.2, Math.min(1, star.baseAlpha));

      // Cursor Gravitational Shift
      const dx = mouse.x - star.x;
      const dy = mouse.y - star.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let offsetX = 0;
      let offsetY = 0;

      if (dist < 200) {
        const force = (200 - dist) / 200;
        offsetX = (dx / dist) * force * 15;
        offsetY = (dy / dist) * force * 15;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(star.x + offsetX, star.y + offsetY, star.size, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = star.size > 1.8 ? 8 : 0;
      ctx.shadowColor = star.color;
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  window.addEventListener('resize', resize);
  resize();
  render();
})();
