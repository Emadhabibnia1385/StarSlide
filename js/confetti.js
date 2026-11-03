(function (global) {
  const COLORS = ["#8b5cf6", "#3b82f6", "#22d3ee", "#fbbf24", "#34d399", "#f472b6"];
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  let pieces = [];
  let running = false;

  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  addEventListener("resize", resize);
  resize();

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces = pieces.filter((p) => p.y < canvas.height + 20);
    for (const p of pieces) {
      p.vy += 0.15;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.spin;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    }
    if (pieces.length > 0) requestAnimationFrame(frame);
    else running = false;
  }

  function burst() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let i = 0; i < 140; i++) {
      pieces.push({
        x: canvas.width / 2,
        y: canvas.height * 0.4,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 12 - 3,
        size: 6 + Math.random() * 8,
        rot: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
    if (!running) {
      running = true;
      requestAnimationFrame(frame);
    }
  }

  global.Confetti = { burst };
})(window);
