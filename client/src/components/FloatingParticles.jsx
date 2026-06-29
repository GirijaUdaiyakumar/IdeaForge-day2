import { useEffect, useRef } from "react";

/**
 * Canvas-based floating particles.
 * On desktop, particles nearest to the mouse draw connection lines.
 */
export default function FloatingParticles({
  count = 40,
  color = "rgba(245,158,11,0.4)",
  connectDistance = 120,
  mouseConnect = true,
}) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = e => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    if (mouseConnect) {
      canvas.parentElement?.addEventListener("mousemove", onMove, { passive: true });
      canvas.parentElement?.addEventListener("mouseleave", onLeave);
    }

    // Parse color for rgba manipulation
    const baseColor = color.replace(/rgba?\(([^)]+)\)/, "$1").split(",").map(s => s.trim());
    const r_ = baseColor[0] || "245";
    const g_ = baseColor[1] || "158";
    const b_ = baseColor[2] || "11";

    const particles = Array.from({ length: count }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.55 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse connection
        if (mouseConnect) {
          const dx = mx - p.x, dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectDistance) {
            const opacity = (1 - dist / connectDistance) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mx, my);
            ctx.strokeStyle = `rgba(${r_},${g_},${b_},${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Particle-to-particle connections (limited range)
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectDistance * 0.6) {
            const opacity = (1 - dist / (connectDistance * 0.6)) * 0.09;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${r_},${g_},${b_},${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0)             p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0)             p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      ro.disconnect();
      if (mouseConnect) {
        canvas.parentElement?.removeEventListener("mousemove", onMove);
        canvas.parentElement?.removeEventListener("mouseleave", onLeave);
      }
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [count, color, connectDistance, mouseConnect]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 0,
      }}
    />
  );
}
