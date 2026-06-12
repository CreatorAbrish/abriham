import { motion } from "framer-motion";
import { siteConfig } from "@/config";

export default function Projects() {
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

      <div className="grid gap-6">
        {siteConfig.projects.map((p, i) => (
          <motion.a
            key={p.id}
            href="#agent"
            data-cursor="hover"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: i * 0.05 }}
            className="group relative grid grid-cols-1 items-center gap-6 overflow-hidden rounded-3xl glass-panel p-8 transition hover:bg-card/60 md:grid-cols-12 md:p-10"
          >
            <div className="md:col-span-1 text-mono text-xs text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="md:col-span-3">
              <div className="text-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {p.year} · {p.role}
              </div>
              <h3 className="mt-2 text-display text-3xl font-medium md:text-4xl">{p.title}</h3>
            </div>
            <p className="md:col-span-6 text-sm leading-relaxed text-muted-foreground md:text-base">
              {p.description}
            </p>
            <div className="md:col-span-2 flex justify-end">
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border text-primary transition group-hover:rotate-[-45deg] group-hover:bg-primary group-hover:text-primary-foreground"
              >
                →
              </span>
            </div>
            <div
              className="pointer-events-none absolute inset-x-0 -bottom-px h-px opacity-0 transition group-hover:opacity-100"
              style={{ background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)` }}
            />
          </motion.a>
        ))}
      </div>
    </section>
  );
}
