"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingActions from "../components/FloatingActions";
import ScrollProgress from "../components/ScrollProgress";
import CursorGlow from "../components/CursorGlow";
import Loader from "../components/Loader";
import { useReveal } from "../hooks/useReveal";

/** Shared chrome for every public page. */
export default function SiteLayout({ children, revealKey }) {
  useReveal([revealKey]);

  return (
    <div className="min-h-screen bg-background">
      <Loader />
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
