"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Lock,
  LogOut,
  LayoutDashboard,
  Sliders,
  Image as ImageIcon,
  Briefcase,
  Users,
  MessageSquareQuote,
  BookOpen,
  HelpCircle,
  PhoneCall,
  Settings as SettingsIcon,
  Inbox,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Eye,
  CheckCircle,
  X,
  Layers,
  DollarSign,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSite } from "@/context/SiteContext";

export default function AdminPage() {
  const { user, login, logout, ready: authReady } = useAuth();
  const site = useSite();

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Active navigation tab in Admin
  const [activeTab, setActiveTab] = useState("overview");
  const [saveToast, setSaveToast] = useState(false);

  const showSaved = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    const success = login(username, password);
    if (!success) {
      setLoginError("Invalid credentials. Please use admin / admin123");
    }
  };

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="skeleton h-12 w-12 rounded-full" />
      </div>
    );
  }

  // Not logged in -> Show luxury login screen
  if (!user) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center p-4">
        <div className="glass-dark max-w-md w-full rounded-3xl p-8 sm:p-10 border border-white/15 shadow-luxe text-background">
          <div className="text-center">
            <span className="gradient-gold mx-auto grid h-14 w-14 place-items-center rounded-full font-display text-2xl text-ink font-bold shadow-luxe">
              C
            </span>
            <h1 className="mt-4 font-display text-2xl text-background">
              Confianza Admin Portal
            </h1>
            <p className="mt-1 text-xs text-champagne/75 uppercase tracking-[0.25em]">
              Executive Content Management
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            {loginError && (
              <div className="rounded-xl bg-destructive/20 border border-destructive/40 p-3 text-xs text-destructive-foreground text-center">
                {loginError}
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-background/80 block mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-background placeholder:text-background/40 focus:border-secondary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-background/80 block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-background placeholder:text-background/40 focus:border-secondary focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="btn-luxe gradient-gold w-full text-ink font-bold shadow-luxe text-xs py-3"
              >
                <Lock className="h-4 w-4" />
                <span>Enter Admin Console</span>
              </button>
            </div>

            <div className="pt-3 text-center">
              <Link href="/" className="text-xs text-background/60 hover:text-secondary transition">
                â† Return to Public Website
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Navigation Items
  const NAV_ITEMS = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "inbox", label: `Inquiries Inbox (${site.messages?.length || 0})`, icon: Inbox },
    { id: "sections", label: "Homepage Sections", icon: Layers },
    { id: "hero", label: "Hero Slider", icon: Sliders },
    { id: "about", label: "About & Story", icon: Sparkles },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "portfolio", label: "Portfolio Works", icon: ImageIcon },
    { id: "gallery", label: "Pinterest Gallery", icon: ImageIcon },
    { id: "packages", label: "Packages & Pricing", icon: DollarSign },
    { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
    { id: "team", label: "Team & Staff", icon: Users },
    { id: "faq", label: "FAQ Manager", icon: HelpCircle },
    { id: "blogs", label: "Blog & Guides", icon: BookOpen },
    { id: "contact", label: "Contact & Hours", icon: PhoneCall },
    { id: "settings", label: "Brand & SEO Settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-accent/20 flex flex-col lg:flex-row">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up flex items-center gap-2 rounded-2xl gradient-royal text-primary-foreground px-5 py-3 shadow-luxe text-xs font-semibold">
          <CheckCircle className="h-4 w-4 text-secondary" />
          <span>Changes saved to LocalStorage successfully!</span>
        </div>
      )}

      {/* Admin Sidebar */}
      <aside className="w-full lg:w-72 bg-ink text-background flex flex-col justify-between shrink-0 border-r border-white/10 p-5 lg:min-h-screen sticky top-0 z-30">
        <div>
          {/* Brand header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3">
              <span className="gradient-gold grid h-10 w-10 place-items-center rounded-full font-display text-base text-ink font-bold shadow-md">
                C
              </span>
              <div>
                <span className="font-display text-base text-background block leading-tight">
                  Confianza
                </span>
                <span className="text-[0.62rem] uppercase tracking-widest text-champagne block">
                  Admin Dashboard
                </span>
              </div>
            </Link>
            <Link
              to="/"
              title="View live site"
              className="p-1.5 rounded-lg border border-white/20 text-background/70 hover:text-secondary hover:border-secondary transition"
            >
              <Eye className="h-4 w-4" />
            </Link>
          </div>

          {/* Navigation links */}
          <nav className="mt-5 space-y-1 max-h-[60vh] lg:max-h-[68vh] overflow-y-auto pr-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition text-left ${
                    isActive
                      ? "gradient-royal text-primary-foreground font-semibold shadow-md"
                      : "text-background/75 hover:bg-white/10 hover:text-background"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-secondary" : ""}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="pt-4 border-t border-white/10 space-y-2 mt-4">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Are you sure you want to reset all data back to original seed values?")) {
                site.resetAll();
                showSaved();
              }
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/20 py-2 text-[0.7rem] text-champagne hover:bg-white/10 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset to Default Data</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-destructive/20 border border-destructive/30 py-2 text-[0.7rem] text-destructive-foreground hover:bg-destructive/40 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out ({user.username})</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-6xl">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/80">
          <div>
            <span className="text-[0.68rem] uppercase tracking-[0.25em] text-primary font-semibold">
              Live Editing &amp; Control
            </span>
            <h1 className="font-display text-2xl sm:text-3xl text-ink capitalize">
              {activeTab === "overview"
                ? "Admin Dashboard"
                : activeTab === "inbox"
                ? "Client Inquiries Inbox"
                : `${activeTab} Management`}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="btn-luxe glass-card text-foreground text-xs py-2 px-4 border border-border"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview Live Site</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Tab Body */}
        <div className="mt-8">
          {activeTab === "overview" && (
            <OverviewModule site={site} setActiveTab={setActiveTab} />
          )}

          {activeTab === "inbox" && (
            <InboxModule site={site} showSaved={showSaved} />
          )}

          {activeTab === "sections" && (
            <SectionsManagerModule site={site} showSaved={showSaved} />
          )}

          {activeTab === "hero" && (
            <HeroEditorModule site={site} showSaved={showSaved} />
          )}

          {activeTab === "about" && (
            <AboutEditorModule site={site} showSaved={showSaved} />
          )}

          {activeTab === "services" && (
            <ServicesEditorModule site={site} showSaved={showSaved} />
          )}

          {activeTab === "portfolio" && (
            <PortfolioEditorModule site={site} showSaved={showSaved} />
          )}

          {activeTab === "gallery" && (
            <GalleryEditorModule site={site} showSaved={showSaved} />
          )}

          {activeTab === "packages" && (
            <PackagesEditorModule site={site} showSaved={showSaved} />
          )}

          {activeTab === "testimonials" && (
            <TestimonialsEditorModule site={site} showSaved={showSaved} />
          )}

          {activeTab === "team" && (
            <TeamEditorModule site={site} showSaved={showSaved} />
          )}

          {activeTab === "faq" && (
            <FaqEditorModule site={site} showSaved={showSaved} />
          )}

          {activeTab === "blogs" && (
            <BlogsEditorModule site={site} showSaved={showSaved} />
          )}

          {activeTab === "contact" && (
            <ContactEditorModule site={site} showSaved={showSaved} />
          )}

          {activeTab === "settings" && (
            <SettingsEditorModule site={site} showSaved={showSaved} />
          )}
        </div>
      </main>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 1: Overview
