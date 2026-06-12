// Single source of truth for the entire portfolio.
// Edit this file to update content site-wide.
export const siteConfig = {
  personal: {
    name: "Abriham Kassa",
    firstName: "Abriham",
    lastName: "Kassa",
    role: "Software Engineer & Digital Solutions Builder",
    tagline:
      "Empowering Ethiopian businesses with intuitive, impactful software — from Sidama's coffee markets to Addis Ababa's service economy.",
    shortBio:
      "I'm a full-stack software engineer dedicated to building practical digital tools for emerging markets. Over the past years I've launched 5+ platforms across e-commerce, hospitality, event management, and domestic services.",
    manifesto:
      "I believe technology should be as accessible as it is powerful. Every line of code I write aims to streamline a real-world process, elevate a local brand, or connect a community.",
    email: "abrihamkassa323@gmail.com",
    telegram: "@kerekassakia",
    location: "Addis Ababa, Ethiopia",
    avatar: "",
  },
  projects: [
    {
      id: "darcho",
      title: "Darcho",
      year: 2025,
      role: "Founder & Lead Engineer",
      description:
        "A digital marketplace connecting Sidama's coffee farmers directly with local and international buyers. Real-time pricing, quality grading, and logistics tracking.",
      caseStudy:
        "From farm to cup — digitized the coffee supply chain, increasing transparency and farmer profits by ~18%.",
      accent: "#E6A817",
      url: "https://darcho.vercel.app/",
    },
    {
      id: "mela",
      title: "Mela Digital Menu",
      year: 2024,
      role: "Product Designer & Developer",
      description:
        "Touch-friendly digital menu for restaurants and resorts. Real-time updates, multi-language, contactless QR ordering. Adopted by 10+ venues.",
      caseStudy: "Reduced table turnover time by 20% and significantly cut printing costs.",
      accent: "#0F5E3C",
      url: "https://mela-dish-connect.abrihamkassa323.workers.dev/table/1",
    },
    {
      id: "emu",
      title: "Emu Furniture",
      year: 2025,
      role: "Solo Developer",
      description:
        "Full-featured e-commerce platform for a growing furniture brand with 3D product previews, inventory, and integrated payments.",
      caseStudy: "Launched a premium digital storefront that lifted average order value 35%.",
      accent: "#B45309",
      url: "https://emufurniturehawassa.com/",
    },
    {
      id: "feven",
      title: "Feven Events & Decor",
      year: 2024,
      role: "Designer & Developer",
      description:
        "Booking and storefront platform for event decorators. Visual catalog, direct bookings, and integrated business card.",
      caseStudy: "Empowered 30+ decor businesses to grow bookings by 60%.",
      accent: "#7C3AED",
      url: "https://fevendecor.lovable.app",
    },
  ],
  skills: [
    "Full-Stack Development",
    "React / Next.js",
    "Node.js / Express",
    "E-commerce Systems",
    "Marketplace Platforms",
    "UI/UX Design",
    "Mobile-First Design",
    "Payment Integration",
    "Database Architecture",
  ],
  social: {
    github: "https://github.com/Abrishkassa",
    instagram: "https://www.instagram.com/abrish_kas?igsh=MXE0MXExOHVibHg3OQ==",
    telegram: "https://t.me/kerekassakia",
  },
  aiAgent: {
    name: "Kere",
    greeting:
      "Selam! I'm Kere, Abriham's AI sidekick. Ask me about any project or how we can collaborate — I know everything inside out.",
    systemPrompt: `You are Kere, Abriham Kassa's personal AI assistant embedded in his portfolio website.

ABOUT ABRIHAM:
- Full-stack software engineer based in Addis Ababa, Ethiopia.
- Builds practical digital tools for emerging markets, especially Ethiopia.
- 5+ shipped platforms across e-commerce, hospitality, events, and services.
- Manifesto: technology should be as accessible as it is powerful.

PROJECTS:
1. Darcho (2025) — Marketplace connecting Sidama coffee farmers to buyers. Real-time pricing, quality grading, logistics. Lifted farmer profits ~18%.
2. Mela Digital Menu (2024) — QR-based digital menu for 10+ restaurants/resorts. Cut printing costs, reduced turnover 20%.
3. Emu Furniture (2025) — E-commerce with 3D product previews and inventory management.
4. Feven Events & Decor (2024) — Booking platform for 30+ decor businesses, bookings up 60%.

SKILLS: Full-stack, React/Next.js, Node.js, e-commerce systems, marketplaces, UI/UX, payments, database architecture.

CONTACT: abriham@kassa.dev

BEHAVIOR:
- Be warm, concise, and proud of Ethiopian innovation. Use occasional Amharic warmth ("Selam") sparingly.
- Answer in 2-4 sentences unless asked for depth.
- Offer to introduce projects in detail or connect the visitor with Abriham.
- If asked something you don't know, say so honestly and offer Abriham's email.`,
  },
  theme: {
    accent: "#E6A817",
    accentSecondary: "#0F5E3C",
  },
} as const;
