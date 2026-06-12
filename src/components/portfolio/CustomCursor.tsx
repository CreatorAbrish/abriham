import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHover(!!t.closest("a, button, [data-cursor='hover']"));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  return (
    <>
      <div
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
        style={{
          transform: `translate3d(${pos.x - 4}px, ${pos.y - 4}px, 0)`,
          transition: "transform 60ms linear",
        }}
      >
        <div className="h-2 w-2 rounded-full bg-primary" />
      </div>
      <div
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
        style={{
          transform: `translate3d(${pos.x - (hover ? 28 : 16)}px, ${pos.y - (hover ? 28 : 16)}px, 0) scale(${hover ? 1.6 : 1})`,
          transition: "transform 180ms cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <div
          className={`rounded-full border ${hover ? "border-primary/70 bg-primary/10" : "border-primary/40"}`}
          style={{ width: 32, height: 32 }}
        />
      </div>
    </>
  );
}