// -------------------------------------------------------------
function OverviewModule({ site, setActiveTab }) {
  const cards = [
    { label: "New Inquiries", value: site.messages?.length || 0, tab: "inbox", icon: Inbox },
    { label: "Active Services", value: site.services?.length || 0, tab: "services", icon: Briefcase },
    { label: "Portfolio Projects", value: site.portfolio?.length || 0, tab: "portfolio", icon: ImageIcon },
    { label: "Gallery Photos", value: site.gallery?.length || 0, tab: "gallery", icon: ImageIcon },
    { label: "Client Testimonials", value: site.testimonials?.length || 0, tab: "testimonials", icon: MessageSquareQuote },
    { label: "Journal Articles", value: site.blogs?.length || 0, tab: "blogs", icon: BookOpen },
    { label: "FAQ Items", value: site.faq?.length || 0, tab: "faq", icon: HelpCircle },
    { label: "Team Members", value: site.team?.length || 0, tab: "team", icon: Users },
  ];

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              onClick={() => setActiveTab(c.tab)}
              className="glass-card rounded-3xl p-5 border border-border cursor-pointer transition hover:-translate-y-1 hover:shadow-luxe hover:border-primary/40 flex items-center justify-between"
            >
              <div>
                <span className="text-xs text-muted-foreground block">{c.label}</span>
                <span className="font-display text-3xl text-ink font-bold mt-1 block">
                  {c.value}
                </span>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Inquiries Preview */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl text-ink">Recent Client Inquiries</h3>
          <button
            onClick={() => setActiveTab("inbox")}
            className="text-xs text-primary font-semibold hover:underline"
          >
            View All ({site.messages?.length || 0}) â†’
          </button>
        </div>

        {site.messages?.length === 0 ? (
          <p className="text-xs text-muted-foreground py-6 text-center">
            No inquiry messages yet. Test the contact form on the public site!
          </p>
        ) : (
          <div className="space-y-3">
            {site.messages.slice(0, 3).map((msg) => (
              <div
                key={msg.id}
                className="rounded-2xl p-4 bg-card/60 border border-border flex flex-col sm:flex-row justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-semibold text-ink text-sm block">{msg.name}</span>
                  <span className="text-muted-foreground block mt-0.5">
                    {msg.phone} â€¢ {msg.email} â€¢ Budget: {msg.budget}
                  </span>
                  <p className="text-foreground/80 mt-1 italic">"{msg.message}"</p>
                </div>
                <div className="text-[0.68rem] text-muted-foreground shrink-0 sm:text-right">
                  {new Date(msg.createdAt || msg.id).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 2: Inquiries Inbox
// -------------------------------------------------------------
function InboxModule({ site, showSaved }) {
  const messages = site.messages || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-xl text-ink">Received Booking &amp; Consultation Requests</h3>
        <span className="text-xs text-muted-foreground font-medium">
          Total Inquiries: {messages.length}
        </span>
      </div>

      {messages.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center text-muted-foreground">
          <Inbox className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="font-display text-lg text-ink">Inbox is Empty</p>
          <p className="text-xs mt-1">
            When users submit the Consultation Form, their requests will appear here instantly.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className="glass-card rounded-2xl p-5 border border-border flex flex-col sm:flex-row justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h4 className="font-display text-base text-ink font-semibold">{m.name}</h4>
                  <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[0.65rem] font-bold uppercase">
                    {m.service || "Wedding Planning"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
                  <div>
                    <span className="block text-[0.65rem] uppercase text-muted-foreground/70">Phone</span>
                    <a href={`tel:${m.phone}`} className="text-primary font-medium">{m.phone}</a>
                  </div>
                  <div>
                    <span className="block text-[0.65rem] uppercase text-muted-foreground/70">Email</span>
                    <a href={`mailto:${m.email}`} className="text-foreground">{m.email}</a>
                  </div>
                  <div>
                    <span className="block text-[0.65rem] uppercase text-muted-foreground/70">Event Date</span>
                    <span className="text-foreground">{m.eventDate || "TBD"}</span>
                  </div>
                  <div>
                    <span className="block text-[0.65rem] uppercase text-muted-foreground/70">Budget</span>
                    <span className="text-foreground font-semibold">{m.budget || "Standard"}</span>
                  </div>
                </div>

                {m.message && (
                  <div className="mt-3 rounded-xl bg-card/80 p-3 text-xs text-foreground/90 border border-border/50">
                    <span className="text-[0.65rem] uppercase text-muted-foreground block mb-1 font-semibold">
                      Client Message:
                    </span>
                    {m.message}
                  </div>
                )}
              </div>

              <div className="flex sm:flex-col justify-end items-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    site.removeMessage(m.id);
                    showSaved();
                  }}
                  className="rounded-lg p-2 text-destructive hover:bg-destructive/10 transition"
                  title="Delete message"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <span className="text-[0.65rem] text-muted-foreground">
                  {new Date(m.createdAt || m.id).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 3: Homepage Sections Manager (Reorder & Toggle)
// -------------------------------------------------------------
function SectionsManagerModule({ site, showSaved }) {
  const sections = site.settings?.sections || [];

  const toggleSection = (id) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    site.update("settings", (prev) => ({ ...prev, sections: updated }));
    showSaved();
  };

  const moveSection = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const newSections = [...sections];
    const temp = newSections[idx];
    newSections[idx] = newSections[targetIdx];
    newSections[targetIdx] = temp;
    site.update("settings", (prev) => ({ ...prev, sections: newSections }));
    showSaved();
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6">
      <div>
        <h3 className="font-display text-xl text-ink">Homepage Section Customizer</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Enable/disable sections or reorder them up and down. Changes reflect on the live homepage instantly.
        </p>
      </div>

      <div className="space-y-2.5">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
              sec.enabled
                ? "bg-card border-border shadow-xs"
                : "bg-muted/40 border-dashed border-border/60 opacity-60"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-muted-foreground w-6">
                #{idx + 1}
              </span>
              <span className="font-display text-base text-ink font-medium">
                {sec.label}
              </span>
              <span className="text-[0.65rem] text-muted-foreground/70 font-mono">
                ({sec.id})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => moveSection(idx, -1)}
                className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-30"
                title="Move up"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={idx === sections.length - 1}
                onClick={() => moveSection(idx, 1)}
                className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-30"
                title="Move down"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => toggleSection(sec.id)}
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition ${
                  sec.enabled
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {sec.enabled ? "Visible" : "Hidden"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 4: Hero Editor
// -------------------------------------------------------------
function HeroEditorModule({ site, showSaved }) {
  const [formData, setFormData] = useState(site.hero);

  const handleSave = (e) => {
    e.preventDefault();
    site.update("hero", formData);
    showSaved();
  };

  return (
    <form onSubmit={handleSave} className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6">
      <h3 className="font-display text-xl text-ink">Hero Section Content</h3>

      <div className="space-y-4 text-xs">
        <div>
          <label className="font-medium text-foreground block mb-1">Eyebrow Badge</label>
          <input
            type="text"
            value={formData.eyebrow}
            onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
            className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground"
          />
        </div>

        <div>
          <label className="font-medium text-foreground block mb-1">Main Headline</label>
          <input
            type="text"
            value={formData.headline}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground"
          />
        </div>

        <div>
          <label className="font-medium text-foreground block mb-1">Subtitle Description</label>
          <textarea
            rows={3}
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-medium text-foreground block mb-1">Primary Button Label</label>
            <input
              type="text"
              value={formData.primaryCta?.label}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  primaryCta: { ...formData.primaryCta, label: e.target.value },
                })
              }
              className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground"
            />
          </div>
          <div>
            <label className="font-medium text-foreground block mb-1">Secondary Button Label</label>
            <input
              type="text"
              value={formData.secondaryCta?.label}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  secondaryCta: { ...formData.secondaryCta, label: e.target.value },
                })
              }
              className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground"
            />
          </div>
        </div>

        <div>
          <label className="font-medium text-foreground block mb-1">
            Hero Slider Image URLs (one per line)
          </label>
          <textarea
            rows={3}
            value={(formData.images || []).join("\n")}
            onChange={(e) =>
              setFormData({
                ...formData,
                images: e.target.value.split("\n").filter(Boolean),
              })
            }
            className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground font-mono"
          />
        </div>
      </div>

      <button type="submit" className="btn-luxe gradient-royal text-primary-foreground text-xs">
        <Save className="h-4 w-4" />
        <span>Save Hero Settings</span>
      </button>
    </form>
  );
}

// -------------------------------------------------------------
// MODULE 5: About Editor
// -------------------------------------------------------------
function AboutEditorModule({ site, showSaved }) {
  const [formData, setFormData] = useState(site.about);

  const handleSave = (e) => {
    e.preventDefault();
    site.update("about", formData);
    showSaved();
  };

  return (
    <form onSubmit={handleSave} className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6">
      <h3 className="font-display text-xl text-ink">About Page &amp; Company Story</h3>

      <div className="space-y-4 text-xs">
        <div>
          <label className="font-medium text-foreground block mb-1">Section Heading</label>
          <input
            type="text"
            value={formData.heading}
            onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
            className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground"
          />
        </div>

        <div>
          <label className="font-medium text-foreground block mb-1">Company Story</label>
          <textarea
            rows={4}
            value={formData.story}
            onChange={(e) => setFormData({ ...formData, story: e.target.value })}
            className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-medium text-foreground block mb-1">Mission Statement</label>
            <textarea
              rows={3}
              value={formData.mission}
              onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground"
            />
          </div>
          <div>
            <label className="font-medium text-foreground block mb-1">Vision Statement</label>
            <textarea
              rows={3}
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground"
            />
          </div>
        </div>
      </div>

      <button type="submit" className="btn-luxe gradient-royal text-primary-foreground text-xs">
        <Save className="h-4 w-4" />
        <span>Save About Content</span>
      </button>
    </form>
  );
}

// -------------------------------------------------------------
// MODULE 6: Services Editor
// -------------------------------------------------------------
function ServicesEditorModule({ site, showSaved }) {
  const [services, setServices] = useState(site.services || []);
  const [editingService, setEditingService] = useState(null);

  const saveList = (newList) => {
    setServices(newList);
    site.update("services", newList);
    showSaved();
  };

  const deleteService = (id) => {
    saveList(services.filter((s) => s.id !== id));
  };

  const saveServiceModal = (e) => {
    e.preventDefault();
    if (editingService.isNew) {
      saveList([...services, { ...editingService, id: `service-${Date.now()}` }]);
    } else {
      saveList(services.map((s) => (s.id === editingService.id ? editingService : s)));
    }
    setEditingService(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-xl text-ink">Services Catalog ({services.length})</h3>
        <button
          type="button"
          onClick={() =>
            setEditingService({
              isNew: true,
              title: "",
              description: "",
              image: "/images/hero-1.jpg",
            })
          }
          className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div
            key={s.id}
            className="glass-card rounded-2xl p-4 border border-border flex flex-col justify-between"
          >
            <div className="flex gap-3">
              <img
                src={s.image}
                alt={s.title}
                className="h-16 w-16 rounded-xl object-cover shrink-0"
              />
              <div>
                <h4 className="font-display text-base font-semibold text-ink">{s.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {s.description}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingService({ ...s })}
                className="p-1.5 rounded-lg border border-border hover:bg-muted text-xs"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => deleteService(s.id)}
                className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-destructive text-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingService && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/80 p-4">
          <form
            onSubmit={saveServiceModal}
            className="glass-card max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-4"
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="font-display text-lg text-ink">
                {editingService.isNew ? "Add New Service" : "Edit Service"}
              </h4>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Service Title</label>
              <input
                type="text"
                required
                value={editingService.title}
                onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Description</label>
              <textarea
                rows={3}
                required
                value={editingService.description}
                onChange={(e) =>
                  setEditingService({ ...editingService, description: e.target.value })
                }
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Image URL</label>
              <input
                type="text"
                required
                value={editingService.image}
                onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-mono"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2 rounded-full border text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5"
              >
                Save Service
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 7: Portfolio Editor
// -------------------------------------------------------------
function PortfolioEditorModule({ site, showSaved }) {
  const [items, setItems] = useState(site.portfolio || []);
  const [editing, setEditing] = useState(null);

  const saveList = (newList) => {
    setItems(newList);
    site.update("portfolio", newList);
    showSaved();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-xl text-ink">Portfolio Projects ({items.length})</h3>
        <button
          type="button"
          onClick={() =>
            setEditing({
              isNew: true,
              title: "",
              category: "Wedding",
              image: "/images/hero-1.jpg",
              location: "Pune",
            })
          }
          className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4"
        >
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <div
            key={p.id}
            className="glass-card rounded-2xl overflow-hidden border border-border flex flex-col justify-between"
          >
            <div className="relative h-40">
              <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
              <span className="absolute top-2 left-2 rounded-full bg-ink/80 px-2 py-0.5 text-[0.65rem] text-champagne">
                {p.category}
              </span>
            </div>
            <div className="p-4">
              <h4 className="font-display text-base text-ink font-semibold">{p.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{p.location}</p>
              <div className="mt-4 pt-3 border-t border-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing({ ...p })}
                  className="p-1.5 rounded-lg border border-border hover:bg-muted text-xs"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => saveList(items.filter((x) => x.id !== p.id))}
                  className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-destructive text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/80 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editing.isNew) {
                saveList([...items, { ...editing, id: Date.now() }]);
              } else {
                saveList(items.map((x) => (x.id === editing.id ? editing : x)));
              }
              setEditing(null);
            }}
            className="glass-card max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-4"
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="font-display text-lg text-ink">
                {editing.isNew ? "Add Portfolio Project" : "Edit Portfolio Project"}
              </h4>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Title</label>
              <input
                type="text"
                required
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Category</label>
              <input
                type="text"
                required
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Location / Venue</label>
              <input
                type="text"
                required
                value={editing.location}
                onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Image URL</label>
              <input
                type="text"
                required
                value={editing.image}
                onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-mono"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded-full border text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5"
              >
                Save Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 8: Gallery Editor
// -------------------------------------------------------------
function GalleryEditorModule({ site, showSaved }) {
  const [gallery, setGallery] = useState(site.gallery || []);

  const saveGallery = (newList) => {
    setGallery(newList);
    site.update("gallery", newList);
    showSaved();
  };

  const addPhoto = () => {
    const caption = window.prompt("Enter photo caption:", "Grand Wedding Decor");
    if (!caption) return;
    const url = window.prompt("Enter photo URL:", "/images/hero-1.jpg");
    if (!url) return;
    saveGallery([...gallery, { id: Date.now(), caption, image: url }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-xl text-ink">Pinterest Gallery Photos ({gallery.length})</h3>
        <button
          type="button"
          onClick={addPhoto}
          className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4"
        >
          <Plus className="h-4 w-4" />
          <span>Add Photo</span>
        </button>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {gallery.map((g) => (
          <div key={g.id} className="relative group rounded-2xl overflow-hidden border border-border shadow-xs">
            <img src={g.image} alt={g.caption} className="h-44 w-full object-cover" />
            <div className="absolute inset-0 bg-ink/75 opacity-0 group-hover:opacity-100 transition p-3 flex flex-col justify-between text-background text-xs">
              <span>{g.caption}</span>
              <button
                type="button"
                onClick={() => saveGallery(gallery.filter((x) => x.id !== g.id))}
                className="self-end p-1 rounded-lg bg-destructive text-white"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 9: Packages & Pricing Editor
// -------------------------------------------------------------
function PackagesEditorModule({ site, showSaved }) {
  const [packages, setPackages] = useState(site.packages || []);

  const savePackages = (newPkgs) => {
    setPackages(newPkgs);
    site.update("packages", newPkgs);
    showSaved();
  };

  return (
    <div className="space-y-6">
      <h3 className="font-display text-xl text-ink">Packages &amp; Pricing Tiers</h3>

      <div className="grid gap-6 lg:grid-cols-3">
        {packages.map((pkg, idx) => (
          <div key={pkg.id || idx} className="glass-card rounded-3xl p-6 border border-border space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Tier Name
              </label>
              <input
                type="text"
                value={pkg.name}
                onChange={(e) => {
                  const updated = [...packages];
                  updated[idx] = { ...pkg, name: e.target.value };
                  savePackages(updated);
                }}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-display font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Starting Price
              </label>
              <input
                type="text"
                value={pkg.price}
                onChange={(e) => {
                  const updated = [...packages];
                  updated[idx] = { ...pkg, price: e.target.value };
                  savePackages(updated);
                }}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Badge / Tag
              </label>
              <input
                type="text"
                value={pkg.tag}
                onChange={(e) => {
                  const updated = [...packages];
                  updated[idx] = { ...pkg, tag: e.target.value };
                  savePackages(updated);
                }}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Included Features (one per line)
              </label>
              <textarea
                rows={4}
                value={(pkg.features || []).join("\n")}
                onChange={(e) => {
                  const updated = [...packages];
                  updated[idx] = { ...pkg, features: e.target.value.split("\n").filter(Boolean) };
                  savePackages(updated);
                }}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 10: Testimonials Editor
// -------------------------------------------------------------
function TestimonialsEditorModule({ site, showSaved }) {
  const [list, setList] = useState(site.testimonials || []);

  const saveList = (newList) => {
    setList(newList);
    site.update("testimonials", newList);
    showSaved();
  };

  const addReview = () => {
    const name = window.prompt("Couple Names (e.g. Maya & Aryan):");
    if (!name) return;
    const text = window.prompt("Review Quote:");
    if (!text) return;
    saveList([
      ...list,
      {
        id: Date.now(),
        name,
        text,
        location: "Pune",
        date: "2025",
        rating: 5,
        image: "/images/couple.jpg",
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-xl text-ink">Client Reviews &amp; Testimonials ({list.length})</h3>
        <button
          type="button"
          onClick={addReview}
          className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4"
        >
          <Plus className="h-4 w-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((t) => (
          <div key={t.id} className="glass-card rounded-2xl p-5 border border-border space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <img src={t.image} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-display text-sm font-bold text-ink">{t.name}</h4>
                  <span className="text-[0.68rem] text-muted-foreground">
                    {t.location} â€¢ {t.date}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => saveList(list.filter((x) => x.id !== t.id))}
                className="text-destructive p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-foreground/80 italic">"{t.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 11: Team Editor
// -------------------------------------------------------------
function TeamEditorModule({ site, showSaved }) {
  const [team, setTeam] = useState(site.team || []);

  const saveTeam = (newList) => {
    setTeam(newList);
    site.update("team", newList);
    showSaved();
  };

  return (
    <div className="space-y-6">
      <h3 className="font-display text-xl text-ink">Executive Team Members ({team.length})</h3>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((m, idx) => (
          <div key={m.id || idx} className="glass-card rounded-2xl p-5 border border-border space-y-3">
            <img src={m.image} alt={m.name} className="h-28 w-full object-cover rounded-xl" />
            <div>
              <label className="text-[0.65rem] font-bold uppercase text-muted-foreground">Name</label>
              <input
                type="text"
                value={m.name}
                onChange={(e) => {
                  const updated = [...team];
                  updated[idx] = { ...m, name: e.target.value };
                  saveTeam(updated);
                }}
                className="w-full rounded-lg border px-2 py-1 text-xs"
              />
            </div>
            <div>
              <label className="text-[0.65rem] font-bold uppercase text-muted-foreground">Role</label>
              <input
                type="text"
                value={m.role}
                onChange={(e) => {
                  const updated = [...team];
                  updated[idx] = { ...m, role: e.target.value };
                  saveTeam(updated);
                }}
                className="w-full rounded-lg border px-2 py-1 text-xs"
              />
            </div>
            <div>
              <label className="text-[0.65rem] font-bold uppercase text-muted-foreground">Bio</label>
              <textarea
                rows={2}
                value={m.bio}
                onChange={(e) => {
                  const updated = [...team];
                  updated[idx] = { ...m, bio: e.target.value };
                  saveTeam(updated);
                }}
                className="w-full rounded-lg border px-2 py-1 text-xs"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 12: FAQ Editor
// -------------------------------------------------------------
function FaqEditorModule({ site, showSaved }) {
  const [faq, setFaq] = useState(site.faq || []);

  const saveFaq = (newList) => {
    setFaq(newList);
    site.update("faq", newList);
    showSaved();
  };

  const addFaq = () => {
    const question = window.prompt("Question:");
    if (!question) return;
    const answer = window.prompt("Answer:");
    if (!answer) return;
    saveFaq([...faq, { id: Date.now(), question, answer }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-xl text-ink">FAQ Items ({faq.length})</h3>
        <button
          type="button"
          onClick={addFaq}
          className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4"
        >
          <Plus className="h-4 w-4" />
          <span>Add Question</span>
        </button>
      </div>

      <div className="space-y-3">
        {faq.map((f, idx) => (
          <div key={f.id} className="glass-card rounded-2xl p-4 border border-border space-y-2">
            <div className="flex justify-between items-center">
              <input
                type="text"
                value={f.question}
                onChange={(e) => {
                  const updated = [...faq];
                  updated[idx] = { ...f, question: e.target.value };
                  saveFaq(updated);
                }}
                className="w-full font-semibold text-sm rounded-lg border px-3 py-1.5 mr-2"
              />
              <button
                type="button"
                onClick={() => saveFaq(faq.filter((x) => x.id !== f.id))}
                className="text-destructive p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <textarea
              rows={2}
              value={f.answer}
              onChange={(e) => {
                const updated = [...faq];
                updated[idx] = { ...f, answer: e.target.value };
                saveFaq(updated);
              }}
              className="w-full text-xs text-muted-foreground rounded-lg border px-3 py-1.5"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 13: Blogs Editor
// -------------------------------------------------------------
function BlogsEditorModule({ site, showSaved }) {
  const [blogs, setBlogs] = useState(site.blogs || []);
  const [editing, setEditing] = useState(null);

  const saveBlogs = (newList) => {
    setBlogs(newList);
    site.update("blogs", newList);
    showSaved();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-xl text-ink">Wedding Guides &amp; Blog Posts ({blogs.length})</h3>
        <button
          type="button"
          onClick={() =>
            setEditing({
              isNew: true,
              title: "",
              category: "Wedding Tips",
              date: "Today",
              excerpt: "",
              content: "",
              image: "/images/hero-1.jpg",
            })
          }
          className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4"
        >
          <Plus className="h-4 w-4" />
          <span>Write Article</span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {blogs.map((b) => (
          <div key={b.id} className="glass-card rounded-2xl p-5 border border-border flex flex-col justify-between">
            <div>
              <span className="text-[0.65rem] uppercase text-primary font-bold">{b.category}</span>
              <h4 className="font-display text-base font-bold text-ink mt-1">{b.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-2">{b.excerpt}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing({ ...b })}
                className="p-1.5 rounded-lg border hover:bg-muted text-xs"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => saveBlogs(blogs.filter((x) => x.id !== b.id))}
                className="p-1.5 rounded-lg border text-destructive hover:bg-destructive/10 text-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/80 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editing.isNew) {
                saveBlogs([...blogs, { ...editing, id: Date.now() }]);
              } else {
                saveBlogs(blogs.map((x) => (x.id === editing.id ? editing : x)));
              }
              setEditing(null);
            }}
            className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 space-y-4"
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="font-display text-lg text-ink">
                {editing.isNew ? "Write Article" : "Edit Article"}
              </h4>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-medium block mb-1">Title</label>
              <input
                type="text"
                required
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium block mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Date</label>
                <input
                  type="text"
                  required
                  value={editing.date}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium block mb-1">Excerpt Summary</label>
              <textarea
                rows={2}
                required
                value={editing.excerpt}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium block mb-1">Full Article Content</label>
              <textarea
                rows={5}
                required
                value={editing.content}
                onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded-full border text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5"
              >
                Publish Article
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 14: Contact & Business Details Editor
// -------------------------------------------------------------
function ContactEditorModule({ site, showSaved }) {
  const [contact, setContact] = useState(site.contact);

  const handleSave = (e) => {
    e.preventDefault();
    site.update("contact", contact);
    showSaved();
  };

  return (
    <form onSubmit={handleSave} className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6">
      <h3 className="font-display text-xl text-ink">Contact Details &amp; Business Address</h3>

      <div className="grid sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="font-medium text-foreground block mb-1">Business Name</label>
          <input
            type="text"
            value={contact.business}
            onChange={(e) => setContact({ ...contact, business: e.target.value })}
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
          />
        </div>
        <div>
          <label className="font-medium text-foreground block mb-1">Business Owner / Founder</label>
          <input
            type="text"
            value={contact.owner}
            onChange={(e) => setContact({ ...contact, owner: e.target.value })}
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
          />
        </div>
        <div>
          <label className="font-medium text-foreground block mb-1">Phone Number</label>
          <input
            type="text"
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
          />
        </div>
        <div>
          <label className="font-medium text-foreground block mb-1">WhatsApp Number (e.g. 919850983389)</label>
          <input
            type="text"
            value={contact.whatsapp}
            onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
          />
        </div>
        <div>
          <label className="font-medium text-foreground block mb-1">Email Address</label>
          <input
            type="email"
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
          />
        </div>
        <div>
          <label className="font-medium text-foreground block mb-1">Instagram URL</label>
          <input
            type="text"
            value={contact.instagram}
            onChange={(e) => setContact({ ...contact, instagram: e.target.value })}
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
          />
        </div>
      </div>

      <div className="space-y-3 pt-2 text-xs">
        <h4 className="font-semibold text-ink">Physical Studio Address</h4>
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Address Line 1"
            value={contact.address?.line1}
            onChange={(e) =>
              setContact({
                ...contact,
                address: { ...contact.address, line1: e.target.value },
              })
            }
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Address Line 2"
            value={contact.address?.line2}
            onChange={(e) =>
              setContact({
                ...contact,
                address: { ...contact.address, line2: e.target.value },
              })
            }
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="City"
            value={contact.address?.city}
            onChange={(e) =>
              setContact({
                ...contact,
                address: { ...contact.address, city: e.target.value },
              })
            }
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Pincode"
            value={contact.address?.pincode}
            onChange={(e) =>
              setContact({
                ...contact,
                address: { ...contact.address, pincode: e.target.value },
              })
            }
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
          />
        </div>
      </div>

      <button type="submit" className="btn-luxe gradient-royal text-primary-foreground text-xs">
        <Save className="h-4 w-4" />
        <span>Save Contact Details</span>
      </button>
    </form>
  );
}

// -------------------------------------------------------------
// MODULE 15: Settings & SEO Editor
// -------------------------------------------------------------
function SettingsEditorModule({ site, showSaved }) {
  const [settings, setSettings] = useState(site.settings);

  const handleSave = (e) => {
    e.preventDefault();
    site.update("settings", settings);
    showSaved();
  };

  return (
    <form onSubmit={handleSave} className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6">
      <h3 className="font-display text-xl text-ink">Branding &amp; SEO Metadata</h3>

      <div className="space-y-4 text-xs">
        <div>
          <label className="font-medium text-foreground block mb-1">Brand Name</label>
          <input
            type="text"
            value={settings.brand?.name}
            onChange={(e) =>
              setSettings({
                ...settings,
                brand: { ...settings.brand, name: e.target.value },
              })
            }
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
          />
        </div>

        <div>
          <label className="font-medium text-foreground block mb-1">Tagline</label>
          <input
            type="text"
            value={settings.brand?.tagline}
            onChange={(e) =>
              setSettings({
                ...settings,
                brand: { ...settings.brand, tagline: e.target.value },
              })
            }
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
          />
        </div>

        <div>
          <label className="font-medium text-foreground block mb-1">SEO Title</label>
          <input
            type="text"
            value={settings.seo?.title}
            onChange={(e) =>
              setSettings({
                ...settings,
                seo: { ...settings.seo, title: e.target.value },
              })
            }
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
          />
        </div>

        <div>
          <label className="font-medium text-foreground block mb-1">SEO Meta Description</label>
          <textarea
            rows={3}
            value={settings.seo?.description}
            onChange={(e) =>
              setSettings({
                ...settings,
                seo: { ...settings.seo, description: e.target.value },
              })
            }
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
          />
        </div>
      </div>

      <button type="submit" className="btn-luxe gradient-royal text-primary-foreground text-xs">
        <Save className="h-4 w-4" />
        <span>Save Brand &amp; SEO Settings</span>
      </button>
    </form>
  );
}

