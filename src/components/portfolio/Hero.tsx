import { motion } from "framer-motion";
import { lazy, Suspense, useEffect, useState } from "react";
import { siteConfig } from "@/config";

const HeroSculpture = lazy(() => import("./HeroSculpture"));

const SCRAMBLE = "ABRIHAM·KASSA·".split("");

function ScrambledText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    let frame = 0;
    const total = 28;
    const timeout = setTimeout(() => {
      const id = setInterval(() => {
        frame++;
        if (frame >= total) {
          setDisplay(text);
          clearInterval(id);
          return;
        }
        setDisplay(
          text
            .split("")
            .map((ch, i) =>
              i < (frame / total) * text.length
                ? ch
                : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)],
            )
            .join(""),
        );
      }, 35);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);
  return <>{display}</>;
}

export default function Hero({ onEngageAI }: { onEngageAI: () => void }) {
  return (
    <section className="relative isolate min-h-[100svh] w-full overflow-hidden grain-overlay">
      {/* mesh gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-1/4 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.55_0.13_155/0.35),transparent_60%)] blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.82_0.16_82/0.30),transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_70%,oklch(0.07_0.005_60)_100%)]" />
      </div>

      {/* nav */}
      <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="text-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
          AK · {new Date().getFullYear()}
        </div>
        <nav className="hidden gap-8 text-mono text-xs uppercase tracking-[0.25em] text-muted-foreground md:flex">
          <a href="#work" className="transition hover:text-foreground">Work</a>
          <a href="#about" className="transition hover:text-foreground">About</a>
          <a href="#agent" className="transition hover:text-foreground">Kere AI</a>
          <a href={`mailto:${siteConfig.personal.email}`} className="transition hover:text-foreground">Contact</a>
        </nav>
      </header>

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 items-center gap-8 px-6 py-32 md:px-12 lg:grid-cols-12">
        {/* Left: typography */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-border bg-card/40 px-4 py-1.5 text-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground backdrop-blur"
          >
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Available for collaboration — {siteConfig.personal.location}
          </motion.div>

          <h1 className="text-display text-[clamp(3.2rem,11vw,9rem)] font-medium">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="block text-foreground"
            >
              <ScrambledText text={siteConfig.personal.firstName} />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25 }}
              className="block italic font-light text-gradient-gold"
            >
              <ScrambledText text={siteConfig.personal.lastName} delay={250} />
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 max-w-xl text-base text-muted-foreground md:text-lg"
          >
            {siteConfig.personal.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={onEngageAI}
              data-cursor="hover"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition hover:scale-[1.02]"
            >
              <span className="relative z-10">Engage Kere AI</span>
              <span className="relative z-10 inline-block transition group-hover:translate-x-1">→</span>
              <span className="absolute inset-0 -z-0 bg-gradient-to-r from-primary via-[oklch(0.92_0.15_88)] to-primary opacity-0 transition group-hover:opacity-100" />
            </button>
            <a
              href="#work"
              data-cursor="hover"
              className="text-mono text-xs uppercase tracking-[0.25em] text-muted-foreground transition hover:text-foreground"
            >
              ↓ View Work
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.4 }}
            className="mt-16 flex items-center gap-6 text-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
          >
            <span>{siteConfig.personal.role}</span>
          </motion.div>
        </div>

        {/* Right: 3D sculpture */}
        <div className="relative h-[55vh] min-h-[420px] lg:col-span-5 lg:h-[80vh]">
          <Suspense
            fallback={
              <div className="h-full w-full rounded-3xl bg-gradient-to-br from-card/40 to-transparent" />
            }
          >
            <HeroSculpture />
          </Suspense>
          <div className="absolute bottom-4 right-4 text-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            // Sculpted in code
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden border-t border-border/50 bg-background/40 py-4 backdrop-blur">
        <div className="flex w-max animate-marquee gap-12 text-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {[...siteConfig.skills, ...siteConfig.skills].map((s, i) => (
            <span key={i} className="flex items-center gap-12">
              {s}
              <span className="text-primary">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
