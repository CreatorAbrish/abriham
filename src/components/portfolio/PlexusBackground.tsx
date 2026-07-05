import { useEffect, useRef } from "react";

/**
 * Animated colored-node plexus network drawn on a full-viewport canvas.
 * Fixed behind all content, respects prefers-reduced-motion, and
 * pauses when the tab is hidden.
 */
const COLORS = [
  "#E6A817", // gold
  "#0F5E3C", // coffee green
  "#3ABEFF", // cyan
  "#E94E77", // magenta
  "#F5F0E0", // cream
];

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  c: string;
};

export default function PlexusBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];
    let raf = 0;
    let running = true;
    const mouse = { x: -9999, y: -9999 };

    const seed = () => {
      const area = width * height;
      const target = Math.min(140, Math.max(45, Math.round(area / 16000)));
      nodes = new Array(target).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 1.2 + Math.random() * 2.8,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const step = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      const linkDist = Math.min(160, Math.max(90, width / 12));

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Mild parallax pull toward cursor
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22000) {
          n.x += dx * 0.0008;
          n.y += dy * 0.0008;
        }
      }

      // Lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            const alpha = (1 - dist / linkDist) * 0.22;
            ctx.strokeStyle = `rgba(230, 230, 240, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.fillStyle = n.c;
        ctx.shadowColor = n.c;
        ctx.shadowBlur = 8;
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(step);
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onVisibility = () => {
      running = !document.hidden;
      if (running && !reduce) raf = requestAnimationFrame(step);
      else cancelAnimationFrame(raf);
    };

    resize();
    if (reduce) {
      // Draw a single static frame
      step();
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(step);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-70"
    />
  );
}