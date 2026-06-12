import { motion } from "framer-motion";
import { siteConfig } from "@/config";
import darchoAsset from "@/assets/projects/darcho.png.asset.json";
import melaAsset from "@/assets/projects/mela.png.asset.json";
import emuAsset from "@/assets/projects/emu.png.asset.json";
import fevenAsset from "@/assets/projects/feven.png.asset.json";

const PROJECT_IMAGES: Record<string, string> = {
  darcho: darchoAsset.url,
  mela: melaAsset.url,
  emu: emuAsset.url,
  feven: fevenAsset.url,
};

export default function Projects() {
  const discuss = (title: string, description: string) => {
    const prompt = `Tell me more about the ${title} project — ${description.slice(0, 120)}`;
    window.dispatchEvent(new CustomEvent("discuss-with-kere", { detail: { prompt } }));
  };

  return (
    <section id="work" className="relative mx-auto max-w-7xl px-6 py-32 md:px-12">
      <div className="mb-16 flex items-end justify-between">
        <div>
          <div className="text-mono mb-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            ✦ Selected work · 2024—2025
          </div>
          <h2 className="text-display text-[clamp(2.5rem,6vw,5rem)] font-medium">
            Built for <span className="italic font-light text-gradient-gold">real markets</span>.
          </h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {siteConfig.projects.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: i * 0.05 }}
            className="group relative flex flex-col overflow-hidden rounded-3xl glass-panel p-5 transition hover:bg-card/60"
          >
            <a
              href={(p as any).url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="relative block overflow-hidden rounded-2xl border border-border/60 bg-black/40"
            >
              <div className="absolute left-3 top-3 z-10 text-mono text-[10px] uppercase tracking-[0.25em] text-white/70">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="absolute right-3 top-3 z-10 text-mono text-[10px] uppercase tracking-[0.25em] text-white/70">
                Live ↗
              </div>
              {PROJECT_IMAGES[p.id] ? (
                <img
                  src={PROJECT_IMAGES[p.id]}
                  alt={`${p.title} landing page preview`}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover object-top transition duration-700 group-hover:scale-[1.04]"
                />
              ) : (
                <div
                  className="aspect-[16/10] w-full"
                  style={{ background: `linear-gradient(135deg, ${p.accent}44, transparent 70%), #0a0a0a` }}
                />
              )}
              <div
                className="pointer-events-none absolute inset-0 opacity-60 mix-blend-overlay transition group-hover:opacity-30"
                style={{ background: `linear-gradient(135deg, ${p.accent}33, transparent 60%)` }}
              />
            </a>
            <div className="mt-5 flex-1">
              <div className="text-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {p.year} · {p.role}
              </div>
              <h3 className="mt-2 text-display text-2xl font-medium md:text-3xl">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {p.description}
              </p>
            </div>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/40 pt-4">
              <button
                onClick={() => discuss(p.title, p.description)}
                data-cursor="hover"
                className="group/btn inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary/60" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                Discuss with Kere
                <span className="transition group-hover/btn:translate-x-0.5">→</span>
              </button>
              <a
                href={(p as any).url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                aria-label={`Visit ${p.title}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-primary transition hover:rotate-[-45deg] hover:bg-primary hover:text-primary-foreground"
              >
                →
              </a>
            </div>
            <div
              className="pointer-events-none absolute inset-x-0 -bottom-px h-px opacity-0 transition group-hover:opacity-100"
              style={{ background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)` }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
