"use client";

import { useSite } from "@/context/SiteContext";
import SiteLayout from "@/layouts/SiteLayout";

// Curated Luxury Home Sections
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ServicesSection from "@/components/home/ServicesSection";
import BeforeAfterSection from "@/components/home/BeforeAfterSection";
import ProcessSection from "@/components/home/ProcessSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import SocialConnectSection from "@/components/home/SocialConnectSection";
import HomeCtaSection from "@/components/home/HomeCtaSection";

const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  hero: HeroSection,
  about: AboutSection,
  services: ServicesSection,
  beforeAfter: BeforeAfterSection,
  process: ProcessSection,
  testimonials: TestimonialsSection,
  socialConnect: SocialConnectSection,
  instagram: SocialConnectSection, // Maps instagram slot to new Social Connect section
  cta: HomeCtaSection,
  contact: HomeCtaSection,
};

const DEFAULT_HOMEPAGE_SECTIONS = [
  { id: "hero", enabled: true },
  { id: "about", enabled: true },
  { id: "services", enabled: true },
  { id: "beforeAfter", enabled: true },
  { id: "process", enabled: true },
  { id: "testimonials", enabled: true },
  { id: "socialConnect", enabled: true },
  { id: "cta", enabled: true },
];

// Sections removed from homepage to keep it focused, high-converting, and luxury-oriented
// (These sections remain fully functional on their dedicated pages: /portfolio, /about, /packages, /gallery, /blog, /contact)
const EXCLUDED_FROM_HOMEPAGE = new Set([
  "partners",
  "portfolio",
  "ourWork",
  "blog",
  "faq",
  "team",
  "gallery",
  "packages",
  "calculator",
  "stats",
  "why",
]);

export default function HomePage() {
  const { settings } = useSite() as any;
  const rawSections = settings?.sections;

  // Use configured sections if available (filtering out excluded modules), or default luxury sequence
  const sections =
    Array.isArray(rawSections) && rawSections.length > 0
      ? rawSections.filter((s: any) => !EXCLUDED_FROM_HOMEPAGE.has(s.id))
      : DEFAULT_HOMEPAGE_SECTIONS;

  return (
    <SiteLayout revealKey={JSON.stringify(sections.map((s: any) => s.id + s.enabled))}>
      {sections.map((sec: any) => {
        if (sec.enabled === false) return null;
        const Component = SECTION_COMPONENTS[sec.id];
        if (!Component) return null;
        return <Component key={sec.id} />;
      })}
    </SiteLayout>
  );
}
