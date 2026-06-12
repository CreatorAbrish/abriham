import { siteConfig } from "@/config";

export default function Footer() {
  return (
    <footer className="relative border-t border-border/60 px-6 py-20 md:px-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="text-mono mb-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            ✦ Get in touch
          </div>
          <a
            href={`mailto:${siteConfig.personal.email}`}
            data-cursor="hover"
            className="text-display block text-[clamp(2.5rem,8vw,6rem)] font-medium leading-none transition hover:text-gradient-gold"
          >
            Let's talk.
          </a>
          <p className="mt-6 max-w-md text-muted-foreground">{siteConfig.personal.manifesto}</p>
        </div>

        <div className="md:col-span-5 grid grid-cols-2 gap-8">
          <div>
            <div className="text-mono mb-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Direct
            </div>
            <a
              href={`mailto:${siteConfig.personal.email}`}
              className="block text-sm transition hover:text-primary"
            >
              {siteConfig.personal.email}
            </a>
            <a
              href={`https://t.me/${siteConfig.personal.telegram.replace(/^@/, "")}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block text-sm transition hover:text-primary"
            >
              Telegram {siteConfig.personal.telegram}
            </a>
            <p className="mt-2 text-sm text-muted-foreground">{siteConfig.personal.location}</p>
          </div>
          <div>
            <div className="text-mono mb-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Elsewhere
            </div>
            {Object.entries(siteConfig.social).map(([k, v]) => (
              <a
                key={k}
                href={v}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className="block text-sm capitalize transition hover:text-primary"
              >
                {k} ↗
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-20 flex max-w-7xl items-center justify-between text-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span>© {new Date().getFullYear()} {siteConfig.personal.name}</span>
        <span>Crafted with care · Addis Ababa</span>
      </div>
    </footer>
  );
}
