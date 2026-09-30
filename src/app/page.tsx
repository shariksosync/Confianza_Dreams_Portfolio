"use client";

import { useSite } from "@/context/SiteContext";
import SiteLayout from "@/layouts/SiteLayout";

// Home Sections
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ServicesSection from "@/components/home/ServicesSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import BeforeAfterSection from "@/components/home/BeforeAfterSection";
import PortfolioSection from "@/components/home/PortfolioSection";
import ProcessSection from "@/components/home/ProcessSection";
import StatsSection from "@/components/home/StatsSection";
import PackagesSection from "@/components/home/PackagesSection";
import BudgetCalculatorSection from "@/components/home/BudgetCalculatorSection";
import PartnerMarqueeSection from "@/components/home/PartnerMarqueeSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TeamSection from "@/components/home/TeamSection";
import GallerySection from "@/components/home/GallerySection";
import FaqSection from "@/components/home/FaqSection";
import BlogSection from "@/components/home/BlogSection";
import InstagramSection from "@/components/home/InstagramSection";
import ContactSection from "@/components/home/ContactSection";

const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  hero: HeroSection,
  about: AboutSection,
  services: ServicesSection,
  why: WhyChooseUsSection,
  beforeAfter: BeforeAfterSection,
  portfolio: PortfolioSection,
  process: ProcessSection,
  stats: StatsSection,
  packages: PackagesSection,
  calculator: BudgetCalculatorSection,
  partners: PartnerMarqueeSection,
  testimonials: TestimonialsSection,
  team: TeamSection,
  gallery: GallerySection,
  faq: FaqSection,
  blog: BlogSection,
  instagram: InstagramSection,
  contact: ContactSection,
};

export default function HomePage() {
  const { settings } = useSite() as any;
  const sections = settings?.sections || [];

  return (
    <SiteLayout revealKey={JSON.stringify(sections.map((s: any) => s.id + s.enabled))}>
      {sections.map((sec: any) => {
        if (!sec.enabled) return null;
        const Component = SECTION_COMPONENTS[sec.id];
        if (!Component) return null;
        return <Component key={sec.id} />;
      })}
    </SiteLayout>
  );
}
