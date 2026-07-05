import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";
import Hero from "@/components/portfolio/Hero";
import Projects from "@/components/portfolio/Projects";
import AIAgent from "@/components/portfolio/AIAgent";
import Footer from "@/components/portfolio/Footer";
import CustomCursor from "@/components/portfolio/CustomCursor";
import PlexusBackground from "@/components/portfolio/PlexusBackground";
import { siteConfig } from "@/config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${siteConfig.personal.name} — ${siteConfig.personal.role}` },
      { name: "description", content: siteConfig.personal.tagline },
      { property: "og:title", content: `${siteConfig.personal.name} — ${siteConfig.personal.role}` },
      { property: "og:description", content: siteConfig.personal.tagline },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const engageAI = useCallback(() => {
    document.getElementById("agent")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <main className="relative min-h-screen bg-background text-foreground antialiased">
      <PlexusBackground />
      <CustomCursor />
      <Hero onEngageAI={engageAI} />
      <Projects />
      <AIAgent />
      <Footer />
    </main>
  );
}
