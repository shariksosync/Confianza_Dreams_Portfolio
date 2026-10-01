"use client";

import { useState, useEffect, useRef } from "react";
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
  Check,
  CheckCircle,
  CheckCircle2,
  X,
  Layers,
  DollarSign,
  Quote,
  Award,
  Upload,
  Loader2,
  Feather,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
  MapPin,
  Star,
  Play,
  Phone,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSite } from "@/context/SiteContext";
import ImageUploadField from "@/components/ImageUploadField";

function ModuleRefreshButton({ site, showSaved, label = "Refresh Database", className = "" }) {
  const [localSpin, setLocalSpin] = useState(false);
  const isSpinning = site?.refreshing || localSpin;

  const handleManualRefresh = async () => {
    try {
      setLocalSpin(true);
      if (typeof site?.refreshData === "function") {
        await site.refreshData({ fresh: true, includeInquiries: true });
      } else if (typeof site?.refresh === "function") {
        await site.refresh({ fresh: true, includeInquiries: true });
      }
      if (typeof showSaved === "function") {
        showSaved("Data synchronized with MongoDB Atlas successfully!");
      }
    } catch (err) {
      console.error("Manual refresh error:", err);
    } finally {
      setTimeout(() => setLocalSpin(false), 600);
    }
  };

  return (
    <button
      type="button"
      onClick={handleManualRefresh}
      disabled={isSpinning}
      title="Fetch fresh data from MongoDB Atlas database"
      className={`px-3.5 py-1.5 rounded-xl border border-secondary/50 bg-card hover:bg-card/90 text-foreground hover:text-secondary hover:border-secondary text-xs font-semibold flex items-center gap-2 shadow-xs transition-all duration-200 cursor-pointer disabled:opacity-60 shrink-0 ${className}`}
    >
      <RotateCcw className={`h-3.5 w-3.5 text-secondary ${isSpinning ? "animate-spin" : ""}`} />
      <span className="tracking-wide">{isSpinning ? "Refreshing..." : label}</span>
    </button>
  );
}

export default function AdminPage() {
  const { user, login, logout, ready: authReady } = useAuth();
  const site = useSite();

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Active navigation tab in Admin
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Changes saved to MongoDB database successfully!");

  useEffect(() => {
    if (user && site.refreshInquiries) {
      site.refreshInquiries();
    }
  }, [user]);

  const showSaved = (msg) => {
    if (typeof msg === "string") {
      setToastMessage(msg);
    } else {
      setToastMessage("Changes saved to MongoDB database successfully!");
    }
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    const res = await login(username, password);
    setLoggingIn(false);
    if (!res.success) {
      setLoginError(res.error || "Invalid credentials. Please use admin / admin123");
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
            <div className="relative mx-auto h-14 w-14 rounded-full overflow-hidden shadow-luxe ring-2 ring-secondary/60 bg-ink flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Confianza Logo"
                className="h-full w-full object-cover"
              />
            </div>
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
                placeholder="Enter username (e.g. admin)"
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
                placeholder="Enter password..."
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
              <Link href="/" className="text-xs text-background/60 hover:text-secondary transition inline-flex items-center gap-1.5">
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Return to Public Website</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const pendingTestimonialsCount = (site.allTestimonials || site.testimonials || []).filter((t) => t.status === "pending").length;

  // Navigation Items
  const NAV_ITEMS = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "inbox", label: `Inquiries Inbox (${site.messages?.length || 0})`, icon: Inbox },
    { id: "sections", label: "Homepage Sections", icon: Layers },
    { id: "hero", label: "Hero Slider", icon: Sliders },
    { id: "about", label: "About", icon: Sparkles },
    { id: "services", label: "Services & Packages", icon: Briefcase },
    { id: "portfolio", label: "Portfolio Works", icon: ImageIcon },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    {
      id: "testimonials",
      label: pendingTestimonialsCount > 0 ? `Testimonials (${pendingTestimonialsCount} New)` : "Testimonials & Reviews",
      icon: MessageSquareQuote,
    },
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
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Sidebar with Smooth Collapsible View */}
      <aside
        className={`w-full ${
          sidebarCollapsed ? "lg:w-20" : "lg:w-72"
        } transition-all duration-300 ease-in-out bg-ink text-background flex flex-col justify-between shrink-0 border-r border-white/10 ${
          sidebarCollapsed ? "p-3" : "p-4"
        } lg:min-h-screen sticky top-0 z-30`}
      >
        <div>
          {/* Brand header */}
          {sidebarCollapsed ? (
            <div className="flex flex-col items-center gap-3 pb-3.5 border-b border-white/10">
              <Link href="/" title="Confianza Home" className="flex items-center justify-center">
                <div className="relative h-9 w-9 shrink-0 rounded-full overflow-hidden ring-2 ring-secondary/60 shadow-md bg-ink flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="Confianza Logo"
                    className="h-full w-full object-cover"
                  />
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setSidebarCollapsed(false)}
                title="Expand Sidebar"
                className="p-1.5 rounded-lg border border-white/20 text-background/70 hover:text-secondary hover:border-secondary transition cursor-pointer flex items-center justify-center"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between pb-4 border-b border-white/10 gap-2">
              <Link href="/" className="flex items-center gap-3 overflow-hidden">
                <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden ring-2 ring-secondary/60 shadow-md bg-ink flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="Confianza Logo"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="truncate">
                  <span className="font-display text-base text-background block leading-tight truncate">
                    Confianza
                  </span>
                  <span className="text-[0.62rem] uppercase tracking-widest text-champagne block truncate">
                    Admin Dashboard
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-1 shrink-0">
                <Link
                  href="/"
                  title="View live site"
                  className="p-1.5 rounded-lg border border-white/20 text-background/70 hover:text-secondary hover:border-secondary transition"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setSidebarCollapsed(true)}
                  title="Collapse Sidebar"
                  className="p-1.5 rounded-lg border border-white/20 text-background/70 hover:text-secondary hover:border-secondary transition cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Navigation links */}
          <nav className="mt-4 space-y-1 max-h-[60vh] lg:max-h-[68vh] overflow-y-auto pr-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className={`w-full flex items-center gap-3 rounded-xl text-xs font-medium transition cursor-pointer ${
                    sidebarCollapsed ? "justify-center p-2.5" : "px-3.5 py-2.5 text-left"
                  } ${
                    isActive
                      ? "gradient-royal text-primary-foreground font-semibold shadow-md"
                      : "text-background/75 hover:bg-white/10 hover:text-background"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-secondary" : ""}`} />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
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
              if (window.confirm("Reload data from database?")) {
                site.refreshData();
                showSaved();
              }
            }}
            title="Refresh Database Data"
            className={`w-full flex items-center justify-center gap-2 rounded-xl border border-white/20 py-2 text-[0.7rem] text-champagne hover:bg-white/10 transition cursor-pointer ${
              sidebarCollapsed ? "px-0" : ""
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5 shrink-0" />
            {!sidebarCollapsed && <span>Refresh Database Data</span>}
          </button>

          <button
            type="button"
            onClick={logout}
            title={`Sign Out (${user.username})`}
            className={`w-full flex items-center justify-center gap-2 rounded-xl bg-destructive/20 border border-destructive/30 py-2 text-[0.7rem] text-destructive-foreground hover:bg-destructive/40 transition cursor-pointer ${
              sidebarCollapsed ? "px-0" : ""
            }`}
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            {!sidebarCollapsed && <span>Sign Out ({user.username})</span>}
          </button>
        </div>
      </aside>

      {/* Main Admin Content Canvas with Fluid Auto-Resizing */}
      <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-10 transition-all duration-300 ease-in-out overflow-x-hidden">
        <div className="max-w-6xl mx-auto w-full space-y-8">
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

            <div className="flex items-center gap-2.5">
              <ModuleRefreshButton site={site} showSaved={showSaved} label="Refresh Database Data" />
              <Link
                href="/"
                target="_blank"
                className="btn-luxe glass-card text-foreground text-xs py-2 px-4 border border-border flex items-center gap-1.5"
              >
                <Eye className="h-3.5 w-3.5 text-secondary" />
                <span>Preview Live Site</span>
              </Link>
            </div>
          </div>

          {/* Dynamic Tab Body */}
          <div className="w-full">
            {activeTab === "overview" && (
              <OverviewModule site={site} setActiveTab={setActiveTab} showSaved={showSaved} />
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
        </div>
      </main>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 1: Overview
// -------------------------------------------------------------
function OverviewModule({ site, setActiveTab, showSaved }) {
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
      {/* Overview Header with Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
        <div>
          <h2 className="font-display text-xl text-ink font-semibold">Overview &amp; Quick Metrics</h2>
          <p className="text-xs text-muted-foreground">Real-time statistics synchronized from MongoDB Atlas</p>
        </div>
        <ModuleRefreshButton site={site} showSaved={showSaved} label="Refresh Overview" />
      </div>

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
            View All ({site.messages?.length || 0}) &rarr;
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
                    {msg.phone} &bull; {msg.email} &bull; Budget: {msg.budget}
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-xl text-ink font-semibold">Received Booking &amp; Consultation Requests</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Total Inquiries: {messages.length}</p>
        </div>
        <ModuleRefreshButton site={site} showSaved={showSaved} label="Refresh Inbox" />
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
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <h3 className="font-display text-xl text-ink font-semibold">Homepage Section Customizer</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Enable/disable sections or reorder them up and down. Changes reflect on the live homepage instantly.
          </p>
        </div>
        <ModuleRefreshButton site={site} showSaved={showSaved} label="Refresh Sections" />
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
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <h3 className="font-display text-xl text-ink font-semibold">Hero Section Content</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Customize homepage hero slider headlines, badges, CTA buttons & images</p>
        </div>
        <ModuleRefreshButton site={site} showSaved={showSaved} label="Refresh Hero" />
      </div>

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
// -------------------------------------------------------------
// MODULE 5: About Editor (Comprehensive Full CRUD)
// -------------------------------------------------------------
function AboutEditorModule({ site, showSaved }) {
  const [subTab, setSubTab] = useState("hero-banner");
  const [aboutData, setAboutData] = useState(() => ({
    heading: site.about?.heading || "Where Weddings Become Stories",
    story: site.about?.story || "At Confianza, we're the romantic and elegant wedding experts who bring love stories to life with passion and precision. For us, your event is no less than our own.",
    headerBanner: {
      badge: site.about?.headerBanner?.badge || "Since 2018 • Warje, Pune",
      title: site.about?.headerBanner?.title || site.about?.heading || "Where Weddings Become Stories",
      subtitle: site.about?.headerBanner?.subtitle || site.about?.story || "At Confianza, we're the romantic and elegant wedding experts who bring love stories to life with passion and precision. For us, your event is no less than our own.",
      image: site.about?.headerBanner?.image || "/images/hero-1.jpg",
    },
    mission: site.about?.mission || "To take the weight of planning off a family's shoulders and hand back a celebration they can be fully present for.",
    vision: site.about?.vision || "To be the most trusted and admired name in personalised luxury weddings across Maharashtra and every landmark destination we travel to.",
    founderAddress: {
      badge: site.about?.founderAddress?.badge || "FOUNDER'S VISION",
      eyebrow: site.about?.founderAddress?.eyebrow || "FOUNDER'S ADDRESS",
      quote: site.about?.founderAddress?.quote || "We don't just decorate halls; we architect emotional memories that outlast generations.",
      image: site.about?.founderAddress?.image || "/images/couple.jpg",
      name: site.about?.founderAddress?.name || "Mr. Ashish Wankhede",
      role: site.about?.founderAddress?.role || "Founder & Managing Director",
      story: site.about?.founderAddress?.story || "When we founded Confianza Event's and Entertainment, our singular mission was to bring authenticity, structured elegance, and heartfelt reverence back to Indian wedding celebrations.\n\nIn a country rich with boundless youth potential, traditions, and royal heritage, our couples deserve bespoke spatial styling, transparent budgeting, and calm, legitimate execution that elevates their special day from a routine banquet into a cinematic family heirloom.\n\nWe pledge our continuous dedication to nurturing not just flawless events, but lifelong relationships with the families who place their deepest faith in our hands.",
      signatureName: site.about?.founderAddress?.signatureName || "Mr. Ashish Wankhede",
      signatureTitle: site.about?.founderAddress?.signatureTitle || "Founder & Principal Director, Confianza Events",
    },
    visionPillars: Array.isArray(site.about?.visionPillars) && site.about.visionPillars.length > 0
      ? site.about.visionPillars
      : [
          "Pioneering royal destination wedding experiences across India & abroad",
          "Setting the benchmark for bespoke spatial architecture & floral aesthetics",
          "Preserving authentic cultural rituals while infusing contemporary elegance",
        ],
    missionCommitments: Array.isArray(site.about?.missionCommitments) && site.about.missionCommitments.length > 0
      ? site.about.missionCommitments
      : [
          "Lifting all logistical burdens so families remain fully present guests",
          "Complete budget transparency with zero hidden markups or surprises",
          "Precision-timed execution delivered by calm, dedicated ground crews",
        ],
    coreValues: Array.isArray(site.about?.coreValues) && site.about.coreValues.length > 0
      ? site.about.coreValues
      : [
          {
            icon: "ShieldCheck",
            title: "Uncompromised Trust (Confianza)",
            subtitle: "Absolute Honesty in Costing",
            text: "True to our name, we believe trust is the cornerstone of luxury. We provide completely transparent itemized sheets with zero hidden commissions or eleventh-hour markups.",
            gradient: "from-secondary to-amber-500",
          },
          {
            icon: "Palette",
            title: "Artistic Distinction",
            subtitle: "Tailored, Never Templated",
            text: "Every couple has a unique rhythm. We craft custom mood boards, bespoke drape geometries, and original floral installations designed specifically for your aesthetic.",
            gradient: "from-primary to-purple-600",
          },
          {
            icon: "Clock",
            title: "Operational Precision",
            subtitle: "Time-Tested Execution",
            text: "Our production crews start before sunrise with minute-by-minute run sheets, dual generator backups, and proactive weather contingencies to ensure zero delays.",
            gradient: "from-blue-600 to-indigo-600",
          },
          {
            icon: "HeartHandshake",
            title: "Empathetic Hospitality",
            subtitle: "Caring for Your Family",
            text: "Weddings are emotional milestones. We coordinate with elders, prioritize guest comfort, and manage vendor interactions so you stay relaxed throughout.",
            gradient: "from-rose-500 to-primary",
          },
          {
            icon: "Leaf",
            title: "Sustainable Elegance",
            subtitle: "Conscious Celebrations",
            text: "We partner with local floral cultivators, utilize low-emission LED lighting designs, and recycle organic decor waste responsibly after grand events.",
            gradient: "from-emerald-600 to-teal-600",
          },
        ],
    howWeWork: Array.isArray(site.about?.howWeWork) && site.about.howWeWork.length > 0
      ? site.about.howWeWork
      : [
          {
            num: "01",
            title: "Discovery & Story Session",
            timeline: "Month 1 • Foundation",
            summary: "We begin by listening deeply to your love story, preferred aesthetic, family rituals, guest demographics, and realistic budget expectations.",
            deliverables: ["Comprehensive Wedding Questionnaire", "Budget Allocation Framework", "Timeline Strategy Map"],
          },
          {
            num: "02",
            title: "3D Spatial Design & Mood Boards",
            timeline: "Month 2 - 3 • Artistry",
            summary: "Our design studio creates realistic 3D renderings of the mandap, entrance arches, stage, and tablescapes so you see your wedding before we build it.",
            deliverables: ["Custom Color & Floral Palettes", "3D CAD Decor Previews", "Lighting & Sound Schematics"],
          },
          {
            num: "03",
            title: "Vendor Curation & Venue Scouting",
            timeline: "Month 4 - 6 • Procurement",
            summary: "We scout and lock in premier venues across India, negotiate with top caterers, celebrity artists, photographers, and priests with zero hidden fees.",
            deliverables: ["Venue Contract Finalization", "Menu Tastings & Artist Bookings", "Licensing & Permissions"],
          },
          {
            num: "04",
            title: "Production & Technical Rehearsals",
            timeline: "Final Weeks • Engineering",
            summary: "Our ground crew takes over the venue 24 hours prior. Carpentry, structural draping, floral conditioning, and sound tests run seamlessly through the night.",
            deliverables: ["Minute-by-Minute Master Run Sheet", "Vendor Arrival Checklists", "Sound & Light Rehearsals"],
          },
          {
            num: "05",
            title: "Celebration Day & Calm Execution",
            timeline: "Wedding Day • Pure Joy",
            summary: "You step into your wedding as honored guests. Our shadow coordinators and ground directors handle all logistics, cues, and guest care with quiet poise.",
            deliverables: ["Dedicated Bride & Groom Shadows", "Family VIP Hospitality", "Flawless Show Flow Management"],
          },
        ],
  }));

  // Sync state when site data updates
  useEffect(() => {
    if (site.about) {
      setAboutData((prev) => ({
        ...prev,
        ...site.about,
        headerBanner: {
          badge: site.about?.headerBanner?.badge || "Since 2018 • Warje, Pune",
          title: site.about?.headerBanner?.title || site.about?.heading || "Where Weddings Become Stories",
          subtitle: site.about?.headerBanner?.subtitle || site.about?.story || "At Confianza, we're the romantic and elegant wedding experts who bring love stories to life with passion and precision. For us, your event is no less than our own.",
          image: site.about?.headerBanner?.image || "/images/hero-1.jpg",
          ...(site.about.headerBanner || {}),
        },
        founderAddress: {
          ...prev.founderAddress,
          ...(site.about.founderAddress || {}),
        },
      }));
    }
    if (site.team) {
      setTeamMembers(site.team);
    }
  }, [site.about, site.team]);

  // Team state and modal inside About
  const [teamMembers, setTeamMembers] = useState(site.team || []);
  const [editingMember, setEditingMember] = useState(null);

  const [isSaving, setIsSaving] = useState(false);

  // Core Value modal
  const [editingValue, setEditingValue] = useState(null);

  // How We Work modal
  const [editingStep, setEditingStep] = useState(null);

  const saveAbout = async (updated) => {
    setIsSaving(true);
    try {
      setAboutData(updated);
      await site.update("about", updated);
      showSaved();
    } catch (e) {
      console.error("Save about error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const saveTeam = async (newList) => {
    setIsSaving(true);
    try {
      setTeamMembers(newList);
      await site.update("team", newList);
      showSaved();
    } catch (e) {
      console.error("Save team error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const subTabs = [
    { id: "hero-banner", label: "About Page Header Banner" },
    { id: "founder", label: "Founder's Vision & Address" },
    { id: "team", label: `Team Members (${teamMembers.length})` },
    { id: "vision-mission", label: "Vision & Mission" },
    { id: "core-values", label: "Core Values (5 Pillars)" },
    { id: "how-we-work", label: "How We Work (5 Stages)" },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border/80">
        <div className="flex flex-wrap gap-2">
          {subTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSubTab(t.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                subTab === t.id
                  ? "gradient-royal text-primary-foreground shadow-md"
                  : "glass-card text-foreground/75 hover:text-primary hover:bg-muted/60"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <ModuleRefreshButton site={site} showSaved={showSaved} label="Refresh About Data" />
      </div>

      {/* 1. FOUNDER'S VISION SUB-TAB (LUXURY SPLIT REDESIGN) */}
      {subTab === "founder" && (
        <div className="space-y-8">
          {/* Header Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-secondary text-xs uppercase tracking-[0.25em] font-bold">
                <Sparkles className="h-4 w-4 text-secondary" />
                <span>Executive Management</span>
              </div>
              <h3 className="font-display text-2xl text-ink font-bold mt-1">Founder's Address &amp; Vision</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Customize the luxury dark card displayed on the public <span className="text-primary font-semibold">/about</span> page. Changes reflect live below.
              </p>
            </div>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => saveAbout(aboutData)}
              className="btn-luxe gradient-royal text-primary-foreground text-xs py-2.5 px-6 shadow-luxe flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 text-secondary" />
                  <span>Save Founder Section</span>
                </>
              )}
            </button>
          </div>

          {/* Form & Live Real-Time Preview Grid */}
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Column: Form Controls */}
            <div className="lg:col-span-6 space-y-6 glass-card rounded-3xl p-6 sm:p-7 border border-border">
              <div className="border-b border-border/60 pb-3">
                <h4 className="font-display text-base font-bold text-ink flex items-center gap-2">
                  <span>Founder Information &amp; Photo</span>
                </h4>
                <p className="text-[0.68rem] text-muted-foreground mt-0.5">
                  Upload founder portrait and customize key titles and badges.
                </p>
              </div>

              {/* Founder Photo Uploader */}
              <ImageUploadField
                label="Founder Portrait Photo"
                description="Upload a high-resolution portrait from your device or paste a URL."
                value={aboutData.founderAddress?.image || ""}
                onChange={(url) =>
                  setAboutData({
                    ...aboutData,
                    founderAddress: { ...aboutData.founderAddress, image: url },
                  })
                }
              />

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Founder Full Name</label>
                  <input
                    type="text"
                    value={aboutData.founderAddress?.name || ""}
                    onChange={(e) =>
                      setAboutData({
                        ...aboutData,
                        founderAddress: { ...aboutData.founderAddress, name: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-medium focus:border-secondary focus:outline-none"
                    placeholder="Mr. Ashish Wankhede"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Founder Role / Title</label>
                  <input
                    type="text"
                    value={aboutData.founderAddress?.role || ""}
                    onChange={(e) =>
                      setAboutData({
                        ...aboutData,
                        founderAddress: { ...aboutData.founderAddress, role: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs focus:border-secondary focus:outline-none"
                    placeholder="Founder & Managing Director"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={aboutData.founderAddress?.badge || ""}
                    onChange={(e) =>
                      setAboutData({
                        ...aboutData,
                        founderAddress: { ...aboutData.founderAddress, badge: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs focus:border-secondary focus:outline-none uppercase font-semibold"
                    placeholder="FOUNDER'S VISION"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Eyebrow Heading</label>
                  <input
                    type="text"
                    value={aboutData.founderAddress?.eyebrow || ""}
                    onChange={(e) =>
                      setAboutData({
                        ...aboutData,
                        founderAddress: { ...aboutData.founderAddress, eyebrow: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs focus:border-secondary focus:outline-none uppercase font-semibold"
                    placeholder="FOUNDER'S ADDRESS"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="font-semibold text-foreground block mb-1">
                  Highlight Quote Headline
                </label>
                <textarea
                  rows={2}
                  value={aboutData.founderAddress?.quote || ""}
                  onChange={(e) =>
                    setAboutData({
                      ...aboutData,
                      founderAddress: { ...aboutData.founderAddress, quote: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-medium leading-relaxed focus:border-secondary focus:outline-none"
                  placeholder="We don't just decorate halls; we architect emotional memories that outlast generations."
                />
              </div>

              <div className="text-xs">
                <label className="font-semibold text-foreground block mb-1">
                  Founder Address / Message Narrative (Separate paragraphs by blank line)
                </label>
                <textarea
                  rows={6}
                  value={aboutData.founderAddress?.story || ""}
                  onChange={(e) =>
                    setAboutData({
                      ...aboutData,
                      founderAddress: { ...aboutData.founderAddress, story: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs leading-relaxed focus:border-secondary focus:outline-none font-sans"
                  placeholder="Enter full founder vision and journey story here..."
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-border/60">
                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    Signature Sign-off Name
                  </label>
                  <input
                    type="text"
                    value={aboutData.founderAddress?.signatureName || ""}
                    onChange={(e) =>
                      setAboutData({
                        ...aboutData,
                        founderAddress: { ...aboutData.founderAddress, signatureName: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs focus:border-secondary focus:outline-none"
                    placeholder="Mr. Ashish Wankhede"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    Signature Sign-off Title
                  </label>
                  <input
                    type="text"
                    value={aboutData.founderAddress?.signatureTitle || ""}
                    onChange={(e) =>
                      setAboutData({
                        ...aboutData,
                        founderAddress: { ...aboutData.founderAddress, signatureTitle: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs focus:border-secondary focus:outline-none"
                    placeholder="Founder & Principal Director, Confianza Events"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => saveAbout(aboutData)}
                  className="btn-luxe gradient-royal w-full text-primary-foreground text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                      <span>Saving Changes to Database...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 text-secondary" />
                      <span>Save Founder Changes to Database</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Real-Time Live Royal Preview Card */}
            <div className="lg:col-span-6 space-y-3 sticky top-6">
              <div className="flex items-center justify-between px-2">
                <span className="text-[0.68rem] uppercase tracking-[0.25em] text-primary font-bold flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-secondary" /> Live About Page Preview
                </span>
                <span className="text-[0.62rem] text-muted-foreground font-mono">
                  Exact Frontend Replica (Smooth Cloud Luxe)
                </span>
              </div>

              {/* Exact replica of the FounderFeatureSection smooth cloud card */}
              <div className="bg-gradient-to-br from-white/95 via-card/90 to-accent/20 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-secondary/30 shadow-2xl relative overflow-hidden text-foreground space-y-5 ring-1 ring-secondary/15">
                {/* Background glow effects */}
                <div className="absolute top-0 right-0 w-60 h-60 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-5">
                  {/* Photo Card Preview */}
                  <div className="relative rounded-2xl overflow-hidden h-64 sm:h-72 border-2 border-secondary/30 shadow-md bg-card ring-2 ring-secondary/10">
                    <img
                      src={aboutData.founderAddress?.image || "/images/couple.jpg"}
                      alt={aboutData.founderAddress?.name || "Founder"}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/couple.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-flex items-center gap-1 rounded-full gradient-gold text-ink font-bold text-[0.62rem] tracking-wider uppercase px-2.5 py-0.5 shadow-sm">
                        <Sparkles className="h-2.5 w-2.5" />
                        {aboutData.founderAddress?.badge || "FOUNDER'S VISION"}
                      </span>
                      <h4 className="font-display text-lg text-white font-bold mt-1.5">
                        {aboutData.founderAddress?.name || "Mr. Ashish Wankhede"}
                      </h4>
                      <p className="text-[0.7rem] text-secondary font-semibold tracking-wide">
                        {aboutData.founderAddress?.role || "Founder & Managing Director"}
                      </p>
                    </div>
                  </div>

                  {/* Prose Preview */}
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 text-primary font-bold text-[0.65rem] uppercase tracking-[0.25em] bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                      <Quote className="h-3 w-3 text-secondary rotate-180" />
                      <span>{aboutData.founderAddress?.eyebrow || "FOUNDER'S ADDRESS"}</span>
                    </div>

                    <h3 className="font-display text-lg sm:text-xl text-ink font-normal leading-snug tracking-tight">
                      "{aboutData.founderAddress?.quote || "We don't just decorate halls; we architect emotional memories that outlast generations."}"
                    </h3>

                    <div className="rule-gold" />

                    <div className="space-y-2 text-[0.75rem] text-foreground/80 leading-relaxed font-normal max-h-48 overflow-y-auto pr-1">
                      {(aboutData.founderAddress?.story || "")
                        .split("\n\n")
                        .filter(Boolean)
                        .map((p, idx) => (
                          <p key={idx}>{p}</p>
                        ))}
                    </div>

                    {/* Signature Preview */}
                    <div className="pt-3 border-t border-border/80 flex items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 rounded-full gradient-royal text-primary-foreground place-items-center font-display text-xs font-bold shadow-sm ring-1 ring-secondary/40">
                        <Feather className="h-4 w-4 text-secondary" />
                      </div>
                      <div>
                        <h5 className="font-display text-sm font-bold text-ink">
                          {aboutData.founderAddress?.signatureName || aboutData.founderAddress?.name || "Mr. Ashish Wankhede"}
                        </h5>
                        <p className="text-[0.62rem] uppercase tracking-wider text-secondary font-semibold">
                          {aboutData.founderAddress?.signatureTitle || "Founder & Principal Director, Confianza Events"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TEAM MEMBERS SUB-TAB (FULL CRUD) */}
      {subTab === "team" && (
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-border/60">
              <div>
                <h3 className="font-display text-xl text-ink">Meet Our Visionaries &amp; Coordinators</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage team profiles rendered on Homepage and About page. Clicking any card on the frontend opens the luxury detail popup.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingMember({
                    isNew: true,
                    name: "",
                    role: "Luxury Event Designer",
                    image: "",
                    email: "contact@confianzaevents.com",
                    specialties: ["Luxury Decor", "Floral Styling", "Hospitality"],
                    experience: "5+ Years",
                    bio: "",
                  })
                }
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4"
              >
                <Plus className="h-4 w-4" />
                <span>Add Team Member</span>
              </button>
            </div>

            {teamMembers.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground rounded-2xl bg-card/40 border border-dashed border-border">
                <Users className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                <p className="font-display text-base text-ink font-semibold">No Team Members Added</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click the button above to add visionaries and coordinators.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {teamMembers.map((person, idx) => (
                  <div
                    key={person.id || person._id || idx}
                    className="glass-card rounded-2xl p-4 border border-border/80 flex flex-col justify-between hover:shadow-md transition"
                  >
                    <div>
                      <div className="relative h-44 w-full rounded-xl overflow-hidden bg-ink mb-3 border border-border">
                        <img
                          src={person.image || "/images/couple.jpg"}
                          alt={person.name}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute bottom-2 left-2 rounded-full gradient-gold text-ink text-[0.65rem] font-bold px-2.5 py-0.5 shadow-sm">
                          {person.role}
                        </span>
                      </div>

                      <h4 className="font-display text-base font-bold text-ink">{person.name}</h4>
                      <p className="text-xs text-primary font-medium mt-0.5">{person.email}</p>
                      <p className="text-[0.68rem] text-muted-foreground mt-0.5">
                        Experience: {person.experience || "5+ Years"}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {(person.specialties || []).map((s, sIdx) => (
                          <span
                            key={sIdx}
                            className="rounded-full bg-accent text-[0.65rem] px-2 py-0.5 text-muted-foreground"
                          >
                            ✦ {s}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 mt-2 font-light">
                        {person.bio}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingMember({
                            ...person,
                            specialtiesText: Array.isArray(person.specialties)
                              ? person.specialties.join(", ")
                              : "",
                          })
                        }
                        className="p-1.5 rounded-lg border border-border hover:bg-muted text-xs flex items-center gap-1 text-primary"
                        title="Edit Member"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete ${person.name} from team?`)) {
                            const updated = teamMembers.filter((_, i) => i !== idx);
                            saveTeam(updated);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-destructive text-xs flex items-center gap-1"
                        title="Delete Member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Member Add/Edit Modal */}
          {editingMember && (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/80 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const specsArray = typeof editingMember.specialtiesText === "string"
                    ? editingMember.specialtiesText.split(",").map((s) => s.trim()).filter(Boolean)
                    : editingMember.specialties || [];

                  const cleanMember = {
                    ...editingMember,
                    id: editingMember.id || Date.now(),
                    specialties: specsArray,
                  };
                  delete cleanMember.specialtiesText;
                  delete cleanMember.isNew;

                  let updated;
                  if (editingMember.isNew) {
                    updated = [...teamMembers, cleanMember];
                  } else {
                    updated = teamMembers.map((m) =>
                      (m.id && m.id === editingMember.id) || (m._id && m._id === editingMember._id)
                        ? cleanMember
                        : m
                    );
                  }
                  saveTeam(updated);
                  setEditingMember(null);
                }}
                className="glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 space-y-4"
              >
                <div className="flex justify-between items-center border-b pb-3">
                  <h4 className="font-display text-lg text-ink font-bold">
                    {editingMember.isNew ? "Add Team Member" : "Edit Team Member"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <ImageUploadField
                  label="Profile Photo"
                  value={editingMember.image || ""}
                  onChange={(url) => setEditingMember({ ...editingMember, image: url })}
                />

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editingMember.name || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                      className="w-full rounded-xl border border-border bg-card px-3 py-2"
                      placeholder="e.g. Radhika Deshmukh"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-foreground block mb-1">Designation / Role</label>
                    <input
                      type="text"
                      required
                      value={editingMember.role || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                      className="w-full rounded-xl border border-border bg-card px-3 py-2"
                      placeholder="e.g. Lead Floral Architect"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Official Email</label>
                    <input
                      type="email"
                      required
                      value={editingMember.email || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                      className="w-full rounded-xl border border-border bg-card px-3 py-2"
                      placeholder="name@confianzaevents.com"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-foreground block mb-1">Experience</label>
                    <input
                      type="text"
                      value={editingMember.experience || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, experience: e.target.value })}
                      className="w-full rounded-xl border border-border bg-card px-3 py-2"
                      placeholder="e.g. 6+ Years"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="font-semibold text-foreground block mb-1">
                    Specialties &amp; Domain (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={
                      editingMember.specialtiesText !== undefined
                        ? editingMember.specialtiesText
                        : Array.isArray(editingMember.specialties)
                        ? editingMember.specialties.join(", ")
                        : ""
                    }
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, specialtiesText: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-card px-3 py-2"
                    placeholder="Luxury Decor, Spatial Design, Guest Concierge"
                  />
                </div>

                <div className="text-xs">
                  <label className="font-semibold text-foreground block mb-1">Bio / Profile Description</label>
                  <textarea
                    rows={3}
                    value={editingMember.bio || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2"
                    placeholder="Describe their role and mastery in wedding coordination..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="px-4 py-2 rounded-full border text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5"
                  >
                    Save Member Profile
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 3. VISION & MISSION SUB-TAB */}
      {subTab === "vision-mission" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveAbout(aboutData);
          }}
          className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="font-display text-xl text-ink">Vision &amp; Mission Statements</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage high-level guiding principles and bullet commitments shown on /about.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5 flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 text-secondary" />
                  <span>Save Vision &amp; Mission</span>
                </>
              )}
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 text-xs">
            {/* Vision Column */}
            <div className="space-y-4 rounded-2xl bg-card/60 p-5 border border-border">
              <h4 className="font-display text-base font-bold text-ink flex items-center gap-2">
                <span>Our Vision</span>
              </h4>

              <div>
                <label className="font-semibold text-foreground block mb-1">Vision Statement</label>
                <textarea
                  rows={3}
                  value={aboutData.vision || ""}
                  onChange={(e) => setAboutData({ ...aboutData, vision: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs leading-relaxed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-foreground">Vision Objectives / Pillars</label>
                  <button
                    type="button"
                    onClick={() =>
                      setAboutData({
                        ...aboutData,
                        visionPillars: [...(aboutData.visionPillars || []), "New Vision Pillar"],
                      })
                    }
                    className="text-[0.7rem] text-primary font-bold hover:underline"
                  >
                    + Add Pillar
                  </button>
                </div>

                <div className="space-y-2">
                  {(aboutData.visionPillars || []).map((pillar, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={pillar}
                        onChange={(e) => {
                          const updated = [...aboutData.visionPillars];
                          updated[pIdx] = e.target.value;
                          setAboutData({ ...aboutData, visionPillars: updated });
                        }}
                        className="flex-1 rounded-xl border border-border bg-card px-3 py-1.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = aboutData.visionPillars.filter((_, i) => i !== pIdx);
                          setAboutData({ ...aboutData, visionPillars: updated });
                        }}
                        className="text-destructive p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mission Column */}
            <div className="space-y-4 rounded-2xl bg-card/60 p-5 border border-border">
              <h4 className="font-display text-base font-bold text-ink flex items-center gap-2">
                <span>Our Mission</span>
              </h4>

              <div>
                <label className="font-semibold text-foreground block mb-1">Mission Statement</label>
                <textarea
                  rows={3}
                  value={aboutData.mission || ""}
                  onChange={(e) => setAboutData({ ...aboutData, mission: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs leading-relaxed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-semibold text-foreground">Mission Commitments</label>
                  <button
                    type="button"
                    onClick={() =>
                      setAboutData({
                        ...aboutData,
                        missionCommitments: [...(aboutData.missionCommitments || []), "New Mission Commitment"],
                      })
                    }
                    className="text-[0.7rem] text-primary font-bold hover:underline"
                  >
                    + Add Commitment
                  </button>
                </div>

                <div className="space-y-2">
                  {(aboutData.missionCommitments || []).map((com, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={com}
                        onChange={(e) => {
                          const updated = [...aboutData.missionCommitments];
                          updated[cIdx] = e.target.value;
                          setAboutData({ ...aboutData, missionCommitments: updated });
                        }}
                        className="flex-1 rounded-xl border border-border bg-card px-3 py-1.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = aboutData.missionCommitments.filter((_, i) => i !== cIdx);
                          setAboutData({ ...aboutData, missionCommitments: updated });
                        }}
                        className="text-destructive p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* 4. CORE VALUES SUB-TAB (FULL CRUD) */}
      {subTab === "core-values" && (
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-border/60">
              <div>
                <h3 className="font-display text-xl text-ink">Our Core Values ({aboutData.coreValues?.length || 0})</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Five foundational principles highlighting trust, artistry, precision, empathy, and sustainability.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingValue({
                    isNew: true,
                    icon: "ShieldCheck",
                    title: "",
                    subtitle: "",
                    text: "",
                    gradient: "from-secondary to-amber-500",
                  })
                }
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4"
              >
                <Plus className="h-4 w-4" />
                <span>Add Core Value</span>
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(aboutData.coreValues || []).map((val, idx) => (
                <div
                  key={val.title || idx}
                  className="glass-card rounded-2xl p-5 border border-border flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[0.65rem] font-bold uppercase tracking-wider text-secondary">
                        {val.subtitle}
                      </span>
                      <span className="text-xs font-mono font-bold text-muted-foreground">0{idx + 1}</span>
                    </div>
                    <h4 className="font-display text-base font-bold text-ink">{val.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-2">{val.text}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingValue({ ...val, _idx: idx })}
                      className="p-1.5 rounded-lg border hover:bg-muted text-xs text-primary"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = aboutData.coreValues.filter((_, i) => i !== idx);
                        const next = { ...aboutData, coreValues: updated };
                        saveAbout(next);
                      }}
                      className="p-1.5 rounded-lg border text-destructive hover:bg-destructive/10 text-xs"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Value Modal */}
          {editingValue && (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/80 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  let updatedValues;
                  if (editingValue.isNew) {
                    updatedValues = [...(aboutData.coreValues || []), editingValue];
                  } else {
                    updatedValues = [...(aboutData.coreValues || [])];
                    updatedValues[editingValue._idx] = editingValue;
                  }
                  const next = { ...aboutData, coreValues: updatedValues };
                  saveAbout(next);
                  setEditingValue(null);
                }}
                className="glass-card max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-4"
              >
                <div className="flex justify-between items-center border-b pb-3">
                  <h4 className="font-display text-lg text-ink font-bold">
                    {editingValue.isNew ? "Add Core Value" : "Edit Core Value"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingValue(null)}
                    className="text-muted-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold block mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={editingValue.title || ""}
                      onChange={(e) => setEditingValue({ ...editingValue, title: e.target.value })}
                      className="w-full rounded-xl border px-3 py-2 bg-card"
                      placeholder="e.g. Uncompromised Trust (Confianza)"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Subtitle Tag</label>
                    <input
                      type="text"
                      value={editingValue.subtitle || ""}
                      onChange={(e) => setEditingValue({ ...editingValue, subtitle: e.target.value })}
                      className="w-full rounded-xl border px-3 py-2 bg-card"
                      placeholder="e.g. Absolute Honesty in Costing"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Icon Name</label>
                    <select
                      value={editingValue.icon || "ShieldCheck"}
                      onChange={(e) => setEditingValue({ ...editingValue, icon: e.target.value })}
                      className="w-full rounded-xl border px-3 py-2 bg-card text-xs"
                    >
                      <option value="ShieldCheck">ShieldCheck (Trust & Security)</option>
                      <option value="Palette">Palette (Art & Aesthetics)</option>
                      <option value="Clock">Clock (Precision & Timeliness)</option>
                      <option value="HeartHandshake">HeartHandshake (Hospitality & Care)</option>
                      <option value="Leaf">Leaf (Sustainability & Eco-decor)</option>
                      <option value="Sparkles">Sparkles (Luxury & Magic)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Detailed Description</label>
                    <textarea
                      rows={3}
                      required
                      value={editingValue.text || ""}
                      onChange={(e) => setEditingValue({ ...editingValue, text: e.target.value })}
                      className="w-full rounded-xl border px-3 py-2 bg-card"
                      placeholder="Explain how this value guides your wedding planning..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingValue(null)}
                    className="px-4 py-2 rounded-full border text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5"
                  >
                    Save Value
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 5. HOW WE WORK SUB-TAB (FULL CRUD) */}
      {subTab === "how-we-work" && (
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-border/60">
              <div>
                <h3 className="font-display text-xl text-ink">How Do We Work ({aboutData.howWeWork?.length || 0} Stages)</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  The 5-Stage Luxury Methodology roadmap on /about.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingStep({
                    isNew: true,
                    num: `0${(aboutData.howWeWork?.length || 0) + 1}`,
                    title: "",
                    timeline: "",
                    summary: "",
                    deliverablesText: "",
                  })
                }
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4"
              >
                <Plus className="h-4 w-4" />
                <span>Add Methodology Stage</span>
              </button>
            </div>

            <div className="space-y-4">
              {(aboutData.howWeWork || []).map((step, idx) => (
                <div
                  key={step.num || idx}
                  className="glass-card rounded-2xl p-5 border border-border flex flex-col sm:flex-row justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-2xl font-bold text-gold-gradient">
                        {step.num}
                      </span>
                      <div>
                        <span className="text-[0.65rem] uppercase tracking-wider text-primary font-bold block">
                          {step.timeline}
                        </span>
                        <h4 className="font-display text-base font-bold text-ink">{step.title}</h4>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed mt-2">{step.summary}</p>

                    {Array.isArray(step.deliverables) && step.deliverables.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {step.deliverables.map((d, dIdx) => (
                          <span
                            key={dIdx}
                            className="rounded-full bg-accent text-[0.65rem] px-2.5 py-0.5 text-muted-foreground"
                          >
                            ✓ {d}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex sm:flex-col justify-end items-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingStep({
                          ...step,
                          _idx: idx,
                          deliverablesText: Array.isArray(step.deliverables)
                            ? step.deliverables.join("\n")
                            : "",
                        })
                      }
                      className="p-1.5 rounded-lg border hover:bg-muted text-xs text-primary"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = aboutData.howWeWork.filter((_, i) => i !== idx);
                        const next = { ...aboutData, howWeWork: updated };
                        saveAbout(next);
                      }}
                      className="p-1.5 rounded-lg border text-destructive hover:bg-destructive/10 text-xs"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How We Work Modal */}
          {editingStep && (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/80 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const delivsArray = typeof editingStep.deliverablesText === "string"
                    ? editingStep.deliverablesText.split("\n").map((s) => s.trim()).filter(Boolean)
                    : editingStep.deliverables || [];

                  const cleanStep = {
                    ...editingStep,
                    deliverables: delivsArray,
                  };
                  delete cleanStep.deliverablesText;
                  delete cleanStep.isNew;

                  let updatedSteps;
                  if (editingStep.isNew) {
                    updatedSteps = [...(aboutData.howWeWork || []), cleanStep];
                  } else {
                    updatedSteps = [...(aboutData.howWeWork || [])];
                    updatedSteps[editingStep._idx] = cleanStep;
                  }
                  const next = { ...aboutData, howWeWork: updatedSteps };
                  saveAbout(next);
                  setEditingStep(null);
                }}
                className="glass-card max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-4"
              >
                <div className="flex justify-between items-center border-b pb-3">
                  <h4 className="font-display text-lg text-ink font-bold">
                    {editingStep.isNew ? "Add Methodology Stage" : "Edit Methodology Stage"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingStep(null)}
                    className="text-muted-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Step Number</label>
                      <input
                        type="text"
                        required
                        value={editingStep.num || ""}
                        onChange={(e) => setEditingStep({ ...editingStep, num: e.target.value })}
                        className="w-full rounded-xl border px-3 py-2 bg-card"
                        placeholder="01"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="font-semibold block mb-1">Timeline Tag</label>
                      <input
                        type="text"
                        value={editingStep.timeline || ""}
                        onChange={(e) => setEditingStep({ ...editingStep, timeline: e.target.value })}
                        className="w-full rounded-xl border px-3 py-2 bg-card"
                        placeholder="Month 1 • Foundation"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Stage Title</label>
                    <input
                      type="text"
                      required
                      value={editingStep.title || ""}
                      onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                      className="w-full rounded-xl border px-3 py-2 bg-card"
                      placeholder="e.g. Discovery & Story Session"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Summary Description</label>
                    <textarea
                      rows={3}
                      required
                      value={editingStep.summary || ""}
                      onChange={(e) => setEditingStep({ ...editingStep, summary: e.target.value })}
                      className="w-full rounded-xl border px-3 py-2 bg-card"
                      placeholder="Describe what happens in this stage..."
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Key Deliverables (one per line)</label>
                    <textarea
                      rows={3}
                      value={
                        editingStep.deliverablesText !== undefined
                          ? editingStep.deliverablesText
                          : Array.isArray(editingStep.deliverables)
                          ? editingStep.deliverables.join("\n")
                          : ""
                      }
                      onChange={(e) =>
                        setEditingStep({ ...editingStep, deliverablesText: e.target.value })
                      }
                      className="w-full rounded-xl border px-3 py-2 bg-card font-mono text-xs"
                      placeholder="Deliverable item 1&#10;Deliverable item 2"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingStep(null)}
                    className="px-4 py-2 rounded-full border text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5"
                  >
                    Save Stage
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 1. ABOUT PAGE HEADER BANNER SUB-TAB */}
      {subTab === "hero-banner" && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Editor */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveAbout(aboutData);
              }}
              className="lg:col-span-6 glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <div className="flex items-center gap-1.5 text-primary text-xs uppercase tracking-[0.25em] font-bold">
                    <Sparkles className="h-4 w-4 text-secondary" />
                    <span>Top Hero Banner</span>
                  </div>
                  <h3 className="font-display text-xl text-ink font-bold mt-1">About Page Header Banner</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Customize the top hero banner title, subtitle, badge, and cover photo on <span className="text-primary font-semibold">/about</span>.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Eyebrow Badge Pill
                </label>
                <input
                  type="text"
                  required
                  value={aboutData.headerBanner?.badge || ""}
                  onChange={(e) =>
                    setAboutData({
                      ...aboutData,
                      headerBanner: { ...aboutData.headerBanner, badge: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm"
                  placeholder="e.g. Since 2018 • Warje, Pune"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Main Page Heading / Title
                </label>
                <input
                  type="text"
                  required
                  value={aboutData.headerBanner?.title || ""}
                  onChange={(e) =>
                    setAboutData({
                      ...aboutData,
                      heading: e.target.value,
                      headerBanner: { ...aboutData.headerBanner, title: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm"
                  placeholder="e.g. Where Weddings Become Stories"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Subtitle Narrative / Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={aboutData.headerBanner?.subtitle || ""}
                  onChange={(e) =>
                    setAboutData({
                      ...aboutData,
                      story: e.target.value,
                      headerBanner: { ...aboutData.headerBanner, subtitle: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm leading-relaxed"
                  placeholder="At Confianza, we're the romantic and elegant wedding experts..."
                />
              </div>

              <ImageUploadField
                label="Header Background Image"
                value={aboutData.headerBanner?.image || "/images/hero-1.jpg"}
                onChange={(url) =>
                  setAboutData({
                    ...aboutData,
                    headerBanner: { ...aboutData.headerBanner, image: url },
                  })
                }
              />

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-luxe gradient-royal w-full text-primary-foreground text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                      <span>Saving Changes to Database...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 text-secondary" />
                      <span>Save Header Banner Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Right Column: Real-Time Live Preview Replica */}
            <div className="lg:col-span-6 space-y-3 sticky top-6">
              <div className="flex items-center justify-between px-2">
                <span className="text-[0.68rem] uppercase tracking-[0.25em] text-primary font-bold flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-secondary" /> Live /about Header Preview
                </span>
                <span className="text-[0.62rem] text-muted-foreground font-mono">
                  Exact Frontend Replica
                </span>
              </div>

              {/* Exact replica of About Hero Header Banner */}
              <div className="relative bg-ink rounded-3xl p-8 sm:p-10 text-background overflow-hidden border border-secondary/30 shadow-2xl text-center">
                <div className="absolute inset-0 z-0 opacity-25">
                  <img
                    src={aboutData.headerBanner?.image || "/images/hero-1.jpg"}
                    alt="Confianza wedding heritage"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/50" />
                </div>

                <div className="relative z-10 space-y-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3.5 py-1 text-[0.68rem] uppercase tracking-[0.3em] text-secondary font-medium backdrop-blur-md">
                    <Sparkles className="h-3 w-3 text-secondary" />
                    <span>{aboutData.headerBanner?.badge || "Since 2018 • Warje, Pune"}</span>
                  </span>

                  <h1 className="font-display text-2xl sm:text-3xl text-white font-normal leading-tight">
                    {aboutData.headerBanner?.title || "Where Weddings Become Stories"}
                  </h1>

                  <div className="rule-gold mx-auto my-3" />

                  <p className="mx-auto max-w-lg text-xs sm:text-sm text-background/80 font-light leading-relaxed">
                    {aboutData.headerBanner?.subtitle ||
                      "At Confianza, we're the romantic and elegant wedding experts who bring love stories to life with passion and precision. For us, your event is no less than our own."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 6: Services & Packages Editor (6 Sub-Tabs)
// -------------------------------------------------------------
function ServicesEditorModule({ site, showSaved }) {
  const [subTab, setSubTab] = useState("services"); // "services" | "categories" | "packages" | "ceremonies" | "stationery" | "cta"

  // 1. Services State
  const [services, setServices] = useState(site.services || []);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    setServices(site.services || []);
  }, [site.services]);

  const saveServiceList = (newList) => {
    setServices(newList);
    site.update("services", newList);
    showSaved();
  };

  const deleteService = (id) => {
    saveServiceList(services.filter((s) => s.id !== id && s._id !== id));
  };

  const saveServiceModal = (e) => {
    e.preventDefault();
    const parsedFeatures = Array.isArray(editingService.features)
      ? editingService.features
      : typeof editingService.features === "string"
      ? editingService.features
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean)
      : [];

    const serviceData = {
      ...editingService,
      category: editingService.category || "planning",
      badge: editingService.badge?.trim() || "Specialized Craft",
      features: parsedFeatures,
    };

    if (editingService.isNew) {
      const newService = {
        ...serviceData,
        id: `service-${Date.now()}`,
        isNew: undefined,
      };
      saveServiceList([...services, newService]);
    } else {
      saveServiceList(
        services.map((s) =>
          (s.id === editingService.id || (s._id && s._id === editingService._id))
            ? serviceData
            : s
        )
      );
    }
    setEditingService(null);
  };

  // 2. Categories State
  const [categories, setCategories] = useState(
    site.serviceCategories && site.serviceCategories.length > 0
      ? site.serviceCategories
      : [
          { id: "planning", label: "Signature Planning & Direction" },
          { id: "decor", label: "Mandap & Spatial Decor" },
          { id: "hospitality", label: "Royal Hospitality & Shadows" },
          { id: "rituals", label: "Rituals, Artists & F&B" },
        ]
  );
  const [editingCat, setEditingCat] = useState(null);

  useEffect(() => {
    if (site.serviceCategories && site.serviceCategories.length > 0) {
      setCategories(site.serviceCategories);
    }
  }, [site.serviceCategories]);

  const saveCategoryList = (newList) => {
    setCategories(newList);
    site.update("serviceCategories", newList);
    showSaved();
  };

  const deleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      saveCategoryList(categories.filter((c) => c.id !== id));
    }
  };

  const saveCategoryModal = (e) => {
    e.preventDefault();
    const cleanLabel = (editingCat.label || "").trim();
    const autoSlug = cleanLabel
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const slug = editingCat.id || autoSlug || `cat-${Date.now()}`;

    const catData = {
      id: slug,
      label: cleanLabel,
    };

    if (editingCat.isNew) {
      saveCategoryList([...categories, catData]);
    } else {
      saveCategoryList(
        categories.map((c) => (c.id === editingCat.id ? catData : c))
      );
    }
    setEditingCat(null);
  };

  // 3. Packages State
  const [packages, setPackages] = useState(site.packages || []);
  const [editingPkg, setEditingPkg] = useState(null);

  useEffect(() => {
    setPackages(site.packages || []);
  }, [site.packages]);

  const savePackagesList = (newPkgs) => {
    setPackages(newPkgs);
    site.update("packages", newPkgs);
    showSaved();
  };

  const deletePackage = (id) => {
    savePackagesList(packages.filter((p) => p.id !== id && p._id !== id));
  };

  const handleSavePkgModal = (e) => {
    e.preventDefault();
    const parsedFeatures = Array.isArray(editingPkg.features)
      ? editingPkg.features
      : typeof editingPkg.features === "string"
      ? editingPkg.features.split("\n").map((f) => f.trim()).filter(Boolean)
      : [];

    const pkgData = {
      ...editingPkg,
      features: parsedFeatures,
    };

    if (editingPkg.isNew) {
      const newPkg = {
        ...pkgData,
        id: `pkg-${Date.now()}`,
        isNew: undefined,
      };
      savePackagesList([...packages, newPkg]);
    } else {
      savePackagesList(
        packages.map((p) =>
          (p.id === editingPkg.id || (p._id && p._id === editingPkg._id))
            ? pkgData
            : p
        )
      );
    }
    setEditingPkg(null);
  };

  // 4. Ceremonies Matrix State
  const [ceremonies, setCeremonies] = useState(site.ceremonies || []);
  const [editingCeremony, setEditingCeremony] = useState(null);

  useEffect(() => {
    setCeremonies(site.ceremonies || []);
  }, [site.ceremonies]);

  const saveCeremoniesList = (newList) => {
    setCeremonies(newList);
    site.update("ceremonies", newList);
    showSaved();
  };

  const deleteCeremony = (id) => {
    saveCeremoniesList(ceremonies.filter((c) => c.id !== id && c._id !== id));
  };

  const saveCeremonyModal = (e) => {
    e.preventDefault();
    const parsedHighlights = Array.isArray(editingCeremony.highlights)
      ? editingCeremony.highlights
      : typeof editingCeremony.highlights === "string"
      ? editingCeremony.highlights
          .split("\n")
          .map((h) => h.trim())
          .filter(Boolean)
      : [];

    const ceremonyData = {
      ...editingCeremony,
      theme: editingCeremony.theme?.trim() || "Confianza Signature",
      highlights: parsedHighlights,
    };

    if (editingCeremony.isNew) {
      const newCeremony = {
        ...ceremonyData,
        id: `ceremony-${Date.now()}`,
        isNew: undefined,
      };
      saveCeremoniesList([...ceremonies, newCeremony]);
    } else {
      saveCeremoniesList(
        ceremonies.map((c) =>
          (c.id === editingCeremony.id || (c._id && c._id === editingCeremony._id))
            ? ceremonyData
            : c
        )
      );
    }
    setEditingCeremony(null);
  };

  // 5. Stationery Suite State
  const [stationery, setStationery] = useState(site.stationery || []);
  const [editingStationery, setEditingStationery] = useState(null);

  useEffect(() => {
    setStationery(site.stationery || []);
  }, [site.stationery]);

  const saveStationeryList = (newList) => {
    setStationery(newList);
    site.update("stationery", newList);
    showSaved();
  };

  const deleteStationery = (id) => {
    saveStationeryList(stationery.filter((s) => s.id !== id && s._id !== id));
  };

  const saveStationeryModal = (e) => {
    e.preventDefault();
    const itemData = {
      ...editingStationery,
      badge: editingStationery.badge?.trim() || "Event Branding",
    };

    if (editingStationery.isNew) {
      const newItem = {
        ...itemData,
        id: `stat-${Date.now()}`,
        isNew: undefined,
      };
      saveStationeryList([...stationery, newItem]);
    } else {
      saveStationeryList(
        stationery.map((s) =>
          (s.id === editingStationery.id || (s._id && s._id === editingStationery._id))
            ? itemData
            : s
        )
      );
    }
    setEditingStationery(null);
  };

  // 6. Consultation CTA State
  const defaultCta = {
    eyebrow: "WHERE WEDDINGS BECOME STORIES",
    headline: "Ready to Begin Curating Your Wedding?",
    subtitle:
      "Book a private 60–90 minute consultation with Ashish Wankhede in Warje, Pune, or via virtual video call.",
    buttonText: "Book Your Free Consultation",
    buttonLink: "/contact",
    notice: "Free Consultation • No Commitment Required",
    perks: [
      "60–90 Min Vision Mapping",
      "In-Person (Pune) or Virtual Call",
      "Detailed Budget Allocations",
      "3D Spatial Concept Previews",
    ],
  };

  const [ctaForm, setCtaForm] = useState({
    ...defaultCta,
    ...(site.servicesCta || {}),
    perks: Array.isArray(site.servicesCta?.perks)
      ? site.servicesCta.perks.join("\n")
      : defaultCta.perks.join("\n"),
  });

  useEffect(() => {
    if (site.servicesCta) {
      setCtaForm({
        ...defaultCta,
        ...site.servicesCta,
        perks: Array.isArray(site.servicesCta.perks)
          ? site.servicesCta.perks.join("\n")
          : typeof site.servicesCta.perks === "string"
          ? site.servicesCta.perks
          : defaultCta.perks.join("\n"),
      });
    }
  }, [site.servicesCta]);

  const saveCtaSettings = (e) => {
    e.preventDefault();
    const parsedPerks = typeof ctaForm.perks === "string"
      ? ctaForm.perks.split("\n").map((p) => p.trim()).filter(Boolean)
      : ctaForm.perks || [];

    const updatedCta = {
      ...ctaForm,
      perks: parsedPerks,
    };
    site.update("servicesCta", updatedCta);
    showSaved();
  };

  return (
    <div className="space-y-6">
      {/* Header & 6 Sub-Tab Navigation Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="font-display text-2xl text-ink">Services &amp; Packages Manager</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Full dynamic CRUD control over Disciplines, Categories, Packages, Ceremonies, Stationery, and Consultation CTA.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <ModuleRefreshButton site={site} showSaved={showSaved} label="Refresh Services" />
          {/* 6 Sub-Tab Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-card border border-border shadow-xs">
          {[
            { id: "services", label: `Services (${services.length})`, icon: Briefcase },
            { id: "categories", label: `Categories (${categories.length})`, icon: Layers },
            { id: "packages", label: `Packages (${packages.length})`, icon: DollarSign },
            { id: "ceremonies", label: `Ceremonies (${ceremonies.length})`, icon: Sparkles },
            { id: "stationery", label: `Stationery (${stationery.length})`, icon: Feather },
            { id: "cta", label: "Consultation CTA", icon: PhoneCall },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? "gradient-royal text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 1: SERVICES CATALOG */}
      {/* ------------------------------------------------------------- */}
      {subTab === "services" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-display text-lg text-ink">Services Catalog ({services.length})</h4>
              <p className="text-xs text-muted-foreground">
                Disciplines rendered under "Designed for Every Step of the Journey".
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setEditingService({
                  isNew: true,
                  title: "",
                  category: categories[0]?.id || "planning",
                  badge: "Specialized Craft",
                  description: "",
                  features: "",
                  image: "",
                })
              }
              className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Service</span>
            </button>
          </div>

          {services.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center text-muted-foreground border border-border">
              <Briefcase className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <h4 className="font-display text-lg text-ink font-semibold">0 Services in Catalog</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Click "Add New Service" above to add your first wedding planning discipline.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <div
                  key={s.id || s._id}
                  className="glass-card rounded-2xl p-4 border border-border flex flex-col justify-between"
                >
                  <div>
                    <div className="flex gap-3">
                      {s.image ? (
                        <img
                          src={s.image}
                          alt={s.title}
                          className="h-16 w-16 rounded-xl object-cover shrink-0"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-xl gradient-royal flex items-center justify-center text-primary-foreground shrink-0">
                          <Sparkles className="h-6 w-6 text-secondary" />
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="inline-block text-[0.62rem] font-semibold text-primary uppercase tracking-wider">
                            {s.badge || "Specialized Craft"}
                          </span>
                          {s.category && (
                            <span className="text-[0.6rem] px-1.5 py-0.2 rounded-md bg-secondary/15 text-secondary font-mono">
                              {categories.find((c) => c.id === s.category)?.label || s.category}
                            </span>
                          )}
                        </div>
                        <h4 className="font-display text-base font-semibold text-ink truncate">{s.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {s.description}
                        </p>
                      </div>
                    </div>

                    {Array.isArray(s.features) && s.features.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-border/50 space-y-1">
                        <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground block">
                          Included Highlights ({s.features.length}):
                        </span>
                        <ul className="space-y-1 text-xs text-foreground/80">
                          {s.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-center gap-1.5 truncate">
                              <CheckCircle className="h-3 w-3 text-secondary shrink-0" />
                              <span className="truncate">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingService({
                          ...s,
                          features: Array.isArray(s.features) ? s.features.join("\n") : (s.features || ""),
                        })
                      }
                      className="p-1.5 rounded-lg border border-border hover:bg-muted text-xs cursor-pointer"
                      title="Edit Service"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteService(s.id || s._id)}
                      className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-destructive text-xs cursor-pointer"
                      title="Delete Service"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {editingService && (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/80 p-4">
              <form
                onSubmit={saveServiceModal}
                className="glass-card max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto"
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
                    placeholder="e.g., Full-Service Luxury Wedding Planning"
                    value={editingService.title}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium block mb-1">Filter Category</label>
                    <select
                      value={editingService.category || categories[0]?.id || "planning"}
                      onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                      className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium block mb-1">Badge Tag</label>
                    <input
                      type="text"
                      placeholder="e.g., Specialized Craft, VIP Concierge"
                      value={editingService.badge || ""}
                      onChange={(e) => setEditingService({ ...editingService, badge: e.target.value })}
                      className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium block mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Detailed description of the discipline..."
                    value={editingService.description}
                    onChange={(e) =>
                      setEditingService({ ...editingService, description: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium block mb-1">
                    Features &amp; Deliverables (One per line)
                  </label>
                  <textarea
                    rows={4}
                    placeholder={"Dedicated on-site coordinator\nCustom 3D visual preview\nTransparent vendor sheets"}
                    value={editingService.features || ""}
                    onChange={(e) =>
                      setEditingService({ ...editingService, features: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-mono text-xs"
                  />
                  <span className="text-[0.68rem] text-muted-foreground mt-1 block">
                    Enter each highlight bullet on a new line. These will render with golden checkmarks on the Services card.
                  </span>
                </div>

                <ImageUploadField
                  label="Service Cover Photo"
                  value={editingService.image || ""}
                  onChange={(url) => setEditingService({ ...editingService, image: url })}
                />

                <div className="flex justify-end gap-2 pt-2 border-t">
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
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 2: DYNAMIC CATEGORIES MANAGER */}
      {/* ------------------------------------------------------------- */}
      {subTab === "categories" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-display text-lg text-ink">Service Filter Categories ({categories.length})</h4>
              <p className="text-xs text-muted-foreground">
                Manage the dynamic category filter pills rendered on the public `/services` page.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setEditingCat({
                  isNew: true,
                  id: "",
                  label: "",
                })
              }
              className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Category</span>
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const count = services.filter((s) => s.category === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className="glass-card rounded-2xl p-4 border border-border flex items-center justify-between"
                >
                  <div>
                    <h5 className="font-display text-base font-semibold text-ink">{cat.label}</h5>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[0.68rem] px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                        {count} {count === 1 ? "Service" : "Services"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingCat({ ...cat })}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted text-xs cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-destructive text-xs cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {editingCat && (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/80 p-4">
              <form
                onSubmit={saveCategoryModal}
                className="glass-card max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-4"
              >
                <div className="flex justify-between items-center border-b pb-3">
                  <h4 className="font-display text-lg text-ink">
                    {editingCat.isNew ? "Add Filter Category" : "Edit Filter Category"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingCat(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-medium block mb-1">Category Label</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Signature Planning & Direction"
                    value={editingCat.label}
                    onChange={(e) => setEditingCat({ ...editingCat, label: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm"
                  />
                  <p className="text-[0.68rem] text-muted-foreground mt-1.5">
                    Filter pills on the public <span className="font-semibold text-primary">/services</span> page will update immediately.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingCat(null)}
                    className="px-4 py-2 rounded-full border text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 3: PLANNING PACKAGES & PRICING */}
      {/* ------------------------------------------------------------- */}
      {subTab === "packages" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-display text-lg text-ink">Packages &amp; Pricing Tiers ({packages.length})</h4>
              <p className="text-xs text-muted-foreground">
                Tiers rendered under "Tailored Wedding Planning Packages".
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setEditingPkg({
                  isNew: true,
                  name: "",
                  price: "₹",
                  tag: "Bespoke Tier",
                  features: "Dedicated Wedding Coordinator\nCustom Mood Boards\nVendor Management",
                  featured: false,
                })
              }
              className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Package</span>
            </button>
          </div>

          {packages.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center text-muted-foreground border border-border">
              <DollarSign className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <h4 className="font-display text-lg text-ink font-semibold">0 Packages Configured</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Click "Add New Package" above to create your first wedding planning package.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3 items-stretch">
              {packages.map((pkg) => (
                <div
                  key={pkg.id || pkg._id}
                  className={`relative rounded-3xl p-6 flex flex-col justify-between border transition-all duration-300 ${
                    pkg.featured
                      ? "gradient-royal text-primary-foreground shadow-luxe ring-2 ring-secondary/70"
                      : "glass-card text-foreground border-border shadow-soft"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span
                        className={`text-[0.65rem] font-bold uppercase tracking-widest ${
                          pkg.featured ? "text-champagne" : "text-primary"
                        }`}
                      >
                        {pkg.tag || "Wedding Tier"}
                      </span>
                      {pkg.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full gradient-gold px-2.5 py-0.5 text-[0.62rem] font-bold uppercase text-ink shadow-sm">
                          <Sparkles className="h-3 w-3" />
                          Featured
                        </span>
                      )}
                    </div>

                    <h4
                      className={`font-display text-2xl font-bold mt-2 ${
                        pkg.featured ? "text-background" : "text-ink"
                      }`}
                    >
                      {pkg.name}
                    </h4>

                    <div className="mt-3 flex items-baseline gap-2">
                      <span
                        className={`font-display text-2xl font-bold ${
                          pkg.featured ? "text-secondary" : "text-primary"
                        }`}
                      >
                        {pkg.price}
                      </span>
                      <span
                        className={`text-xs ${
                          pkg.featured ? "text-background/70" : "text-muted-foreground"
                        }`}
                      >
                        / starting package
                      </span>
                    </div>

                    <div
                      className={`my-4 h-px w-full ${
                        pkg.featured ? "bg-white/20" : "bg-border"
                      }`}
                    />

                    <ul className="space-y-2 text-xs">
                      {(pkg.features || []).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <CheckCircle className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${pkg.featured ? "text-secondary" : "text-primary"}`} />
                          <span className={pkg.featured ? "text-background/90" : "text-foreground/80"}>
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-3 border-t border-border/50 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingPkg({
                          ...pkg,
                          features: Array.isArray(pkg.features) ? pkg.features.join("\n") : pkg.features || "",
                        })
                      }
                      className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                        pkg.featured ? "border-white/30 hover:bg-white/10" : "border-border hover:bg-muted"
                      }`}
                      title="Edit Package"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePackage(pkg.id || pkg._id)}
                      className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                        pkg.featured
                          ? "border-red-400/40 text-red-300 hover:bg-red-500/20"
                          : "border-border text-destructive hover:bg-destructive/10"
                      }`}
                      title="Delete Package"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {editingPkg && (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/80 p-4">
              <form
                onSubmit={handleSavePkgModal}
                className="glass-card max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center border-b pb-3">
                  <h4 className="font-display text-lg text-ink">
                    {editingPkg.isNew ? "Add New Package Tier" : "Edit Package Tier"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingPkg(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">Tier Name</label>
                  <input
                    type="text"
                    required
                    value={editingPkg.name || ""}
                    onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                    placeholder="e.g. The Royal Heritage Experience"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1">Starting Price</label>
                    <input
                      type="text"
                      required
                      value={editingPkg.price || ""}
                      onChange={(e) => setEditingPkg({ ...editingPkg, price: e.target.value })}
                      className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                      placeholder="e.g. ₹5,50,000"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold block mb-1">Badge / Tag</label>
                    <input
                      type="text"
                      value={editingPkg.tag || ""}
                      onChange={(e) => setEditingPkg({ ...editingPkg, tag: e.target.value })}
                      className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                      placeholder="e.g. Full-Service Luxury"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">
                    Included Features (one per line)
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={editingPkg.features || ""}
                    onChange={(e) => setEditingPkg({ ...editingPkg, features: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs font-mono"
                    placeholder={"End-to-End Wedding Management\n3D Mandap & Stage Renders\nDedicated Bride & Groom Shadows"}
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="pkg-featured-toggle"
                    checked={Boolean(editingPkg.featured)}
                    onChange={(e) => setEditingPkg({ ...editingPkg, featured: e.target.checked })}
                    className="h-4 w-4 rounded text-primary focus:ring-secondary cursor-pointer"
                  />
                  <label htmlFor="pkg-featured-toggle" className="text-xs font-medium cursor-pointer">
                    Highlight as Featured / Most Chosen Tier
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingPkg(null)}
                    className="px-4 py-2 rounded-full border text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5"
                  >
                    Save Package
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 4: CEREMONIES MATRIX */}
      {/* ------------------------------------------------------------- */}
      {subTab === "ceremonies" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-display text-lg text-ink">Ceremony Management Matrix ({ceremonies.length})</h4>
              <p className="text-xs text-muted-foreground">
                Wedding functions &amp; ritual curation rendered under "Curated Functions &amp; Ritual Mastery".
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setEditingCeremony({
                  isNew: true,
                  name: "",
                  subtitle: "",
                  description: "",
                  theme: "Confianza Signature",
                  highlights: "Couple Entry Sequencing\nSound & Ambient Lighting\nRitual Direction",
                  image: "",
                })
              }
              className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4"
            >
              <Plus className="h-4 w-4" />
              <span>Add Ceremony</span>
            </button>
          </div>

          {ceremonies.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center text-muted-foreground border border-border">
              <Sparkles className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <h4 className="font-display text-lg text-ink font-semibold">0 Ceremonies Listed</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Click "Add Ceremony" above to create your first milestone function breakdown.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ceremonies.map((c) => (
                <div
                  key={c.id || c._id}
                  className="glass-card rounded-2xl p-4 border border-border flex flex-col justify-between"
                >
                  <div>
                    <div className="flex gap-3">
                      {c.image ? (
                        <img
                          src={c.image}
                          alt={c.name}
                          className="h-16 w-16 rounded-xl object-cover shrink-0"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-xl gradient-royal flex items-center justify-center text-primary-foreground shrink-0">
                          <Sparkles className="h-6 w-6 text-secondary" />
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <span className="inline-block text-[0.62rem] font-semibold text-primary uppercase tracking-wider mb-0.5">
                          {c.theme || "Ceremony"}
                        </span>
                        <h4 className="font-display text-base font-semibold text-ink truncate">{c.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {c.description}
                        </p>
                      </div>
                    </div>

                    {Array.isArray(c.highlights) && c.highlights.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-border/50 space-y-1">
                        <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground block">
                          Key Deliverables ({c.highlights.length}):
                        </span>
                        <ul className="space-y-1 text-xs text-foreground/80">
                          {c.highlights.map((h, hIdx) => (
                            <li key={hIdx} className="flex items-center gap-1.5 truncate">
                              <CheckCircle className="h-3 w-3 text-secondary shrink-0" />
                              <span className="truncate">{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingCeremony({
                          ...c,
                          highlights: Array.isArray(c.highlights) ? c.highlights.join("\n") : (c.highlights || ""),
                        })
                      }
                      className="p-1.5 rounded-lg border border-border hover:bg-muted text-xs cursor-pointer"
                      title="Edit Ceremony"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCeremony(c.id || c._id)}
                      className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-destructive text-xs cursor-pointer"
                      title="Delete Ceremony"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {editingCeremony && (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/80 p-4">
              <form
                onSubmit={saveCeremonyModal}
                className="glass-card max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center border-b pb-3">
                  <h4 className="font-display text-lg text-ink">
                    {editingCeremony.isNew ? "Add New Ceremony" : "Edit Ceremony"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingCeremony(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-medium block mb-1">Ceremony Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mehendi & Sangeet Soirée"
                    value={editingCeremony.name || ""}
                    onChange={(e) => setEditingCeremony({ ...editingCeremony, name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium block mb-1">Subtitle</label>
                    <input
                      type="text"
                      placeholder="e.g. Rhythmic Celebrations & Glitz"
                      value={editingCeremony.subtitle || ""}
                      onChange={(e) => setEditingCeremony({ ...editingCeremony, subtitle: e.target.value })}
                      className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium block mb-1">Theme Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Bohemian Glamour, Vedic Heritage"
                      value={editingCeremony.theme || ""}
                      onChange={(e) => setEditingCeremony({ ...editingCeremony, theme: e.target.value })}
                      className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium block mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Detailed explanation of how Confianza coordinates this function..."
                    value={editingCeremony.description || ""}
                    onChange={(e) =>
                      setEditingCeremony({ ...editingCeremony, description: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium block mb-1">
                    Key Highlights &amp; Deliverables (One per line)
                  </label>
                  <textarea
                    rows={4}
                    placeholder={"Choreographed couple entry\nLive DJ & Sound rider sync\nSignature mocktail bar flow"}
                    value={editingCeremony.highlights || ""}
                    onChange={(e) =>
                      setEditingCeremony({ ...editingCeremony, highlights: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-mono text-xs"
                  />
                </div>

                <ImageUploadField
                  label="Ceremony Photo Cover"
                  value={editingCeremony.image || ""}
                  onChange={(url) => setEditingCeremony({ ...editingCeremony, image: url })}
                />

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingCeremony(null)}
                    className="px-4 py-2 rounded-full border text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5"
                  >
                    Save Ceremony
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 5: STATIONERY & TOUCHPOINTS SUITE */}
      {/* ------------------------------------------------------------- */}
      {subTab === "stationery" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-display text-lg text-ink">Event Stationery &amp; Hospitality Touchpoints ({stationery.length})</h4>
              <p className="text-xs text-muted-foreground">
                Physical guest touchpoints rendered under "Event Stationery &amp; Touchpoint Suite".
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setEditingStationery({
                  isNew: true,
                  title: "",
                  subtitle: "",
                  description: "",
                  badge: "Event Branding",
                  image: "",
                })
              }
              className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4"
            >
              <Plus className="h-4 w-4" />
              <span>Add Stationery Item</span>
            </button>
          </div>

          {stationery.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center text-muted-foreground border border-border">
              <Feather className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <h4 className="font-display text-lg text-ink font-semibold">0 Stationery Items Listed</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Click "Add Stationery Item" above to showcase bespoke guest collateral.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stationery.map((item) => (
                <div
                  key={item.id || item._id}
                  className="glass-card rounded-2xl p-4 border border-border flex flex-col justify-between"
                >
                  <div>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-32 w-full rounded-xl object-cover mb-3"
                      />
                    ) : (
                      <div className="h-32 w-full rounded-xl gradient-royal flex items-center justify-center text-primary-foreground mb-3">
                        <Feather className="h-6 w-6 text-secondary" />
                      </div>
                    )}
                    <span className="text-[0.62rem] font-bold text-primary uppercase tracking-wider block mb-1">
                      {item.badge || "Stationery"}
                    </span>
                    <h4 className="font-display text-base font-semibold text-ink">{item.title}</h4>
                    {item.subtitle && (
                      <span className="text-[0.68rem] text-muted-foreground block mt-0.5">
                        {item.subtitle}
                      </span>
                    )}
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingStationery({ ...item })}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted text-xs cursor-pointer"
                      title="Edit Item"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteStationery(item.id || item._id)}
                      className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-destructive text-xs cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {editingStationery && (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/80 p-4">
              <form
                onSubmit={saveStationeryModal}
                className="glass-card max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center border-b pb-3">
                  <h4 className="font-display text-lg text-ink">
                    {editingStationery.isNew ? "Add Stationery Item" : "Edit Stationery Item"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingStationery(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-medium block mb-1">Item Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bespoke Itinerary Cards"
                    value={editingStationery.title || ""}
                    onChange={(e) => setEditingStationery({ ...editingStationery, title: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium block mb-1">Subtitle</label>
                    <input
                      type="text"
                      placeholder="e.g. Room & Welcome Placements"
                      value={editingStationery.subtitle || ""}
                      onChange={(e) => setEditingStationery({ ...editingStationery, subtitle: e.target.value })}
                      className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium block mb-1">Badge Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Guest Itinerary, Key Jackets"
                      value={editingStationery.badge || ""}
                      onChange={(e) => setEditingStationery({ ...editingStationery, badge: e.target.value })}
                      className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium block mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe how this luxury physical touchpoint elevates guest experience..."
                    value={editingStationery.description || ""}
                    onChange={(e) =>
                      setEditingStationery({ ...editingStationery, description: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                  />
                </div>

                <ImageUploadField
                  label="Stationery Photo"
                  value={editingStationery.image || ""}
                  onChange={(url) => setEditingStationery({ ...editingStationery, image: url })}
                />

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingStationery(null)}
                    className="px-4 py-2 rounded-full border text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5"
                  >
                    Save Stationery Item
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 6: CONSULTATION CTA BANNER SETTINGS */}
      {/* ------------------------------------------------------------- */}
      {subTab === "cta" && (
        <form onSubmit={saveCtaSettings} className="glass-card rounded-3xl p-6 sm:p-8 space-y-5 animate-fade-in max-w-2xl border border-border">
          <div className="border-b border-border pb-3">
            <h4 className="font-display text-lg text-ink">Services Page Consultation CTA Banner</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Customize the bottom conversion banner displayed across the Services page.
            </p>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Banner Eyebrow / Tagline</label>
            <input
              type="text"
              required
              value={ctaForm.eyebrow || ""}
              onChange={(e) => setCtaForm({ ...ctaForm, eyebrow: e.target.value })}
              className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
              placeholder="e.g. WHERE WEDDINGS BECOME STORIES"
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Main Headline</label>
            <input
              type="text"
              required
              value={ctaForm.headline || ""}
              onChange={(e) => setCtaForm({ ...ctaForm, headline: e.target.value })}
              className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
              placeholder="e.g. Ready to Begin Curating Your Wedding?"
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Subtitle / Vision Text</label>
            <textarea
              rows={3}
              required
              value={ctaForm.subtitle || ""}
              onChange={(e) => setCtaForm({ ...ctaForm, subtitle: e.target.value })}
              className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
              placeholder="e.g. Book a private 60–90 minute consultation with Ashish Wankhede..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium block mb-1">Primary Button Label</label>
              <input
                type="text"
                required
                value={ctaForm.buttonText || ""}
                onChange={(e) => setCtaForm({ ...ctaForm, buttonText: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                placeholder="e.g. Book Your Free Consultation"
              />
            </div>

            <div>
              <label className="text-xs font-medium block mb-1">Primary Button Link</label>
              <input
                type="text"
                required
                value={ctaForm.buttonLink || ""}
                onChange={(e) => setCtaForm({ ...ctaForm, buttonLink: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
                placeholder="e.g. /contact"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Consultation Perks (One per line)</label>
            <textarea
              rows={4}
              value={ctaForm.perks || ""}
              onChange={(e) => setCtaForm({ ...ctaForm, perks: e.target.value })}
              className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-mono text-xs"
              placeholder={"60–90 Min Vision Mapping\nIn-Person (Pune) or Virtual Call\nDetailed Budget Allocations\n3D Spatial Concept Previews"}
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Trust Notice / Footer Tag</label>
            <input
              type="text"
              value={ctaForm.notice || ""}
              onChange={(e) => setCtaForm({ ...ctaForm, notice: e.target.value })}
              className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
              placeholder="e.g. Free Consultation • No Commitment Required"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="btn-luxe gradient-royal text-primary-foreground text-xs py-2.5 px-6 font-semibold shadow-md"
            >
              <Save className="h-4 w-4" />
              <span>Save CTA Banner Settings</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 7: Portfolio Editor
// -------------------------------------------------------------
function PortfolioEditorModule({ site, showSaved }) {
  const [subTab, setSubTab] = useState("portfolio-works"); // "portfolio-works" | "categories" | "header-banner" | "gratitude" | "cta-banner"
  const [isSaving, setIsSaving] = useState(false);

  // 1. Portfolio items state
  const [items, setItems] = useState(site.portfolio || []);
  const [editingProject, setEditingProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("All");

  // 2. Categories state
  const [categories, setCategories] = useState(site.portfolioCategories || []);
  const [editingCategory, setEditingCategory] = useState(null);

  // 3. Header banner state
  const [headerData, setHeaderData] = useState(site.portfolioHeader || {
    badge: "500+ Stories & Counting",
    eyebrow: "OUR SIGNATURE WORKS",
    title: "The Wedding Portfolio",
    subtitle: "A curated gallery of our mandap concepts, floral installations, destination beach setups, and grand reception stages created across India.",
    image: "/images/hero-2.jpg",
    stats: ["500+ Weddings", "15+ Cities Across India", "100% On-Time Cue Execution"],
  });

  // 4. Section heading state (Moments of Grandeur)
  const [sectionData, setSectionData] = useState(site.portfolioSection || {
    eyebrow: "Our Signature Works",
    title: "Moments of Grandeur & Intimacy",
    subtitle: "Explore a curated portfolio of mandaps, opulent ballrooms, sunny haldi courtyards, and destination weddings executed across India.",
  });

  // 5. Gratitude / Testimonials state
  const [testimonials, setTestimonials] = useState(site.testimonials || []);
  const [testimonialsHeader, setTestimonialsHeader] = useState(site.testimonialsHeader || {
    eyebrow: "Words of Gratitude",
    title: "Stories of Love, Captured Forever",
    subtitle: "Read how our couples and their families experienced the ease, beauty, and grandeur of a Confianza managed wedding.",
  });
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  // 6. Portfolio CTA state
  const [ctaData, setCtaData] = useState(site.portfolioCta || {
    eyebrow: "WHERE WEDDINGS BECOME STORIES",
    headline: "Want Your Wedding to Be Our Next Masterpiece?",
    subtitle: "Connect directly with Ashish Wankhede and Rutik Pund to review your venue options, custom 3D decor concepts, and complete management timeline.",
    buttonText: "Book Your Free Consultation",
    buttonLink: "/contact",
    notice: "Free Consultation • No Commitment Required",
    perks: [
      "Personalized 1-on-1 Vision Mapping",
      "Direct Founder Interaction (Ashish & Rutik)",
      "Realistic 3D Decor CAD Renderings",
      "Clear & Transparent Line-Item Estimates",
    ],
  });

  // Sync state when context updates
  useEffect(() => {
    if (site.portfolio) setItems(site.portfolio);
    if (site.portfolioCategories) setCategories(site.portfolioCategories);
    if (site.portfolioHeader) setHeaderData(site.portfolioHeader);
    if (site.portfolioSection) setSectionData(site.portfolioSection);
    if (site.testimonials) setTestimonials(site.testimonials);
    if (site.testimonialsHeader) setTestimonialsHeader(site.testimonialsHeader);
    if (site.portfolioCta) setCtaData(site.portfolioCta);
  }, [
    site.portfolio,
    site.portfolioCategories,
    site.portfolioHeader,
    site.portfolioSection,
    site.testimonials,
    site.testimonialsHeader,
    site.portfolioCta,
  ]);

  // Save Handlers with async/await and isSaving feedback
  const savePortfolioList = async (newList) => {
    setIsSaving(true);
    try {
      setItems(newList);
      await site.update("portfolio", newList);
      showSaved();
    } catch (e) {
      console.error("Save portfolio error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const saveCategoriesList = async (newList) => {
    setIsSaving(true);
    try {
      setCategories(newList);
      await site.update("portfolioCategories", newList);
      showSaved();
    } catch (e) {
      console.error("Save categories error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const saveHeader = async (updated) => {
    setIsSaving(true);
    try {
      setHeaderData(updated);
      await site.update("portfolioHeader", updated);
      showSaved();
    } catch (e) {
      console.error("Save header error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const saveSection = async (updated) => {
    setIsSaving(true);
    try {
      setSectionData(updated);
      await site.update("portfolioSection", updated);
      showSaved();
    } catch (e) {
      console.error("Save section error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const saveTestimonialsList = async (newList) => {
    setIsSaving(true);
    try {
      setTestimonials(newList);
      await site.update("testimonials", newList);
      showSaved();
    } catch (e) {
      console.error("Save testimonials error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const saveTestimonialsHeader = async (updated) => {
    setIsSaving(true);
    try {
      setTestimonialsHeader(updated);
      await site.update("testimonialsHeader", updated);
      showSaved();
    } catch (e) {
      console.error("Save testimonials header error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const saveCta = async (updated) => {
    setIsSaving(true);
    try {
      setCtaData(updated);
      await site.update("portfolioCta", updated);
      showSaved();
    } catch (e) {
      console.error("Save CTA error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  // Sub-tabs configuration
  const subTabs = [
    { id: "portfolio-works", label: `Signature Works (${items.length})` },
    { id: "categories", label: `Category Filter Pills (${categories.length})` },
    { id: "header-banner", label: "Page Header Banner" },
    { id: "gratitude", label: `Words of Gratitude (${testimonials.length})` },
    { id: "cta-banner", label: "Consultation CTA Banner" },
  ];

  // Category names list for dropdowns
  const categoryNames = categories.map((c) => (typeof c === "string" ? c : c.name || c.label)).filter(Boolean);

  // Filtered portfolio list for admin view
  const filteredAdminItems = items.filter((p) => {
    const matchCat =
      selectedFilterCategory === "All" ||
      (p.category && p.category.toLowerCase() === selectedFilterCategory.toLowerCase());
    const matchSearch =
      !searchQuery.trim() ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Sub-tab navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border/80">
        <div className="flex flex-wrap gap-2">
          {subTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSubTab(t.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                subTab === t.id
                  ? "gradient-royal text-primary-foreground shadow-md"
                  : "glass-card text-foreground/75 hover:text-primary hover:bg-muted/60"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <ModuleRefreshButton site={site} showSaved={showSaved} label="Refresh Portfolio" />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. SIGNATURE WORKS & MOMENTS OF GRANDEUR CATALOG SUB-TAB */}
      {/* ------------------------------------------------------------- */}
      {subTab === "portfolio-works" && (
        <div className="space-y-6 animate-fade-in">
          {/* Section Heading Editor Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-border space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-border/60">
              <div>
                <div className="flex items-center gap-1.5 text-primary text-xs uppercase tracking-[0.25em] font-bold">
                  <Sparkles className="h-4 w-4 text-secondary" />
                  <span>Section Header Customizer</span>
                </div>
                <h3 className="font-display text-xl text-ink font-bold mt-1">
                  Moments of Grandeur &amp; Intimacy Section
                </h3>
              </div>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => saveSection(sectionData)}
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5 flex items-center gap-2 disabled:opacity-60 cursor-pointer shadow-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 text-secondary" />
                    <span>Save Section Headings</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">Eyebrow Tag</label>
                <input
                  type="text"
                  value={sectionData.eyebrow || ""}
                  onChange={(e) => setSectionData({ ...sectionData, eyebrow: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs"
                  placeholder="e.g. Our Signature Works"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">Section Main Title</label>
                <input
                  type="text"
                  value={sectionData.title || ""}
                  onChange={(e) => setSectionData({ ...sectionData, title: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold"
                  placeholder="e.g. Moments of Grandeur & Intimacy"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="font-semibold text-foreground block mb-1">Section Subtitle Narrative</label>
              <textarea
                rows={2}
                value={sectionData.subtitle || ""}
                onChange={(e) => setSectionData({ ...sectionData, subtitle: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs leading-relaxed"
                placeholder="Explore a curated portfolio of mandaps, opulent ballrooms..."
              />
            </div>
          </div>

          {/* Project Catalog Header & Actions */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-border space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-border/60">
              <div>
                <h3 className="font-display text-xl text-ink font-bold">
                  Portfolio Works Showcase ({items.length})
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage real wedding showcases rendered on <span className="text-primary font-semibold">/portfolio</span> and the Homepage. Deleting all items will strictly display 0 items.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setEditingProject({
                      isNew: true,
                      title: "",
                      category: categoryNames[0] || "Destination Weddings",
                      location: "Pune, Maharashtra",
                      image: "",
                      description: "",
                      featured: false,
                    })
                  }
                  className="btn-luxe gradient-royal text-primary-foreground text-xs py-2.5 px-5 flex items-center gap-2 cursor-pointer shadow-luxe"
                >
                  <Plus className="h-4 w-4 text-secondary" />
                  <span>Add New Project</span>
                </button>
              </div>
            </div>

            {/* Search and Category Filter Bar inside Admin */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter by title, venue or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card pl-9 pr-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {["All", ...categoryNames].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedFilterCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs transition cursor-pointer shrink-0 ${
                      selectedFilterCategory === cat
                        ? "gradient-royal text-primary-foreground font-semibold"
                        : "border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Portfolio Grid */}
            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground bg-card/30">
                <Sparkles className="h-10 w-10 mx-auto text-secondary/60 mb-2" />
                <p className="font-display text-base text-ink font-semibold">0 Portfolio Works in Database</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click "Add New Project" above to create authentic wedding showcases with high-resolution photos.
                </p>
              </div>
            ) : filteredAdminItems.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground rounded-2xl bg-card/30 border border-border">
                <p className="text-xs">No projects matching your filter criteria.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedFilterCategory("All");
                  }}
                  className="mt-2 text-xs text-primary font-semibold hover:underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAdminItems.map((p, idx) => (
                  <div
                    key={p.id || p._id || idx}
                    className="glass-card rounded-2xl overflow-hidden border border-border flex flex-col justify-between hover:shadow-md transition group"
                  >
                    <div>
                      <div className="relative h-44 w-full bg-ink/10 overflow-hidden">
                        <img
                          src={p.image || "/images/hero-1.jpg"}
                          alt={p.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = "/images/hero-1.jpg";
                          }}
                        />
                        <span className="absolute top-2 left-2 rounded-full bg-ink/80 px-2.5 py-0.5 text-[0.65rem] text-secondary font-semibold backdrop-blur-md border border-white/10">
                          {p.category}
                        </span>
                        {p.featured && (
                          <span className="absolute top-2 right-2 rounded-full gradient-gold text-ink text-[0.62rem] font-bold px-2 py-0.5 shadow-sm">
                            ★ Featured
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-1.5">
                        <h4 className="font-display text-base text-ink font-bold leading-snug">{p.title}</h4>
                        {p.location && (
                          <p className="text-xs text-primary font-medium flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-secondary" />
                            <span>{p.location}</span>
                          </p>
                        )}
                        {p.description && (
                          <p className="text-[0.72rem] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                            {p.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-4 pt-2 border-t border-border flex items-center justify-between gap-2">
                      <span className="text-[0.65rem] text-muted-foreground font-mono">
                        ID: {String(p.id || idx + 1).slice(0, 10)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingProject({ ...p })}
                          className="p-1.5 rounded-lg border border-border hover:bg-muted text-xs text-primary flex items-center gap-1 cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete "${p.title}" from portfolio database?`)) {
                              const updated = items.filter((x) => (x.id || x._id) !== (p.id || p._id));
                              savePortfolioList(updated);
                            }
                          }}
                          className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-destructive text-xs flex items-center gap-1 cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add / Edit Project Modal */}
          {editingProject && (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/80 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const cleanProject = {
                    ...editingProject,
                    id: editingProject.id || `portfolio-${Date.now()}`,
                  };
                  delete cleanProject.isNew;

                  let updated;
                  if (editingProject.isNew) {
                    updated = [cleanProject, ...items];
                  } else {
                    updated = items.map((x) =>
                      (x.id && x.id === editingProject.id) || (x._id && x._id === editingProject._id)
                        ? cleanProject
                        : x
                    );
                  }
                  savePortfolioList(updated);
                  setEditingProject(null);
                }}
                className="glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 space-y-4"
              >
                <div className="flex justify-between items-center border-b pb-3">
                  <h4 className="font-display text-lg text-ink font-bold">
                    {editingProject.isNew ? "Add Portfolio Project" : "Edit Portfolio Project"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-medium"
                    placeholder="e.g. Lakeside Royal Mandap"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Category</label>
                    <select
                      value={editingProject.category || categoryNames[0] || "Destination Weddings"}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs cursor-pointer"
                    >
                      {categoryNames.map((cName) => (
                        <option key={cName} value={cName}>
                          {cName}
                        </option>
                      ))}
                      {!categoryNames.includes(editingProject.category) && editingProject.category && (
                        <option value={editingProject.category}>{editingProject.category}</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-foreground block mb-1">Venue / City Location</label>
                    <input
                      type="text"
                      value={editingProject.location || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                      className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs"
                      placeholder="e.g. Udaipur, Rajasthan"
                    />
                  </div>
                </div>

                <ImageUploadField
                  label="Project Showcase Photo"
                  description="Upload a high-resolution wedding photograph from your device or paste a URL."
                  value={editingProject.image || ""}
                  onChange={(url) => setEditingProject({ ...editingProject, image: url })}
                />

                <div className="text-xs">
                  <label className="font-semibold text-foreground block mb-1">
                    Highlight Story / Concept Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.description || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs leading-relaxed"
                    placeholder="Describe the architectural concept, floral conditioning, or custom decor elements..."
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="featured-check"
                    checked={Boolean(editingProject.featured)}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    className="rounded border-border text-secondary focus:ring-secondary cursor-pointer h-4 w-4"
                  />
                  <label htmlFor="featured-check" className="text-xs font-semibold text-foreground cursor-pointer">
                    Mark as Featured Showcase Project
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 rounded-full border text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5 cursor-pointer shadow-md"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. CATEGORIES MANAGER SUB-TAB */}
      {/* ------------------------------------------------------------- */}
      {subTab === "categories" && (
        <div className="space-y-6 animate-fade-in">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-border/60">
              <div>
                <h3 className="font-display text-xl text-ink font-bold">
                  Portfolio Category Filter Pills ({categories.length})
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage the category pill filters displayed on the public <span className="text-primary font-semibold">/portfolio</span> and Homepage showcase.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingCategory({
                    isNew: true,
                    name: "",
                    slug: "",
                    order: categories.length + 1,
                  })
                }
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2.5 px-4 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Plus className="h-4 w-4 text-secondary" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat, idx) => {
                const cName = typeof cat === "string" ? cat : cat.name || cat.label;
                const cId = typeof cat === "string" ? `cat-${idx}` : cat.id || `cat-${idx}`;
                const count = items.filter(
                  (p) => p.category && p.category.toLowerCase() === cName.toLowerCase()
                ).length;

                return (
                  <div
                    key={cId}
                    className="glass-card rounded-2xl p-4 border border-border flex items-center justify-between gap-3 hover:shadow-sm transition"
                  >
                    <div className="truncate">
                      <h4 className="font-display text-sm font-bold text-ink truncate">{cName}</h4>
                      <span className="text-[0.68rem] text-muted-foreground font-medium">
                        {count} linked {count === 1 ? "project" : "projects"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingCategory({
                            isNew: false,
                            _origName: cName,
                            name: cName,
                            id: cId,
                          })
                        }
                        className="p-1.5 rounded-lg border border-border hover:bg-muted text-xs text-primary cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete category "${cName}"?`)) {
                            const updated = categories.filter((_, i) => i !== idx);
                            saveCategoriesList(updated);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-destructive text-xs cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Add/Edit Modal */}
          {editingCategory && (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/80 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const cleanName = editingCategory.name.trim();
                  if (!cleanName) return;

                  const cleanCat = {
                    id: editingCategory.id || `cat-${Date.now()}`,
                    name: cleanName,
                    slug: cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                  };

                  let updated;
                  if (editingCategory.isNew) {
                    updated = [...categories, cleanCat];
                  } else {
                    updated = categories.map((c) => {
                      const currName = typeof c === "string" ? c : c.name || c.label;
                      if (currName === editingCategory._origName) {
                        return cleanCat;
                      }
                      return c;
                    });
                  }
                  saveCategoriesList(updated);
                  setEditingCategory(null);
                }}
                className="glass-card max-w-sm w-full rounded-3xl p-6 space-y-4"
              >
                <div className="flex justify-between items-center border-b pb-3">
                  <h4 className="font-display text-base text-ink font-bold">
                    {editingCategory.isNew ? "Add Category" : "Edit Category"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Category Name / Label
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs"
                    placeholder="e.g. Royal Baraat & Entry"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="px-4 py-2 rounded-full border text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5 cursor-pointer"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. PORTFOLIO PAGE HEADER BANNER SUB-TAB */}
      {/* ------------------------------------------------------------- */}
      {subTab === "header-banner" && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Editor */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveHeader(headerData);
              }}
              className="lg:col-span-6 glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <div className="flex items-center gap-1.5 text-primary text-xs uppercase tracking-[0.25em] font-bold">
                    <Sparkles className="h-4 w-4 text-secondary" />
                    <span>Top Hero Banner</span>
                  </div>
                  <h3 className="font-display text-xl text-ink font-bold mt-1">Portfolio Header Banner</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Customize the top hero banner title, subtitle, badge, and cover photo on <span className="text-primary font-semibold">/portfolio</span>.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Eyebrow Badge Pill
                </label>
                <input
                  type="text"
                  required
                  value={headerData.badge || ""}
                  onChange={(e) => setHeaderData({ ...headerData, badge: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm"
                  placeholder="e.g. 500+ Stories & Counting"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Main Page Heading / Title
                </label>
                <input
                  type="text"
                  required
                  value={headerData.title || ""}
                  onChange={(e) => setHeaderData({ ...headerData, title: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm font-semibold"
                  placeholder="e.g. The Wedding Portfolio"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Subtitle Narrative / Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={headerData.subtitle || ""}
                  onChange={(e) => setHeaderData({ ...headerData, subtitle: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm leading-relaxed"
                  placeholder="A curated gallery of our mandap concepts, floral installations..."
                />
              </div>

              <ImageUploadField
                label="Header Background Cover Image"
                value={headerData.image || "/images/hero-2.jpg"}
                onChange={(url) => setHeaderData({ ...headerData, image: url })}
              />

              {/* Highlight Metric Pills */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-foreground">
                    Highlight Metric Tags (Pills)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setHeaderData({
                        ...headerData,
                        stats: [...(headerData.stats || []), "New Metric"],
                      })
                    }
                    className="text-[0.7rem] text-primary font-bold hover:underline cursor-pointer"
                  >
                    + Add Metric
                  </button>
                </div>

                <div className="space-y-2">
                  {(headerData.stats || []).map((stat, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={stat}
                        onChange={(e) => {
                          const updated = [...headerData.stats];
                          updated[sIdx] = e.target.value;
                          setHeaderData({ ...headerData, stats: updated });
                        }}
                        className="flex-1 rounded-xl border border-border bg-card px-3 py-1.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = headerData.stats.filter((_, i) => i !== sIdx);
                          setHeaderData({ ...headerData, stats: updated });
                        }}
                        className="text-destructive p-1 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-luxe gradient-royal w-full text-primary-foreground text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 text-secondary" />
                      <span>Save Header Banner Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Right Column: Live Real-Time Preview Replica */}
            <div className="lg:col-span-6 space-y-3 sticky top-6">
              <div className="flex items-center justify-between px-2">
                <span className="text-[0.68rem] uppercase tracking-[0.25em] text-primary font-bold flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-secondary" /> Live /portfolio Header Preview
                </span>
                <span className="text-[0.62rem] text-muted-foreground font-mono">
                  Exact Frontend Replica
                </span>
              </div>

              <div className="relative bg-ink rounded-3xl p-8 sm:p-10 text-background overflow-hidden border border-secondary/30 shadow-2xl text-center">
                <div className="absolute inset-0 z-0 opacity-25">
                  <img
                    src={headerData.image || "/images/hero-2.jpg"}
                    alt="Portfolio Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/images/hero-2.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
                </div>

                <div className="relative z-10 space-y-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3.5 py-1 text-[0.68rem] uppercase tracking-[0.3em] text-secondary font-medium backdrop-blur-md">
                    <Sparkles className="h-3 w-3 text-secondary" />
                    <span>{headerData.badge || "500+ Stories & Counting"}</span>
                  </span>

                  <h1 className="font-display text-2xl sm:text-3xl text-white font-normal leading-tight">
                    {headerData.title || "The Wedding Portfolio"}
                  </h1>

                  <div className="rule-gold mx-auto my-3" />

                  <p className="text-xs sm:text-sm text-background/80 font-light leading-relaxed max-w-md mx-auto">
                    {headerData.subtitle ||
                      "A curated gallery of our mandap concepts, floral installations, destination beach setups..."}
                  </p>

                  {Array.isArray(headerData.stats) && headerData.stats.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      {headerData.stats.map((stat, sIdx) => (
                        <span
                          key={sIdx}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[0.68rem] text-champagne backdrop-blur-md border border-white/15"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                          <span>{stat}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. WORDS OF GRATITUDE / LOVE STORIES SUB-TAB */}
      {/* ------------------------------------------------------------- */}
      {subTab === "gratitude" && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Section Editor */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-border space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-border/60">
              <div>
                <div className="flex items-center gap-1.5 text-primary text-xs uppercase tracking-[0.25em] font-bold">
                  <Sparkles className="h-4 w-4 text-secondary" />
                  <span>Section Header Customizer</span>
                </div>
                <h3 className="font-display text-xl text-ink font-bold mt-1">
                  Words of Gratitude Section
                </h3>
              </div>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => saveTestimonialsHeader(testimonialsHeader)}
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5 flex items-center gap-2 disabled:opacity-60 cursor-pointer shadow-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 text-secondary" />
                    <span>Save Section Headings</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">Eyebrow Tag</label>
                <input
                  type="text"
                  value={testimonialsHeader.eyebrow || ""}
                  onChange={(e) => setTestimonialsHeader({ ...testimonialsHeader, eyebrow: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs"
                  placeholder="e.g. Words of Gratitude"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">Main Section Title</label>
                <input
                  type="text"
                  value={testimonialsHeader.title || ""}
                  onChange={(e) => setTestimonialsHeader({ ...testimonialsHeader, title: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold"
                  placeholder="e.g. Stories of Love, Captured Forever"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="font-semibold text-foreground block mb-1">Subtitle Narrative</label>
              <textarea
                rows={2}
                value={testimonialsHeader.subtitle || ""}
                onChange={(e) => setTestimonialsHeader({ ...testimonialsHeader, subtitle: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs leading-relaxed"
                placeholder="Read how our couples and their families experienced the ease, beauty..."
              />
            </div>
          </div>

          {/* Testimonials List Manager */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-border space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-border/60">
              <div>
                <h3 className="font-display text-xl text-ink font-bold">
                  Client Reviews &amp; Stories ({testimonials.length})
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage real couple testimonials rendered on <span className="text-primary font-semibold">/portfolio</span>, <span className="text-primary font-semibold">/testimonials</span>, and the Homepage.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingTestimonial({
                    isNew: true,
                    name: "",
                    location: "Pune",
                    date: "2025",
                    rating: 5,
                    image: "",
                    text: "",
                    featured: true,
                  })
                }
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2.5 px-5 flex items-center gap-2 cursor-pointer shadow-luxe"
              >
                <Plus className="h-4 w-4 text-secondary" />
                <span>Add Couple Story</span>
              </button>
            </div>

            {testimonials.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground bg-card/30">
                <Quote className="h-10 w-10 mx-auto text-secondary/60 mb-2" />
                <p className="font-display text-base text-ink font-semibold">0 Testimonials in Database</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click "Add Couple Story" above to add heartfelt client reviews.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {testimonials.map((t, idx) => (
                  <div
                    key={t.id || t._id || idx}
                    className="glass-card rounded-2xl p-5 border border-border flex flex-col justify-between hover:shadow-md transition"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={t.image || "/images/couple.jpg"}
                            alt={t.name}
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-secondary/50"
                            onError={(e) => {
                              e.currentTarget.src = "/images/couple.jpg";
                            }}
                          />
                          <div>
                            <h4 className="font-display text-base font-bold text-ink">{t.name}</h4>
                            <div className="flex items-center gap-2 text-[0.68rem] text-muted-foreground mt-0.5">
                              <span className="flex items-center gap-1 text-primary">
                                <MapPin className="h-3 w-3 text-secondary" />
                                {t.location}
                              </span>
                              <span>•</span>
                              <span>{t.date}</span>
                            </div>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: t.rating || 5 }).map((_, sIdx) => (
                            <Star key={sIdx} className="h-3.5 w-3.5 fill-secondary text-secondary" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-foreground/85 italic leading-relaxed">
                        "{t.text}"
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingTestimonial({ ...t })}
                        className="p-1.5 rounded-lg border border-border hover:bg-muted text-xs text-primary flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete review from "${t.name}"?`)) {
                            const updated = testimonials.filter((x) => (x.id || x._id) !== (t.id || t._id));
                            saveTestimonialsList(updated);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-destructive text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Testimonial Add / Edit Modal */}
          {editingTestimonial && (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/80 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const cleanTestimonial = {
                    ...editingTestimonial,
                    id: editingTestimonial.id || `test-${Date.now()}`,
                  };
                  delete cleanTestimonial.isNew;
                  delete cleanTestimonial._customRelMode;
                  delete cleanTestimonial._customCatMode;

                  let updated;
                  if (editingTestimonial.isNew) {
                    updated = [cleanTestimonial, ...testimonials];
                  } else {
                    updated = testimonials.map((x) =>
                      (x.id && x.id === editingTestimonial.id) || (x._id && x._id === editingTestimonial._id)
                        ? cleanTestimonial
                        : x
                    );
                  }
                  saveTestimonialsList(updated);
                  setEditingTestimonial(null);
                }}
                className="glass-card max-w-md w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 space-y-4"
              >
                <div className="flex justify-between items-center border-b pb-3">
                  <h4 className="font-display text-lg text-ink font-bold">
                    {editingTestimonial.isNew ? "Add Couple Story" : "Edit Couple Story"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingTestimonial(null)}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Couple Names *</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.name || ""}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-medium"
                    placeholder="e.g. Sneha & Rohan Kulkarni"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Relationship / Role</label>
                    {(() => {
                      const standardRoles = [
                        "Bride & Groom",
                        "Parents of the Bride",
                        "Parents of the Groom",
                        "Family Member / Relative",
                        "Wedding Guest",
                        "Corporate Host",
                      ];
                      const currentRel = editingTestimonial.relationship || "Bride & Groom";
                      const isStandard = standardRoles.includes(currentRel);
                      const isOtherSelected = editingTestimonial._customRelMode || (!isStandard && currentRel !== "");

                      return (
                        <div className="space-y-1.5">
                          <select
                            value={isOtherSelected ? "Other" : currentRel}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "Other") {
                                setEditingTestimonial({
                                  ...editingTestimonial,
                                  _customRelMode: true,
                                  relationship: isStandard ? "" : currentRel,
                                });
                              } else {
                                setEditingTestimonial({
                                  ...editingTestimonial,
                                  _customRelMode: false,
                                  relationship: val,
                                });
                              }
                            }}
                            className="w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs cursor-pointer"
                          >
                            {standardRoles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                            <option value="Other">Other</option>
                          </select>

                          {isOtherSelected && (
                            <input
                              type="text"
                              required
                              value={editingTestimonial.relationship || ""}
                              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, relationship: e.target.value })}
                              className="w-full rounded-xl border border-secondary/60 bg-card px-3 py-1.5 text-xs ring-1 ring-secondary/20 animate-fade-in"
                              placeholder="e.g. Sister of the Bride, Family Friend, Groom's Cousin"
                            />
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  <div>
                    <label className="font-semibold text-foreground block mb-1">Event Category</label>
                    {(() => {
                      const standardCats = [
                        "Royal & Destination Weddings",
                        "Mandap & Rituals",
                        "Haldi & Sangeet",
                        "Opulent Receptions",
                        "Corporate Celebrations",
                      ];
                      const currentCat = editingTestimonial.category || standardCats[0];
                      const isStandard = standardCats.includes(currentCat);
                      const isOtherSelected = editingTestimonial._customCatMode || (!isStandard && currentCat !== "");

                      return (
                        <div className="space-y-1.5">
                          <select
                            value={isOtherSelected ? "Other" : currentCat}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "Other") {
                                setEditingTestimonial({
                                  ...editingTestimonial,
                                  _customCatMode: true,
                                  category: isStandard ? "" : currentCat,
                                });
                              } else {
                                setEditingTestimonial({
                                  ...editingTestimonial,
                                  _customCatMode: false,
                                  category: val,
                                });
                              }
                            }}
                            className="w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs cursor-pointer"
                          >
                            {standardCats.map((name) => (
                              <option key={name} value={name}>
                                {name}
                              </option>
                            ))}
                            <option value="Other">Other</option>
                          </select>

                          {isOtherSelected && (
                            <input
                              type="text"
                              required
                              value={editingTestimonial.category || ""}
                              onChange={(e) => setEditingTestimonial({ ...editingTestimonial, category: e.target.value })}
                              className="w-full rounded-xl border border-secondary/60 bg-card px-3 py-1.5 text-xs ring-1 ring-secondary/20 animate-fade-in"
                              placeholder="e.g. Sangeet Gala, Engagement, Anniversary Banquet"
                            />
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Wedding Location</label>
                    <input
                      type="text"
                      value={editingTestimonial.location || ""}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, location: e.target.value })}
                      className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs"
                      placeholder="e.g. Udaipur & Pune"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Wedding Date / Year</label>
                    <input
                      type="text"
                      value={editingTestimonial.date || ""}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, date: e.target.value })}
                      className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs"
                      placeholder="e.g. 14 Feb 2025"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Rating Stars (1 to 5)
                  </label>
                  <select
                    value={editingTestimonial.rating || 5}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs cursor-pointer"
                  >
                    <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                    <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                    <option value={3}>★★★☆☆ (3 Stars - Good)</option>
                  </select>
                </div>

                <ImageUploadField
                  label="Couple Photo"
                  value={editingTestimonial.image || ""}
                  onChange={(url) => setEditingTestimonial({ ...editingTestimonial, image: url })}
                />

                <div className="text-xs">
                  <label className="font-semibold text-foreground block mb-1">Testimonial Quote / Narrative</label>
                  <textarea
                    rows={4}
                    required
                    value={editingTestimonial.text || ""}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs leading-relaxed"
                    placeholder="Enter what the couple said about their wedding planning experience..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingTestimonial(null)}
                    className="px-4 py-2 rounded-full border text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5 cursor-pointer shadow-md"
                  >
                    Save Review
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. PORTFOLIO CTA BANNER SUB-TAB */}
      {/* ------------------------------------------------------------- */}
      {subTab === "cta-banner" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveCta(ctaData);
          }}
          className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <div className="flex items-center gap-1.5 text-primary text-xs uppercase tracking-[0.25em] font-bold">
                <Sparkles className="h-4 w-4 text-secondary" />
                <span>Portfolio Consultation Action</span>
              </div>
              <h3 className="font-display text-xl text-ink font-bold mt-1">
                Private Consultation CTA Banner
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Customize the luxury action card displayed at the bottom of the <span className="text-primary font-semibold">/portfolio</span> page.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-luxe gradient-royal text-primary-foreground text-xs py-2.5 px-6 flex items-center gap-2 disabled:opacity-60 cursor-pointer shadow-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 text-secondary" />
                  <span>Save Consultation CTA</span>
                </>
              )}
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-foreground block mb-1">Eyebrow Badge</label>
              <input
                type="text"
                value={ctaData.eyebrow || ""}
                onChange={(e) => setCtaData({ ...ctaData, eyebrow: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs uppercase tracking-wider"
                placeholder="WHERE WEDDINGS BECOME STORIES"
              />
            </div>

            <div>
              <label className="font-semibold text-foreground block mb-1">Headline</label>
              <input
                type="text"
                value={ctaData.headline || ""}
                onChange={(e) => setCtaData({ ...ctaData, headline: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold"
                placeholder="Want Your Wedding to Be Our Next Masterpiece?"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="font-semibold text-foreground block mb-1">Subtitle Description</label>
            <textarea
              rows={3}
              value={ctaData.subtitle || ""}
              onChange={(e) => setCtaData({ ...ctaData, subtitle: e.target.value })}
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs leading-relaxed"
              placeholder="Connect directly with Ashish Wankhede and Rutik Pund to review your venue options..."
            />
          </div>

          <div className="text-xs">
            <label className="font-semibold text-foreground block mb-1">Primary Button Label</label>
            <input
              type="text"
              value={ctaData.buttonText || ""}
              onChange={(e) => setCtaData({ ...ctaData, buttonText: e.target.value, buttonLink: ctaData.buttonLink || "/contact" })}
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs"
              placeholder="Book Your Free Consultation"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Notice / Disclaimer</label>
            <input
              type="text"
              value={ctaData.notice || ""}
              onChange={(e) => setCtaData({ ...ctaData, notice: e.target.value })}
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs"
              placeholder="Free Consultation • No Commitment Required"
            />
          </div>

          {/* Consultation Perks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-foreground">Consultation Perks &amp; Benefits</label>
              <button
                type="button"
                onClick={() =>
                  setCtaData({
                    ...ctaData,
                    perks: [...(ctaData.perks || []), "New Consultation Perk"],
                  })
                }
                className="text-[0.7rem] text-primary font-bold hover:underline cursor-pointer"
              >
                + Add Perk
              </button>
            </div>

            <div className="space-y-2">
              {(ctaData.perks || []).map((perk, pIdx) => (
                <div key={pIdx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={perk}
                    onChange={(e) => {
                      const updated = [...ctaData.perks];
                      updated[pIdx] = e.target.value;
                      setCtaData({ ...ctaData, perks: updated });
                    }}
                    className="flex-1 rounded-xl border border-border bg-card px-3 py-1.5 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = ctaData.perks.filter((_, i) => i !== pIdx);
                      setCtaData({ ...ctaData, perks: updated });
                    }}
                    className="text-destructive p-1 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 8: Gallery Management Suite (Visual Chronicles & Social Archive)
// -------------------------------------------------------------
function GalleryEditorModule({ site, showSaved }) {
  const [subTab, setSubTab] = useState("photos");
  const [gallery, setGallery] = useState(site.gallery || []);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Keep local states in reactive sync with site context
  useEffect(() => {
    if (Array.isArray(site.gallery)) {
      setGallery(site.gallery);
    }
  }, [site.gallery]);

  useEffect(() => {
    if (Array.isArray(site.galleryCategories) && site.galleryCategories.length > 0) {
      setCategories(site.galleryCategories);
    }
  }, [site.galleryCategories]);

  useEffect(() => {
    if (site.galleryHeader && Object.keys(site.galleryHeader).length > 0) {
      setHeroHeader(site.galleryHeader);
    }
  }, [site.galleryHeader]);

  useEffect(() => {
    if (Array.isArray(site.galleryHighlights) && site.galleryHighlights.length > 0) {
      setHighlights(site.galleryHighlights);
    }
  }, [site.galleryHighlights]);

  useEffect(() => {
    if (Array.isArray(site.instagram)) {
      setInstagramPosts(site.instagram);
    }
  }, [site.instagram]);

  useEffect(() => {
    if (site.instagramHeader && Object.keys(site.instagramHeader).length > 0) {
      setInstaHeader(site.instagramHeader);
    }
  }, [site.instagramHeader]);

  useEffect(() => {
    if (site.galleryCta && Object.keys(site.galleryCta).length > 0) {
      setGalleryCta(site.galleryCta);
    }
  }, [site.galleryCta]);

  // Dynamic Categories State
  const defaultCategories = [
    { id: "all", name: "All Archives", slug: "all", order: 1 },
    { id: "mandap", name: "Mandap Architecture", slug: "mandap", order: 2 },
    { id: "reception", name: "Opulent Receptions", slug: "reception", order: 3 },
    { id: "haldi-sangeet", name: "Haldi & Sangeet", slug: "haldi-sangeet", order: 4 },
    { id: "bridal-entries", name: "Bridal Entries & Portraits", slug: "bridal-entries", order: 5 },
    { id: "destination", name: "Destination Venues", slug: "destination", order: 6 },
    { id: "spatial-decor", name: "Spatial Decor & Floral Art", slug: "spatial-decor", order: 7 },
  ];

  const [categories, setCategories] = useState(
    Array.isArray(site.galleryCategories) && site.galleryCategories.length > 0
      ? site.galleryCategories
      : defaultCategories
  );
  const [editingCategory, setEditingCategory] = useState(null);

  // Hero Banner State
  const defaultHeroHeader = {
    badge: "Curated Visual Archive",
    eyebrow: "VISUAL INSPIRATIONS",
    title: "The Wedding Gallery",
    subtitle:
      "Immerse yourself in close-up details of floral centerpieces, bridal entries, fairy-lit courtyards, and grand lavender stages.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790881511/confianza_heroes/gallery_hero_banner.jpg",
    stats: [
      "500+ Celebrations Across India",
      "15+ Landmark Destination Cities",
      "100% 3D CAD-to-Reality Fidelity",
      "Zero-Glitch Stage Execution",
    ],
  };
  const [heroHeader, setHeroHeader] = useState(site.galleryHeader || defaultHeroHeader);

  // Spatial Craft Highlights State (From PDF Materials)
  const defaultHighlights = [
    {
      id: "mandap-sanctum",
      title: "Mandap Architecture & Vedic Sanctums",
      subtitle: "Auspicious Engineering & Floral Art",
      description:
        "From custom temple pillars to floating lotus pools, our mandaps blend sacred Vedic geometry with opulent seasonal florals.",
      icon: "Sparkles",
      badge: "Vedic Precision",
    },
    {
      id: "stage-production",
      title: "Stage, Lighting & SFX Production",
      subtitle: "3D CAD-to-Reality Fidelity",
      description:
        "Intelligent moving beam arrays, high-resolution curved LED walls, cold pyrotechnics, and hydraulic stages managed with millisecond cues.",
      icon: "Layers",
      badge: "Show Runner Direct",
    },
    {
      id: "haldi-carnival",
      title: "Themed Haldi & Mehendi Carnivals",
      subtitle: "Joyous Yellow Blooms & Folk Artistry",
      description:
        "Phoolon ki Holi setups, handcrafted marigold canopies, brass urlis, artisanal mehendi cabanas, and energetic dhol tasha troupes.",
      icon: "Award",
      badge: "Cultural Extravaganza",
    },
    {
      id: "luxe-tablescapes",
      title: "Luxe Tablescapes & Hospitality Styling",
      subtitle: "Intimate Ambiance & Event Branding",
      description:
        "Crystal chandeliers, candlelit floral centerpieces, customized luggage tags, itinerary jackets, and dedicated guest concierge suites.",
      icon: "Users",
      badge: "Concierge Elegance",
    },
  ];
  const [highlights, setHighlights] = useState(
    Array.isArray(site.galleryHighlights) && site.galleryHighlights.length > 0
      ? site.galleryHighlights
      : defaultHighlights
  );
  const [editingHighlight, setEditingHighlight] = useState(null);

  // Follow Our Journey Instagram State
  const defaultInstaHeader = {
    eyebrow: "Follow Our Journey",
    title: "@confianza_events on Instagram",
    subtitle:
      "Behind-the-scenes reels, live setups in Udaipur, Pune, and Goa, and daily wedding decor inspiration.",
    handle: "@confianza_events",
    followerCount: "10K+ Followers",
    url: "https://www.instagram.com/confianza_events",
  };
  const [instaHeader, setInstaHeader] = useState(site.instagramHeader || defaultInstaHeader);
  const [instagramPosts, setInstagramPosts] = useState(site.instagram || []);
  const [editingInstaPost, setEditingInstaPost] = useState(null);

  // Consultation CTA State
  const defaultGalleryCta = {
    eyebrow: "WHERE WEDDINGS BECOME STORIES",
    headline: "Envision Your Wedding in Our Visual Chronicle",
    subtitle:
      "Connect directly with founders Ashish Wankhede and Rutik Pund in Warje, Pune to design your bespoke 3D CAD wedding decor.",
    buttonText: "Book Your Free Consultation",
    buttonLink: "/contact",
    notice: "Free 1-on-1 Consultation • Direct Founder Interaction",
    perks: [
      "60–90 Min Vision & Budget Mapping",
      "Direct Founder Interaction (Ashish & Rutik)",
      "3D Spatial CAD Concept Previews",
      "Clear Line-Item Vendor Estimates",
    ],
  };
  const [galleryCta, setGalleryCta] = useState(site.galleryCta || defaultGalleryCta);

  // Persist Gallery Photos
  const saveGalleryPhotos = async (newList) => {
    setGallery(newList);
    try {
      await site.update("gallery", newList);
      showSaved("Gallery photos updated successfully in MongoDB!");
    } catch (err) {
      console.error("Failed to save gallery photos:", err);
    }
  };

  // Persist Categories
  const saveCategories = async (newList) => {
    setCategories(newList);
    try {
      await site.update("galleryCategories", newList);
      showSaved("Gallery categories updated successfully in MongoDB!");
    } catch (err) {
      console.error("Failed to save categories:", err);
    }
  };

  // Persist Hero Header
  const saveHeroHeader = async () => {
    try {
      await site.update("galleryHeader", heroHeader);
      showSaved("Gallery Hero Header saved successfully in MongoDB!");
    } catch (err) {
      console.error("Failed to save hero header:", err);
    }
  };

  // Persist Highlights
  const saveHighlights = async (newList) => {
    setHighlights(newList);
    try {
      await site.update("galleryHighlights", newList);
      showSaved("Spatial craft highlights saved successfully in MongoDB!");
    } catch (err) {
      console.error("Failed to save highlights:", err);
    }
  };

  // Persist Instagram Feed & Header
  const saveInstagram = async (newPosts) => {
    setInstagramPosts(newPosts);
    try {
      await site.update("instagram", newPosts);
      showSaved("Instagram posts updated successfully in MongoDB!");
    } catch (err) {
      console.error("Failed to save instagram posts:", err);
    }
  };

  const saveInstagramHeader = async () => {
    try {
      await site.update("instagramHeader", instaHeader);
      showSaved("Instagram header settings saved successfully in MongoDB!");
    } catch (err) {
      console.error("Failed to save instagram header:", err);
    }
  };

  // Persist CTA
  const saveGalleryCta = async () => {
    try {
      await site.update("galleryCta", galleryCta);
      showSaved("Gallery consultation CTA banner saved successfully in MongoDB!");
    } catch (err) {
      console.error("Failed to save gallery CTA:", err);
    }
  };

  // Filter photos for visual archive tab
  const filteredPhotos = gallery.filter((item) => {
    const matchCat =
      categoryFilter === "all" ||
      (item.category || "").toLowerCase() === categoryFilter.toLowerCase();
    const matchSearch =
      !searchQuery ||
      (item.caption || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Module Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-card border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-xl text-ink font-semibold">
              Gallery Management Suite
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-secondary/20 text-secondary text-[0.68rem] font-bold">
              {gallery.length} Photos
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage Visual Chronicles, Filter Categories, Hero Banner, Social Feed & Highlights
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <ModuleRefreshButton site={site} showSaved={showSaved} label="Refresh Gallery" />
          <button
            type="button"
            onClick={() =>
              setEditingPhoto({
                isNew: true,
                caption: "",
                category: categories[1]?.name || "Mandap Architecture",
                location: "Pune",
                image: "",
                order: gallery.length + 1,
              })
            }
            className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Photo</span>
          </button>
        </div>
      </div>

      {/* Subtabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/80 pb-3">
        {[
          { id: "photos", label: `Visual Chronicles (${gallery.length})`, icon: ImageIcon },
          { id: "categories", label: `Categories (${categories.length})`, icon: Layers },
          { id: "header", label: "Hero Header Banner", icon: Sliders },
          { id: "highlights", label: `Spatial Highlights (${highlights.length})`, icon: Sparkles },
          { id: "instagram", label: `Follow Journey (${instagramPosts.length})`, icon: MessageSquareQuote },
          { id: "cta", label: "Consultation CTA", icon: PhoneCall },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "gradient-royal text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-foreground/80 hover:text-secondary hover:border-secondary/50"
              }`}
            >
              <IconComp className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: Visual Chronicles Photo Archive */}
      {subTab === "photos" && (
        <div className="space-y-5">
          {/* Controls: Search & Category Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by caption, category, or location..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-xs focus:outline-none focus:border-secondary"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground font-medium">Filter:</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-secondary"
              >
                <option value="all">All Categories ({gallery.length})</option>
                {categories
                  .filter((c) => c.id !== "all")
                  .map((c) => (
                    <option key={c.id || c.slug} value={c.name}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Photos Grid */}
          {filteredPhotos.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center text-muted-foreground border border-border">
              <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <h4 className="font-display text-base text-ink font-semibold">
                No Gallery Photos Found
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {gallery.length === 0
                  ? "Click 'Add Photo' above to upload your first wedding visual."
                  : "No photos match your current search or category filter."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {filteredPhotos.map((g) => (
                <div
                  key={g.id}
                  className="relative group rounded-2xl overflow-hidden border border-border bg-card shadow-xs transition-all duration-300 hover:shadow-soft"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-muted/40">
                    <img
                      src={g.image}
                      alt={g.caption}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {g.category && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-full bg-ink/80 backdrop-blur-md text-[0.62rem] uppercase tracking-wider font-semibold text-champagne border border-white/10">
                        {g.category}
                      </span>
                    </div>
                  )}
                  <div className="p-3 bg-card border-t border-border/60">
                    <h5 className="font-display text-xs text-ink font-medium truncate">
                      {g.caption || "Untitled Photo"}
                    </h5>
                    {g.location && (
                      <div className="flex items-center gap-1 text-[0.65rem] text-muted-foreground mt-0.5">
                        <MapPin className="h-3 w-3 text-secondary" />
                        <span>{g.location}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-1.5 mt-2.5 pt-2 border-t border-border/40">
                      <span className="text-[0.62rem] font-mono text-muted-foreground">
                        Order #{g.order || 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingPhoto({ ...g })}
                          className="p-1 rounded-lg bg-accent text-foreground hover:text-secondary transition"
                          title="Edit Photo"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Delete this photo from gallery?")) {
                              saveGalleryPhotos(gallery.filter((x) => x.id !== g.id));
                            }
                          }}
                          className="p-1 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive hover:text-white transition"
                          title="Delete Photo"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: Filter Categories Manager */}
      {subTab === "categories" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 p-4 bg-card rounded-2xl border border-border">
            <div>
              <h4 className="font-display text-base text-ink font-semibold">
                Dynamic Gallery Filter Categories
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage category filter pills shown at the top of the Gallery page.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setEditingCategory({
                  isNew: true,
                  id: `cat-${Date.now()}`,
                  name: "",
                  slug: "",
                  order: categories.length + 1,
                })
              }
              className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, idx) => {
              const count =
                cat.id === "all" || cat.slug === "all"
                  ? gallery.length
                  : gallery.filter((it) => {
                      const c = (it.category || "")
                        .toLowerCase()
                        .replace(/&/g, "and")
                        .replace(/[^a-z0-9]/g, "")
                        .trim();
                      const n = (cat.name || "")
                        .toLowerCase()
                        .replace(/&/g, "and")
                        .replace(/[^a-z0-9]/g, "")
                        .trim();
                      const s = (cat.slug || "")
                        .toLowerCase()
                        .replace(/&/g, "and")
                        .replace(/[^a-z0-9]/g, "")
                        .trim();
                      return Boolean(c && ((n && c === n) || (s && c === s)));
                    }).length;

              return (
                <div
                  key={cat.id || idx}
                  className="p-4 rounded-2xl border border-border bg-card shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm text-ink font-semibold truncate">
                        {cat.name}
                      </span>
                      <span className="text-[0.68rem] px-2 py-0.5 rounded-full bg-secondary/15 text-secondary font-mono font-bold">
                        {count} items
                      </span>
                    </div>
                    <span className="text-[0.68rem] font-medium text-muted-foreground block mt-0.5">
                      Display Order #{cat.order || idx + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingCategory({ ...cat })}
                      className="p-1.5 rounded-lg bg-accent text-foreground hover:text-secondary transition"
                      title="Edit Category"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    {cat.id !== "all" && cat.slug !== "all" && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete category "${cat.name}"?`)) {
                            saveCategories(categories.filter((c) => c.id !== cat.id));
                          }
                        }}
                        className="p-1.5 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive hover:text-white transition"
                        title="Delete Category"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: Hero Header Banner Customizer */}
      {subTab === "header" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
            <h4 className="font-display text-base text-ink font-semibold">
              Gallery Hero Header Banner
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium block mb-1">Badge</label>
                <input
                  type="text"
                  value={heroHeader.badge || ""}
                  onChange={(e) => setHeroHeader({ ...heroHeader, badge: e.target.value })}
                  placeholder="e.g. Curated Visual Archive"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Eyebrow</label>
                <input
                  type="text"
                  value={heroHeader.eyebrow || ""}
                  onChange={(e) => setHeroHeader({ ...heroHeader, eyebrow: e.target.value })}
                  placeholder="e.g. VISUAL INSPIRATIONS"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium block mb-1">Headline Title</label>
              <input
                type="text"
                value={heroHeader.title || ""}
                onChange={(e) => setHeroHeader({ ...heroHeader, title: e.target.value })}
                placeholder="e.g. The Wedding Gallery"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="text-xs font-medium block mb-1">Subtitle</label>
              <textarea
                rows={2}
                value={heroHeader.subtitle || ""}
                onChange={(e) => setHeroHeader({ ...heroHeader, subtitle: e.target.value })}
                placeholder="Immerse yourself in close-up details..."
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-secondary"
              />
            </div>

            <ImageUploadField
              label="Hero Banner Image (Cloudinary <= 2MB)"
              value={heroHeader.image || ""}
              onChange={(url) => setHeroHeader({ ...heroHeader, image: url })}
            />

            {/* Stats Chips */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium">Floating Trust Metrics Chips</label>
                <button
                  type="button"
                  onClick={() =>
                    setHeroHeader({
                      ...heroHeader,
                      stats: [...(heroHeader.stats || []), "New Metric Badge"],
                    })
                  }
                  className="text-xs text-secondary font-semibold hover:underline cursor-pointer"
                >
                  + Add Metric Chip
                </button>
              </div>
              <div className="space-y-2">
                {(heroHeader.stats || []).map((st, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={st}
                      onChange={(e) => {
                        const newStats = [...heroHeader.stats];
                        newStats[idx] = e.target.value;
                        setHeroHeader({ ...heroHeader, stats: newStats });
                      }}
                      className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newStats = heroHeader.stats.filter((_, i) => i !== idx);
                        setHeroHeader({ ...heroHeader, stats: newStats });
                      }}
                      className="p-1.5 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive hover:text-white transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={saveHeroHeader}
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2.5 px-6 font-semibold shadow-sm cursor-pointer"
              >
                Save Hero Banner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: Spatial Craft Highlights (From PDF Materials) */}
      {subTab === "highlights" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 p-4 bg-card rounded-2xl border border-border">
            <div>
              <h4 className="font-display text-base text-ink font-semibold">
                Signature Spatial Craft & Highlights
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Aesthetic feature cards showcasing Confianza's specialty engineering and production from the official PDF materials.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setEditingHighlight({
                  isNew: true,
                  id: `craft-${Date.now()}`,
                  title: "",
                  subtitle: "",
                  description: "",
                  badge: "Confianza Signature",
                  icon: "Sparkles",
                })
              }
              className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Add Highlight Card</span>
            </button>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((card, idx) => (
              <div
                key={card.id || idx}
                className="p-5 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[0.62rem] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-accent text-secondary border border-secondary/20">
                      {card.badge || "Signature"}
                    </span>
                    <span className="text-[0.62rem] font-mono text-muted-foreground">
                      Icon: {card.icon || "Sparkles"}
                    </span>
                  </div>
                  <h5 className="font-display text-sm text-ink font-semibold mt-2">
                    {card.title}
                  </h5>
                  {card.subtitle && (
                    <p className="text-xs text-secondary font-medium mt-0.5">{card.subtitle}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">
                    {card.description}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-1.5 mt-4 pt-3 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() => setEditingHighlight({ ...card })}
                    className="p-1.5 rounded-lg bg-accent text-foreground hover:text-secondary transition"
                    title="Edit Highlight"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete highlight card "${card.title}"?`)) {
                        saveHighlights(highlights.filter((h) => h.id !== card.id));
                      }
                    }}
                    className="p-1.5 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive hover:text-white transition"
                    title="Delete Highlight"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: Follow Our Journey Instagram Manager */}
      {subTab === "instagram" && (
        <div className="space-y-6">
          {/* Header Settings */}
          <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
            <h4 className="font-display text-base text-ink font-semibold">
              Instagram Social Wall Header Settings
            </h4>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="text-xs font-medium block mb-1">Instagram Handle</label>
                <input
                  type="text"
                  value={instaHeader.handle || ""}
                  onChange={(e) => setInstaHeader({ ...instaHeader, handle: e.target.value })}
                  placeholder="@confianza_events"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Follower Count Badge</label>
                <input
                  type="text"
                  value={instaHeader.followerCount || ""}
                  onChange={(e) => setInstaHeader({ ...instaHeader, followerCount: e.target.value })}
                  placeholder="10K+ Followers"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Instagram Profile URL</label>
                <input
                  type="text"
                  value={instaHeader.url || ""}
                  onChange={(e) => setInstaHeader({ ...instaHeader, url: e.target.value })}
                  placeholder="https://www.instagram.com/confianza_events"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Section Subtitle</label>
              <input
                type="text"
                value={instaHeader.subtitle || ""}
                onChange={(e) => setInstaHeader({ ...instaHeader, subtitle: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs"
              />
            </div>
            <button
              type="button"
              onClick={saveInstagramHeader}
              className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5 font-semibold"
            >
              Save Instagram Settings
            </button>
          </div>

          {/* Instagram Posts Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 p-4 bg-card rounded-2xl border border-border">
              <div>
                <h4 className="font-display text-base text-ink font-semibold">
                  Instagram Posts & Reels Showcase ({instagramPosts.length})
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Posts rendered in the "Follow Our Journey" grid on homepage and gallery.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditingInstaPost({
                    isNew: true,
                    likes: 1200,
                    caption: "",
                    image: "",
                    url: instaHeader.url || "https://www.instagram.com/confianza_events",
                  })
                }
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Post Card</span>
              </button>
            </div>

            {instagramPosts.length === 0 ? (
              <div className="glass-card rounded-3xl p-10 text-center text-muted-foreground border border-border">
                <MessageSquareQuote className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                <h4 className="font-display text-base text-ink font-semibold">
                  No Instagram Posts Uploaded
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Click 'Add Post Card' above to upload Instagram feed items.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                {instagramPosts.map((post) => (
                  <div
                    key={post.id}
                    className="relative group rounded-2xl overflow-hidden border border-border bg-card shadow-xs"
                  >
                    <div className="aspect-square w-full overflow-hidden bg-muted/40">
                      <img
                        src={post.image}
                        alt="Instagram Post"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-2.5 bg-card text-xs">
                      <div className="flex items-center justify-between gap-1 text-[0.68rem] text-secondary font-medium">
                        <span>❤️ {post.likes || 0}</span>
                      </div>
                      <p className="text-[0.62rem] text-muted-foreground line-clamp-1 mt-1">
                        {post.caption || "Instagram Reel"}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-2 pt-1.5 border-t border-border/50">
                        <button
                          type="button"
                          onClick={() => setEditingInstaPost({ ...post })}
                          className="p-1 rounded-lg bg-accent text-foreground hover:text-secondary"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Delete this Instagram post?")) {
                              saveInstagram(instagramPosts.filter((p) => p.id !== post.id));
                            }
                          }}
                          className="p-1 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive hover:text-white"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 6: Consultation CTA Banner Customizer */}
      {subTab === "cta" && (
        <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
          <h4 className="font-display text-base text-ink font-semibold">
            Gallery Bottom Consultation CTA Banner
          </h4>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium block mb-1">Eyebrow</label>
              <input
                type="text"
                value={galleryCta.eyebrow || ""}
                onChange={(e) => setGalleryCta({ ...galleryCta, eyebrow: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Button Text</label>
              <input
                type="text"
                value={galleryCta.buttonText || ""}
                onChange={(e) => setGalleryCta({ ...galleryCta, buttonText: e.target.value })}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Headline</label>
            <input
              type="text"
              value={galleryCta.headline || ""}
              onChange={(e) => setGalleryCta({ ...galleryCta, headline: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Subtitle</label>
            <textarea
              rows={2}
              value={galleryCta.subtitle || ""}
              onChange={(e) => setGalleryCta({ ...galleryCta, subtitle: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium">Founder Perks List</label>
              <button
                type="button"
                onClick={() =>
                  setGalleryCta({
                    ...galleryCta,
                    perks: [...(galleryCta.perks || []), "New Consultation Perk"],
                  })
                }
                className="text-xs text-secondary font-semibold hover:underline cursor-pointer"
              >
                + Add Perk
              </button>
            </div>
            <div className="space-y-2">
              {(galleryCta.perks || []).map((perk, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={perk}
                    onChange={(e) => {
                      const newPerks = [...galleryCta.perks];
                      newPerks[idx] = e.target.value;
                      setGalleryCta({ ...galleryCta, perks: newPerks });
                    }}
                    className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newPerks = galleryCta.perks.filter((_, i) => i !== idx);
                      setGalleryCta({ ...galleryCta, perks: newPerks });
                    }}
                    className="p-1.5 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive hover:text-white transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={saveGalleryCta}
              className="btn-luxe gradient-royal text-primary-foreground text-xs py-2.5 px-6 font-semibold cursor-pointer"
            >
              Save Consultation CTA
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: Add/Edit Photo Modal */}
      {editingPhoto && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/80 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingPhoto.isNew) {
                saveGalleryPhotos([
                  ...gallery,
                  {
                    ...editingPhoto,
                    id: `gallery-${Date.now()}`,
                    order: Number(editingPhoto.order) || gallery.length + 1,
                  },
                ]);
              } else {
                saveGalleryPhotos(
                  gallery.map((x) => (x.id === editingPhoto.id ? editingPhoto : x))
                );
              }
              setEditingPhoto(null);
            }}
            className="glass-card max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="font-display text-lg text-ink font-semibold">
                {editingPhoto.isNew ? "Add Gallery Photo" : "Edit Photo Details"}
              </h4>
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-medium block mb-1">Photo Caption / Title</label>
              <input
                type="text"
                required
                value={editingPhoto.caption || ""}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, caption: e.target.value })}
                placeholder="e.g. Sacred Vedic Mandap with Lotus Arch"
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium block mb-1">Category</label>
                <select
                  value={editingPhoto.category || categories[1]?.name || "Mandap Architecture"}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs"
                >
                  {categories
                    .filter((c) => c.id !== "all")
                    .map((c) => (
                      <option key={c.id || c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium block mb-1">Location</label>
                <input
                  type="text"
                  value={editingPhoto.location || ""}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, location: e.target.value })}
                  placeholder="e.g. Udaipur, Rajasthan or Pune"
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs"
                />
              </div>
            </div>

            <ImageUploadField
              label="Gallery Image (Cloudinary <= 2MB)"
              value={editingPhoto.image || ""}
              onChange={(url) => setEditingPhoto({ ...editingPhoto, image: url })}
            />

            <div>
              <label className="text-xs font-medium block mb-1">Display Order #</label>
              <input
                type="number"
                value={editingPhoto.order || 1}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, order: Number(e.target.value) })}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="px-4 py-2 rounded-full border text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-6 font-semibold"
              >
                Save Photo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: Add/Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/80 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const cleanName = (editingCategory.name || "").trim();
              if (!cleanName) return;
              const cleanSlug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
              const cleanCat = {
                ...editingCategory,
                id: editingCategory.id || `cat-${Date.now()}`,
                name: cleanName,
                slug: cleanSlug,
              };

              if (editingCategory.isNew) {
                saveCategories([...categories, cleanCat]);
              } else {
                saveCategories(
                  categories.map((c) => (c.id === editingCategory.id ? cleanCat : c))
                );
              }
              setEditingCategory(null);
            }}
            className="glass-card max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-4"
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="font-display text-lg text-ink font-semibold">
                {editingCategory.isNew ? "Add New Category" : "Edit Category"}
              </h4>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-medium block mb-1">Category Name</label>
              <input
                type="text"
                required
                value={editingCategory.name || ""}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    name: e.target.value,
                  })
                }
                placeholder="e.g. Mandap Architecture"
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm focus:outline-none focus:border-secondary"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 rounded-full border text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5 font-semibold cursor-pointer"
              >
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: Add/Edit Highlight Card Modal */}
      {editingHighlight && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/80 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingHighlight.isNew) {
                saveHighlights([
                  ...highlights,
                  { ...editingHighlight, id: `highlight-${Date.now()}` },
                ]);
              } else {
                saveHighlights(
                  highlights.map((h) => (h.id === editingHighlight.id ? editingHighlight : h))
                );
              }
              setEditingHighlight(null);
            }}
            className="glass-card max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-4"
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="font-display text-lg text-ink font-semibold">
                {editingHighlight.isNew ? "Add Spatial Highlight" : "Edit Highlight"}
              </h4>
              <button
                type="button"
                onClick={() => setEditingHighlight(null)}
                className="text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-medium block mb-1">Card Title</label>
              <input
                type="text"
                required
                value={editingHighlight.title || ""}
                onChange={(e) => setEditingHighlight({ ...editingHighlight, title: e.target.value })}
                placeholder="e.g. Mandap Architecture & Vedic Sanctums"
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium block mb-1">Subtitle</label>
              <input
                type="text"
                value={editingHighlight.subtitle || ""}
                onChange={(e) => setEditingHighlight({ ...editingHighlight, subtitle: e.target.value })}
                placeholder="e.g. Auspicious Engineering & Floral Art"
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium block mb-1">Description</label>
              <textarea
                rows={3}
                required
                value={editingHighlight.description || ""}
                onChange={(e) => setEditingHighlight({ ...editingHighlight, description: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium block mb-1">Badge</label>
                <input
                  type="text"
                  value={editingHighlight.badge || ""}
                  onChange={(e) => setEditingHighlight({ ...editingHighlight, badge: e.target.value })}
                  placeholder="e.g. Vedic Precision"
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Icon</label>
                <select
                  value={editingHighlight.icon || "Sparkles"}
                  onChange={(e) => setEditingHighlight({ ...editingHighlight, icon: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs"
                >
                  <option value="Sparkles">Sparkles</option>
                  <option value="Layers">Layers</option>
                  <option value="Award">Award</option>
                  <option value="Users">Users</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingHighlight(null)}
                className="px-4 py-2 rounded-full border text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5 font-semibold"
              >
                Save Highlight
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: Add/Edit Instagram Post Modal */}
      {editingInstaPost && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/80 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!editingInstaPost.image || !editingInstaPost.image.trim()) {
                alert("Please upload or enter an image for the Instagram post card.");
                return;
              }
              const cleanPost = {
                id: editingInstaPost.id || `insta-${Date.now()}`,
                image: editingInstaPost.image.trim(),
                likes: Number(editingInstaPost.likes) || 0,
                caption: (editingInstaPost.caption || "").trim(),
                url:
                  (editingInstaPost.url || "").trim() ||
                  instaHeader.url ||
                  "https://www.instagram.com/confianza_events",
              };

              let updatedList;
              if (editingInstaPost.isNew) {
                updatedList = [...instagramPosts, cleanPost];
              } else {
                updatedList = instagramPosts.map((p) =>
                  p.id === editingInstaPost.id ? cleanPost : p
                );
              }
              saveInstagram(updatedList);
              setEditingInstaPost(null);
            }}
            className="glass-card max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-4"
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="font-display text-lg text-ink font-semibold">
                {editingInstaPost.isNew ? "Add Instagram Post" : "Edit Post Card"}
              </h4>
              <button
                type="button"
                onClick={() => setEditingInstaPost(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ImageUploadField
              label="Post Photo (Cloudinary <= 2MB)"
              value={editingInstaPost.image || ""}
              onChange={(url) => setEditingInstaPost({ ...editingInstaPost, image: url })}
            />

            <div>
              <label className="text-xs font-medium block mb-1">Likes Count</label>
              <input
                type="number"
                value={editingInstaPost.likes || 0}
                onChange={(e) =>
                  setEditingInstaPost({ ...editingInstaPost, likes: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="text-xs font-medium block mb-1">Caption / Hashtags</label>
              <input
                type="text"
                value={editingInstaPost.caption || ""}
                onChange={(e) =>
                  setEditingInstaPost({ ...editingInstaPost, caption: e.target.value })
                }
                placeholder="e.g. Mandap reveal at Lake Pichola #ConfianzaWeddings"
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="text-xs font-medium block mb-1">Post / Reel Link (Optional)</label>
              <input
                type="text"
                value={editingInstaPost.url || ""}
                onChange={(e) =>
                  setEditingInstaPost({ ...editingInstaPost, url: e.target.value })
                }
                placeholder="https://www.instagram.com/p/..."
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs focus:outline-none focus:border-secondary"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setEditingInstaPost(null)}
                className="px-4 py-2 rounded-full border text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5 font-semibold cursor-pointer"
              >
                Save Post
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// MODULE 8: Testimonials & Review Moderation Suite
// -------------------------------------------------------------
function TestimonialsEditorModule({ site, showSaved }) {
  const [subTab, setSubTab] = useState("moderation");
  const [isSaving, setIsSaving] = useState(false);

  // Local state for all reviews (both pending and approved) with immediate optimistic updates
  const [allReviews, setAllReviews] = useState(site.allTestimonials || site.testimonials || []);

  useEffect(() => {
    if (site.allTestimonials || site.testimonials) {
      setAllReviews(site.allTestimonials || site.testimonials || []);
    }
  }, [site.allTestimonials, site.testimonials]);

  const pendingReviews = allReviews.filter((t) => t.status === "pending");
  const publishedReviews = allReviews.filter((t) => t.status === "approved" || !t.status);

  // Search and Filter states for Published Tab
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Editing state for Reviews
  const [editingReview, setEditingReview] = useState(null);

  // Header Banner & Trust Stats
  const [headerData, setHeaderData] = useState({
    badge: site.testimonialsHeader?.badge || "Couples & Families",
    eyebrow: site.testimonialsHeader?.eyebrow || "Words of Gratitude",
    title: site.testimonialsHeader?.title || "Testimonials & Love Stories",
    subtitle:
      site.testimonialsHeader?.subtitle ||
      "Read first-hand accounts of couples and families who entrusted their most sacred days to Confianza's care and aesthetic vision.",
    image:
      site.testimonialsHeader?.image ||
      "https://res.cloudinary.com/tridevsosync/image/upload/v1790838224/confianza_portfolio/portfolio_hero_banner.jpg",
    stats: site.testimonialsHeader?.stats || [
      "5.0 Average Couple Rating ★",
      "500+ Celebrations Across India",
      "100% On-Time Cue Execution",
      "0% Day-Of Stress with Shadow Management",
    ],
  });

  // Categories
  const [categories, setCategories] = useState(
    site.testimonialsCategories || [
      { id: "royal-destination", name: "Royal & Destination Weddings", slug: "royal-destination", order: 1 },
      { id: "mandap-rituals", name: "Mandap & Rituals", slug: "mandap-rituals", order: 2 },
      { id: "haldi-sangeet", name: "Haldi & Sangeet", slug: "haldi-sangeet", order: 3 },
      { id: "receptions", name: "Opulent Receptions", slug: "receptions", order: 4 },
      { id: "video-reviews", name: "Video Reviews & Reels", slug: "video-reviews", order: 5 },
      { id: "corporate-events", name: "Corporate Celebrations", slug: "corporate-events", order: 6 },
    ]
  );
  const [editingCategory, setEditingCategory] = useState(null);

  // Experience Pillars from PDF
  const [experiencePillars, setExperiencePillars] = useState(
    site.testimonialsExperience || [
      {
        id: "shadow-mgmt",
        title: "Shadow Management",
        subtitle: "Dedicated Bride & Groom Liaison",
        description:
          "A personal shadow coordinator attends to every personal need, attire touch-up, refreshment, and family coordination behind the scenes.",
        icon: "Users",
        badge: "Signature Care",
      },
      {
        id: "ritual-mgmt",
        title: "Sacred Ritual Coordination",
        subtitle: "Flawless Pandit & Samagri Prep",
        description:
          "Complete management of traditional Vedic rituals (Baraat, Milni, Saptapadi, Havan) ensuring exact customs and priest requirements are honored.",
        icon: "Sparkles",
        badge: "Cultural Precision",
      },
      {
        id: "production-decor",
        title: "3D CAD Decor & Production",
        subtitle: "100% Design-to-Reality Fidelity",
        description:
          "From custom stage carpentry to imported floral conditioning and ambient warm lighting, every spatial element matches the 3D CAD design.",
        icon: "Layers",
        badge: "Spatial Artistry",
      },
      {
        id: "show-runner",
        title: "Show Runner Timeline Execution",
        subtitle: "Zero-Glitch Stage Management",
        description:
          "The Show Runner acts as the single point-of-contact for artists, DJs, sound technicians, and entry pyrotechnics with millisecond timing.",
        icon: "Award",
        badge: "Live Direction",
      },
    ]
  );

  // FAQs
  const [faqs, setFaqs] = useState(
    site.testimonialsFaq || [
      {
        question: "How do I submit our wedding review and photographs?",
        answer:
          "Click the 'Share Your Love Story' button on this page. You can share your story, select your star rating, and upload your high-resolution wedding photos directly from your phone or computer.",
      },
      {
        question: "Can we include our cinematic wedding teaser or Instagram Reel?",
        answer:
          "Yes! You can paste your YouTube, Vimeo, Google Drive, or Instagram Reel link in the video link field. Our team will feature the interactive video player on your review card.",
      },
      {
        question: "Why does my review say 'Awaiting Admin Moderation'?",
        answer:
          "To protect client privacy and ensure genuine testimonials, all public submissions are reviewed and verified by Ashish Wankhede & the Confianza editorial team before going live.",
      },
      {
        question: "How long does review verification take?",
        answer: "Our team typically verifies and publishes new couple stories within 12 to 24 hours.",
      },
    ]
  );

  // 1-Click Moderation Actions
  const handleModerate = async (action, id, data = null) => {
    try {
      if (action === "delete") {
        setAllReviews((prev) => prev.filter((r) => r.id !== id && r._id !== id));
      } else if (action === "approve") {
        setAllReviews((prev) =>
          prev.map((r) =>
            r.id === id || r._id === id ? { ...r, status: "approved" } : r
          )
        );
      }
      const res = await fetch("/api/testimonials/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id, data }),
      });
      if (res.ok) {
        showSaved();
        if (typeof site.refreshData === "function") {
          await site.refreshData({ fresh: true, includeInquiries: true });
        } else if (typeof site.refresh === "function") {
          await site.refresh({ fresh: true, includeInquiries: true });
        }
      }
    } catch (err) {
      console.error("Moderation action failed:", err);
    }
  };

  // Save Reviews List
  const saveReviewsList = async (newList) => {
    setIsSaving(true);
    setAllReviews(newList);
    await site.update("testimonials", newList);
    setIsSaving(false);
    showSaved();
  };

  // Save Header & Trust Stats
  const saveHeader = async (newHeader) => {
    setIsSaving(true);
    await site.update("testimonialsHeader", newHeader);
    setIsSaving(false);
    showSaved();
  };

  // Save Categories
  const saveCategories = async (newCategories) => {
    setIsSaving(true);
    await site.update("testimonialsCategories", newCategories);
    setIsSaving(false);
    showSaved();
  };

  // Save Experience & FAQs
  const saveExperienceAndFaqs = async () => {
    setIsSaving(true);
    await site.update("testimonialsExperience", experiencePillars);
    await site.update("testimonialsFaq", faqs);
    setIsSaving(false);
    showSaved();
  };

  // Filtered Published Reviews
  const filteredPublished = publishedReviews.filter((t) => {
    if (selectedCategory !== "All") {
      if (selectedCategory === "Video Reviews & Reels") {
        if (!t.videoUrl) return false;
      } else {
        const cat = t.category || "";
        if (cat.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nMatch = (t.name || "").toLowerCase().includes(q);
      const lMatch = (t.location || "").toLowerCase().includes(q);
      const txtMatch = (t.text || "").toLowerCase().includes(q);
      if (!nMatch && !lMatch && !txtMatch) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab("moderation")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
              subTab === "moderation"
                ? "gradient-royal text-primary-foreground shadow-md"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-secondary" />
            <span>Pending Moderation Queue</span>
            {pendingReviews.length > 0 && (
              <span className="h-5 px-1.5 rounded-full gradient-gold text-ink text-[0.65rem] font-bold flex items-center justify-center animate-pulse">
                {pendingReviews.length} New
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSubTab("published")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
              subTab === "published"
                ? "gradient-royal text-primary-foreground shadow-md"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <CheckCircle className="h-3.5 w-3.5 text-secondary" />
            <span>Published Reviews ({publishedReviews.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("header")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
              subTab === "header"
                ? "gradient-royal text-primary-foreground shadow-md"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sliders className="h-3.5 w-3.5 text-secondary" />
            <span>Hero Banner &amp; Trust Stats</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("categories")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
              subTab === "categories"
                ? "gradient-royal text-primary-foreground shadow-md"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-secondary" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("experience-faq")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
              subTab === "experience-faq"
                ? "gradient-royal text-primary-foreground shadow-md"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <Award className="h-3.5 w-3.5 text-secondary" />
            <span>Care Pillars &amp; FAQ</span>
          </button>
        </div>
        <ModuleRefreshButton site={site} showSaved={showSaved} label="Refresh Testimonials" />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 1: PENDING MODERATION QUEUE */}
      {/* ------------------------------------------------------------- */}
      {subTab === "moderation" && (
        <div className="space-y-6 animate-fade-in">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-border/60">
              <div>
                <h3 className="font-display text-xl text-ink font-bold flex items-center gap-2">
                  <span>Public Review Submissions Awaiting Approval</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full gradient-royal text-primary-foreground">
                    {pendingReviews.length} Pending
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Reviews submitted by couples &amp; guests from <span className="text-primary font-semibold">/testimonials</span>. Once approved, they go live on the website.
                </p>
              </div>
              <ModuleRefreshButton site={site} showSaved={showSaved} label="Refresh Queue" />
            </div>

            {pendingReviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground bg-card/30 space-y-2">
                <CheckCircle2 className="h-10 w-10 mx-auto text-secondary" />
                <p className="font-display text-base text-ink font-semibold">
                  Moderation Queue is Clear!
                </p>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  All submitted couple stories have been reviewed. New public reviews submitted on the site will appear here for 1-click verification.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingReviews.map((rev) => (
                  <div
                    key={rev.id || rev._id}
                    className="glass-card rounded-2xl p-6 border-2 border-secondary/40 bg-secondary/5 space-y-4 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-border">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={rev.image || "https://res.cloudinary.com/tridevsosync/image/upload/v1790838237/confianza_portfolio/testimonial_ananya_rohit_roy.jpg"}
                          alt={rev.name}
                          className="h-14 w-14 rounded-full object-cover ring-2 ring-secondary shadow-sm"
                          onError={(e) => {
                            e.currentTarget.src = "https://res.cloudinary.com/tridevsosync/image/upload/v1790838237/confianza_portfolio/testimonial_ananya_rohit_roy.jpg";
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-display text-base font-bold text-ink">{rev.name}</h4>
                            <span className="rounded-full bg-secondary/20 text-secondary text-[0.65rem] font-bold px-2 py-0.5">
                              Pending Review
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <span className="text-primary font-medium">{rev.relationship || "Bride & Groom"}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-secondary" />
                              {rev.location || "Pune"}
                            </span>
                            <span>•</span>
                            <span>{rev.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: rev.rating || 5 }).map((_, sIdx) => (
                          <Star key={sIdx} className="h-4 w-4 fill-secondary text-secondary" />
                        ))}
                        <span className="ml-1 text-xs font-bold text-ink">({rev.rating || 5}.0)</span>
                      </div>
                    </div>

                    {/* Review Quote */}
                    <div className="p-3.5 rounded-xl bg-card border border-border/80 text-xs sm:text-sm text-foreground italic leading-relaxed">
                      "{rev.text}"
                    </div>

                    {/* Meta info & Video Link */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-md text-[0.68rem] font-semibold">
                          Category: {rev.category || "General"}
                        </span>
                        {rev.videoUrl && (
                          <a
                            href={rev.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-secondary font-bold hover:underline"
                          >
                            <Play className="h-3 w-3" />
                            <span>Watch Video Link</span>
                          </a>
                        )}
                        {rev.email && <span>Email: {rev.email}</span>}
                      </div>

                      {/* 1-Click Moderation Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingReview({ ...rev, isModerationEdit: true })}
                          className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-xs text-primary font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Edit Details</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Reject and delete review from "${rev.name}"?`)) {
                              handleModerate("delete", rev.id || rev._id);
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg border border-destructive/30 hover:bg-destructive/10 text-xs text-destructive font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleModerate("approve", rev.id || rev._id)}
                          className="btn-luxe gradient-royal text-primary-foreground text-xs py-1.5 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md font-bold"
                        >
                          <Check className="h-4 w-4 text-secondary" />
                          <span>Approve &amp; Publish</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 2: PUBLISHED REVIEWS CRUD */}
      {/* ------------------------------------------------------------- */}
      {subTab === "published" && (
        <div className="space-y-6 animate-fade-in">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-border/60">
              <div>
                <h3 className="font-display text-xl text-ink font-bold">
                  Published Live Testimonials ({publishedReviews.length})
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Currently active couple stories rendered on <span className="text-primary font-semibold">/testimonials</span>, <span className="text-primary font-semibold">/portfolio</span>, and the Homepage.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <ModuleRefreshButton site={site} showSaved={showSaved} label="Refresh Reviews" />
                <button
                  type="button"
                  onClick={() =>
                    setEditingReview({
                    isNew: true,
                    name: "",
                    partnerName: "",
                    relationship: "Bride & Groom",
                    location: "Pune",
                    date: "2026",
                    rating: 5,
                    category: categories[0]?.name || "Royal & Destination Weddings",
                    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790838237/confianza_portfolio/testimonial_ananya_rohit_roy.jpg",
                    videoUrl: "",
                    text: "",
                    featured: true,
                    status: "approved",
                  })
                }
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2.5 px-5 flex items-center gap-2 cursor-pointer shadow-luxe"
              >
                <Plus className="h-4 w-4 text-secondary" />
                <span>Add New Review</span>
              </button>
            </div>
          </div>

          {/* Filter & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter by couple name or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card pl-9 pr-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {["All", ...categories.map((c) => (typeof c === "string" ? c : c.name))].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs transition cursor-pointer shrink-0 ${
                      selectedCategory === cat
                        ? "gradient-royal text-primary-foreground font-semibold"
                        : "border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Reviews Grid */}
            {publishedReviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground bg-card/30 space-y-2">
                <Quote className="h-10 w-10 mx-auto text-secondary/60 mb-2" />
                <p className="font-display text-base text-ink font-semibold">0 Published Reviews in Database</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click "Add New Review" above or approve pending submissions in the Moderation Queue.
                </p>
              </div>
            ) : filteredPublished.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground rounded-2xl bg-card/30 border border-border">
                <p className="text-xs">No reviews matching your filter criteria.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="mt-2 text-xs text-primary font-semibold hover:underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredPublished.map((t, idx) => (
                  <div
                    key={t.id || t._id || idx}
                    className="glass-card rounded-2xl p-5 border border-border flex flex-col justify-between hover:shadow-md transition group space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-border/60">
                        <div className="flex items-center gap-3">
                          <img
                            src={t.image || "https://res.cloudinary.com/tridevsosync/image/upload/v1790838237/confianza_portfolio/testimonial_ananya_rohit_roy.jpg"}
                            alt={t.name}
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-secondary/50"
                            onError={(e) => {
                              e.currentTarget.src = "https://res.cloudinary.com/tridevsosync/image/upload/v1790838237/confianza_portfolio/testimonial_ananya_rohit_roy.jpg";
                            }}
                          />
                          <div>
                            <h4 className="font-display text-base font-bold text-ink">{t.name}</h4>
                            <div className="flex items-center gap-2 text-[0.68rem] text-muted-foreground mt-0.5">
                              <span className="text-primary font-medium">{t.relationship || "Bride & Groom"}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-secondary" />
                                {t.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: t.rating || 5 }).map((_, sIdx) => (
                            <Star key={sIdx} className="h-3.5 w-3.5 fill-secondary text-secondary" />
                          ))}
                        </div>
                      </div>

                      {t.category && (
                        <span className="inline-block mt-2 text-[0.65rem] uppercase tracking-wider text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded">
                          {t.category}
                        </span>
                      )}

                      <p className="text-xs text-foreground/85 italic leading-relaxed mt-2">
                        "{t.text}"
                      </p>

                      {t.videoUrl && (
                        <div className="mt-2 flex items-center gap-1 text-[0.68rem] text-secondary font-semibold">
                          <Play className="h-3 w-3" />
                          <span className="truncate max-w-xs">{t.videoUrl}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                      <span className="text-[0.65rem] text-muted-foreground font-mono">
                        Date: {t.date || "2026"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingReview({ ...t })}
                          className="p-1.5 rounded-lg border border-border hover:bg-muted text-xs text-primary flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete review from "${t.name}"?`)) {
                              const updated = allReviews.filter((x) => (x.id || x._id) !== (t.id || t._id));
                              saveReviewsList(updated);
                            }
                          }}
                          className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-destructive text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 3: HERO BANNER & TRUST STATS */}
      {/* ------------------------------------------------------------- */}
      {subTab === "header" && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Form Editor */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveHeader(headerData);
              }}
              className="lg:col-span-6 glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <div className="flex items-center gap-1.5 text-primary text-xs uppercase tracking-[0.25em] font-bold">
                    <Sparkles className="h-4 w-4 text-secondary" />
                    <span>Testimonials Hero Banner</span>
                  </div>
                  <h3 className="font-display text-xl text-ink font-bold mt-1">Page Hero &amp; Trust Strip</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Customize the hero header, cover image, and trust metrics on <span className="text-primary font-semibold">/testimonials</span>.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Eyebrow Badge Pill
                </label>
                <input
                  type="text"
                  required
                  value={headerData.badge || ""}
                  onChange={(e) => setHeaderData({ ...headerData, badge: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs"
                  placeholder="e.g. Couples & Families"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Main Page Heading
                </label>
                <input
                  type="text"
                  required
                  value={headerData.title || ""}
                  onChange={(e) => setHeaderData({ ...headerData, title: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold"
                  placeholder="e.g. Testimonials & Love Stories"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Subtitle Narrative
                </label>
                <textarea
                  rows={3}
                  required
                  value={headerData.subtitle || ""}
                  onChange={(e) => setHeaderData({ ...headerData, subtitle: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs leading-relaxed"
                  placeholder="Read first-hand accounts of couples and families..."
                />
              </div>

              <ImageUploadField
                label="Header Background Cover Image"
                value={headerData.image || "https://res.cloudinary.com/tridevsosync/image/upload/v1790838224/confianza_portfolio/portfolio_hero_banner.jpg"}
                onChange={(url) => setHeaderData({ ...headerData, image: url })}
              />

              {/* Highlight Metric Pills */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-foreground">
                    Trust Metric Tags (Pills)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setHeaderData({
                        ...headerData,
                        stats: [...(headerData.stats || []), "New Trust Metric"],
                      })
                    }
                    className="text-[0.7rem] text-primary font-bold hover:underline cursor-pointer"
                  >
                    + Add Metric
                  </button>
                </div>

                <div className="space-y-2">
                  {(headerData.stats || []).map((stat, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={stat}
                        onChange={(e) => {
                          const updated = [...headerData.stats];
                          updated[sIdx] = e.target.value;
                          setHeaderData({ ...headerData, stats: updated });
                        }}
                        className="flex-1 rounded-xl border border-border bg-card px-3 py-1.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = headerData.stats.filter((_, i) => i !== sIdx);
                          setHeaderData({ ...headerData, stats: updated });
                        }}
                        className="text-destructive p-1 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-luxe gradient-royal w-full text-primary-foreground text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 text-secondary" />
                      <span>Save Hero Banner Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Real-time Preview */}
            <div className="lg:col-span-6 space-y-3 sticky top-6">
              <div className="flex items-center justify-between px-2">
                <span className="text-[0.68rem] uppercase tracking-[0.25em] text-primary font-bold flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-secondary" /> Live /testimonials Hero Preview
                </span>
              </div>

              <div className="relative bg-ink rounded-3xl p-8 sm:p-10 text-background overflow-hidden border border-secondary/30 shadow-2xl text-center">
                <div className="absolute inset-0 z-0 opacity-25">
                  <img
                    src={headerData.image || "https://res.cloudinary.com/tridevsosync/image/upload/v1790838224/confianza_portfolio/portfolio_hero_banner.jpg"}
                    alt="Testimonials Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://res.cloudinary.com/tridevsosync/image/upload/v1790838224/confianza_portfolio/portfolio_hero_banner.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
                </div>

                <div className="relative z-10 space-y-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3.5 py-1 text-[0.68rem] uppercase tracking-[0.3em] text-secondary font-medium backdrop-blur-md">
                    <Sparkles className="h-3 w-3 text-secondary" />
                    <span>{headerData.badge || "Couples & Families"}</span>
                  </span>

                  <h1 className="font-display text-2xl sm:text-3xl text-white font-normal leading-tight">
                    {headerData.title || "Testimonials & Love Stories"}
                  </h1>

                  <div className="rule-gold mx-auto my-3" />

                  <p className="text-xs sm:text-sm text-background/80 font-light leading-relaxed max-w-md mx-auto">
                    {headerData.subtitle}
                  </p>

                  {Array.isArray(headerData.stats) && headerData.stats.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      {headerData.stats.map((stat, sIdx) => (
                        <span
                          key={sIdx}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[0.68rem] text-champagne backdrop-blur-md border border-white/15"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                          <span>{stat}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 4: CATEGORIES MANAGER */}
      {/* ------------------------------------------------------------- */}
      {subTab === "categories" && (
        <div className="space-y-6 animate-fade-in">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-border/60">
              <div>
                <h3 className="font-display text-xl text-ink font-bold">
                  Testimonials Category Filter Pills ({categories.length})
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage the filter pills displayed on the public <span className="text-primary font-semibold">/testimonials</span> page.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingCategory({
                    isNew: true,
                    name: "",
                    slug: "",
                    order: categories.length + 1,
                  })
                }
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2.5 px-4 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Plus className="h-4 w-4 text-secondary" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat, idx) => {
                const cName = typeof cat === "string" ? cat : cat.name || cat.label;
                const cId = typeof cat === "string" ? `cat-${idx}` : cat.id || `cat-${idx}`;
                const count = allReviews.filter(
                  (t) => t.category && t.category.toLowerCase() === cName.toLowerCase()
                ).length;

                return (
                  <div
                    key={cId}
                    className="glass-card rounded-2xl p-4 border border-border flex items-center justify-between gap-3 hover:shadow-sm transition"
                  >
                    <div className="truncate">
                      <h4 className="font-display text-sm font-bold text-ink truncate">{cName}</h4>
                      <span className="text-[0.68rem] text-muted-foreground font-medium">
                        {count} linked {count === 1 ? "review" : "reviews"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingCategory({
                            isNew: false,
                            _origName: cName,
                            name: cName,
                            id: cId,
                          })
                        }
                        className="p-1.5 rounded-lg border border-border hover:bg-muted text-xs text-primary cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete category "${cName}"?`)) {
                            const updated = categories.filter((_, i) => i !== idx);
                            saveCategories(updated);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-destructive text-xs cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add / Edit Category Modal */}
          {editingCategory && (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/80 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const cleanName = editingCategory.name.trim();
                  if (!cleanName) return;

                  const cleanCat = {
                    id: editingCategory.id || `cat-${Date.now()}`,
                    name: cleanName,
                    slug: cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                  };

                  let updated;
                  if (editingCategory.isNew) {
                    updated = [...categories, cleanCat];
                  } else {
                    updated = categories.map((c) => {
                      const currName = typeof c === "string" ? c : c.name || c.label;
                      if (currName === editingCategory._origName) return cleanCat;
                      return c;
                    });
                  }
                  saveCategories(updated);
                  setEditingCategory(null);
                }}
                className="glass-card max-w-sm w-full rounded-3xl p-6 space-y-4"
              >
                <div className="flex justify-between items-center border-b pb-3">
                  <h4 className="font-display text-base text-ink font-bold">
                    {editingCategory.isNew ? "Add Category" : "Edit Category"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Category Name / Label
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs"
                    placeholder="e.g. Royal Baraat &amp; Entry"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="px-4 py-2 rounded-full border text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5 cursor-pointer"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 5: CARE EXPERIENCE & FAQ EDITOR */}
      {/* ------------------------------------------------------------- */}
      {subTab === "experience-faq" && (
        <div className="space-y-6 animate-fade-in">
          {/* Experience Pillars */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-border/60">
              <div>
                <h3 className="font-display text-xl text-ink font-bold">
                  The Confianza Experience Pillars (PDF Service Ethos)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Core management pillars extracted from Confianza's official service manual.
                </p>
              </div>

              <button
                type="button"
                onClick={saveExperienceAndFaqs}
                disabled={isSaving}
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2.5 px-5 flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-60"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 text-secondary" />}
                <span>Save Pillars &amp; FAQ</span>
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {experiencePillars.map((pillar, pIdx) => (
                <div key={pIdx} className="p-4 rounded-2xl bg-card border border-border space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="font-semibold block mb-1">Pillar Title</label>
                      <input
                        type="text"
                        value={pillar.title}
                        onChange={(e) => {
                          const updated = [...experiencePillars];
                          updated[pIdx].title = e.target.value;
                          setExperiencePillars(updated);
                        }}
                        className="w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={pillar.badge || ""}
                        onChange={(e) => {
                          const updated = [...experiencePillars];
                          updated[pIdx].badge = e.target.value;
                          setExperiencePillars(updated);
                        }}
                        className="w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="font-semibold block mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={pillar.subtitle || ""}
                      onChange={(e) => {
                        const updated = [...experiencePillars];
                        updated[pIdx].subtitle = e.target.value;
                        setExperiencePillars(updated);
                      }}
                      className="w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs"
                    />
                  </div>

                  <div className="text-xs">
                    <label className="font-semibold block mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={pillar.description}
                      onChange={(e) => {
                        const updated = [...experiencePillars];
                        updated[pIdx].description = e.target.value;
                        setExperiencePillars(updated);
                      }}
                      className="w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs Editor */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-border/60">
              <div>
                <h3 className="font-display text-xl text-ink font-bold">
                  Testimonials FAQ Manager ({faqs.length})
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Frequently asked questions regarding wedding review submissions, videos, and photos.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFaqs([
                    ...faqs,
                    {
                      question: "New Question?",
                      answer: "New answer explanation...",
                    },
                  ])
                }
                className="text-xs text-primary font-bold hover:underline cursor-pointer"
              >
                + Add FAQ Item
              </button>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, fIdx) => (
                <div key={fIdx} className="p-4 rounded-2xl bg-card border border-border space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const updated = [...faqs];
                        updated[fIdx].question = e.target.value;
                        setFaqs(updated);
                      }}
                      className="flex-1 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold"
                      placeholder="Question..."
                    />
                    <button
                      type="button"
                      onClick={() => setFaqs(faqs.filter((_, i) => i !== fIdx))}
                      className="text-destructive p-1 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[fIdx].answer = e.target.value;
                      setFaqs(updated);
                    }}
                    className="w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs leading-relaxed"
                    placeholder="Answer..."
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* REVIEW ADD / EDIT MODAL */}
      {/* ============================================================= */}
      {editingReview && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/80 p-4 animate-fade-in">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const cleanReview = {
                ...editingReview,
                id: editingReview.id || `review-${Date.now()}`,
                status: editingReview.status || "approved",
              };
              delete cleanReview.isNew;
              delete cleanReview.isModerationEdit;
              delete cleanReview._customRelMode;
              delete cleanReview._customCatMode;

              if (editingReview.isModerationEdit) {
                // Moderate update & approve
                handleModerate("update", editingReview.id || editingReview._id, {
                  ...cleanReview,
                  status: "approved",
                });
              } else {
                let updated;
                if (editingReview.isNew) {
                  updated = [cleanReview, ...allReviews];
                } else {
                  updated = allReviews.map((x) =>
                    (x.id && x.id === editingReview.id) || (x._id && x._id === editingReview._id)
                      ? cleanReview
                      : x
                  );
                }
                saveReviewsList(updated);
              }
              setEditingReview(null);
            }}
            className="glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 space-y-4"
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="font-display text-lg text-ink font-bold">
                {editingReview.isNew
                  ? "Add New Client Review"
                  : editingReview.isModerationEdit
                  ? "Edit & Approve Submission"
                  : "Edit Review"}
              </h4>
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">Couple / Client Name *</label>
                <input
                  type="text"
                  required
                  value={editingReview.name || ""}
                  onChange={(e) => setEditingReview({ ...editingReview, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold"
                  placeholder="e.g. Ananya & Rohit Roy"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Relationship / Role</label>
                {(() => {
                  const standardRoles = [
                    "Bride & Groom",
                    "Parents of the Bride",
                    "Parents of the Groom",
                    "Family Member / Relative",
                    "Wedding Guest",
                    "Corporate Host",
                  ];
                  const currentRel = editingReview.relationship || "Bride & Groom";
                  const isStandard = standardRoles.includes(currentRel);
                  const isOtherSelected = editingReview._customRelMode || (!isStandard && currentRel !== "");

                  return (
                    <div className="space-y-1.5">
                      <select
                        value={isOtherSelected ? "Other" : currentRel}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "Other") {
                            setEditingReview({
                              ...editingReview,
                              _customRelMode: true,
                              relationship: isStandard ? "" : currentRel,
                            });
                          } else {
                            setEditingReview({
                              ...editingReview,
                              _customRelMode: false,
                              relationship: val,
                            });
                          }
                        }}
                        className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs cursor-pointer"
                      >
                        {standardRoles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                        <option value="Other">Other</option>
                      </select>

                      {isOtherSelected && (
                        <input
                          type="text"
                          required
                          value={editingReview.relationship || ""}
                          onChange={(e) => setEditingReview({ ...editingReview, relationship: e.target.value })}
                          className="w-full rounded-xl border border-secondary/60 bg-card px-3.5 py-2 text-xs ring-1 ring-secondary/20 animate-fade-in"
                          placeholder="e.g. Sister of the Bride, Family Friend, Groom's Cousin"
                        />
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">Event Category</label>
                {(() => {
                  const catNames = categories.map((c) => (typeof c === "string" ? c : c.name || c.label)).filter(Boolean);
                  const currentCat = editingReview.category || catNames[0] || "Royal & Destination Weddings";
                  const isStandard = catNames.includes(currentCat);
                  const isOtherSelected = editingReview._customCatMode || (!isStandard && currentCat !== "");

                  return (
                    <div className="space-y-1.5">
                      <select
                        value={isOtherSelected ? "Other" : currentCat}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "Other") {
                            setEditingReview({
                              ...editingReview,
                              _customCatMode: true,
                              category: isStandard ? "" : currentCat,
                            });
                          } else {
                            setEditingReview({
                              ...editingReview,
                              _customCatMode: false,
                              category: val,
                            });
                          }
                        }}
                        className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs cursor-pointer"
                      >
                        {catNames.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                        <option value="Other">Other</option>
                      </select>

                      {isOtherSelected && (
                        <input
                          type="text"
                          required
                          value={editingReview.category || ""}
                          onChange={(e) => setEditingReview({ ...editingReview, category: e.target.value })}
                          className="w-full rounded-xl border border-secondary/60 bg-card px-3.5 py-2 text-xs ring-1 ring-secondary/20 animate-fade-in"
                          placeholder="e.g. Sangeet Gala, Engagement, Anniversary Banquet"
                        />
                      )}
                    </div>
                  );
                })()}
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Venue / City Location</label>
                <input
                  type="text"
                  value={editingReview.location || ""}
                  onChange={(e) => setEditingReview({ ...editingReview, location: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs"
                  placeholder="e.g. Udaipur Destination Wedding"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">Star Rating (0 to 5)</label>
                <select
                  value={editingReview.rating || 5}
                  onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs cursor-pointer font-semibold"
                >
                  <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                  <option value={4}>★★★★☆ (4 Stars - Wonderful)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Good)</option>
                  <option value={2}>★★☆☆☆ (2 Stars - Average)</option>
                  <option value={1}>★☆☆☆☆ (1 Star)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Date / Year</label>
                <input
                  type="text"
                  value={editingReview.date || ""}
                  onChange={(e) => setEditingReview({ ...editingReview, date: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs"
                  placeholder="e.g. November 2025"
                />
              </div>
            </div>

            <ImageUploadField
              label="Couple Photograph"
              value={editingReview.image || ""}
              onChange={(url) => setEditingReview({ ...editingReview, image: url })}
            />

            <div className="text-xs">
              <label className="font-semibold text-foreground block mb-1">Video Testimonial Link (Optional)</label>
              <input
                type="url"
                value={editingReview.videoUrl || ""}
                onChange={(e) => setEditingReview({ ...editingReview, videoUrl: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-mono"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div className="text-xs">
              <label className="font-semibold text-foreground block mb-1">Review Quote / Love Story Narrative *</label>
              <textarea
                rows={4}
                required
                value={editingReview.text || ""}
                onChange={(e) => setEditingReview({ ...editingReview, text: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs leading-relaxed"
                placeholder="Enter what the couple said about their wedding..."
              />
            </div>

            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rev-featured"
                  checked={Boolean(editingReview.featured)}
                  onChange={(e) => setEditingReview({ ...editingReview, featured: e.target.checked })}
                  className="rounded border-border text-secondary focus:ring-secondary cursor-pointer h-4 w-4"
                />
                <label htmlFor="rev-featured" className="text-xs font-semibold text-foreground cursor-pointer">
                  Featured Review
                </label>
              </div>

              {editingReview.status === "pending" && (
                <span className="text-[0.68rem] text-secondary font-bold bg-secondary/10 px-2 py-0.5 rounded">
                  Will be approved &amp; published on save
                </span>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="px-4 py-2 rounded-full border text-xs cursor-pointer hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-6 rounded-full cursor-pointer shadow-md font-bold"
              >
                {editingReview.isModerationEdit ? "Save & Approve" : "Save Review"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 11: Team Editor
// -------------------------------------------------------------
function TeamEditorModule({ site, showSaved }) {
  const [team, setTeam] = useState(site.team || []);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    setTeam(site.team || []);
  }, [site.team]);

  const saveTeam = (newList) => {
    setTeam(newList);
    site.update("team", newList);
    showSaved();
  };

  const deleteMember = (id) => {
    if (window.confirm("Remove this team member?")) {
      const updated = team.filter((m) => (m.id || m._id) !== id);
      saveTeam(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-xl text-ink font-semibold">Executive Team Members ({team.length})</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage visionaries &amp; coordinators displayed on the homepage and about page.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <ModuleRefreshButton site={site} showSaved={showSaved} label="Refresh Team" />
          <button
            type="button"
            onClick={() =>
              setEditingMember({
                name: "",
                role: "",
                email: "",
                experience: "4+ Years",
                specialties: [],
                specialtiesText: "",
                bio: "",
                image: "",
                isNew: true,
              })
            }
            className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {team.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          <Users className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-semibold">No team members added yet.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Click "Add Member" above to create your first team card.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m, idx) => (
            <div
              key={m.id || m._id || idx}
              className="glass-card rounded-2xl p-5 border border-border space-y-3 relative group"
            >
              <div className="relative h-44 w-full rounded-xl overflow-hidden bg-accent/20">
                <img
                  src={m.image || "/team/default.jpg"}
                  alt={m.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <h4 className="font-display text-base font-bold text-ink">{m.name}</h4>
                <span className="text-xs text-primary font-semibold block">{m.role}</span>
                {m.email && (
                  <span className="text-[0.68rem] text-muted-foreground block mt-0.5">
                    ✉ {m.email}
                  </span>
                )}
                {m.experience && (
                  <span className="text-[0.68rem] text-secondary font-medium block mt-0.5">
                    ★ {m.experience}
                  </span>
                )}
              </div>

              {m.bio && (
                <p className="text-xs text-foreground/80 line-clamp-2 italic">
                  "{m.bio}"
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
                <button
                  type="button"
                  onClick={() =>
                    setEditingMember({
                      ...m,
                      specialtiesText: Array.isArray(m.specialties)
                        ? m.specialties.join(", ")
                        : m.specialties || "",
                    })
                  }
                  className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-accent/40 transition"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteMember(m.id || m._id)}
                  className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition"
                  title="Delete Member"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Member Add/Edit Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-ink/80 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const specsArray = typeof editingMember.specialtiesText === "string"
                ? editingMember.specialtiesText.split(",").map((s) => s.trim()).filter(Boolean)
                : editingMember.specialties || [];

              const cleanMember = {
                ...editingMember,
                id: editingMember.id || Date.now(),
                specialties: specsArray,
              };
              delete cleanMember.specialtiesText;
              delete cleanMember.isNew;

              let updated;
              if (editingMember.isNew) {
                updated = [...team, cleanMember];
              } else {
                updated = team.map((m) =>
                  (m.id && m.id === editingMember.id) || (m._id && m._id === editingMember._id)
                    ? cleanMember
                    : m
                );
              }
              saveTeam(updated);
              setEditingMember(null);
            }}
            className="glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="font-display text-lg text-ink font-bold">
                {editingMember.isNew ? "Add Team Member" : "Edit Team Member"}
              </h4>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ImageUploadField
              label="Profile Photo"
              value={editingMember.image || ""}
              onChange={(url) => setEditingMember({ ...editingMember, image: url })}
            />

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingMember.name || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2"
                  placeholder="e.g. Radhika Deshmukh"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Designation / Role</label>
                <input
                  type="text"
                  required
                  value={editingMember.role || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2"
                  placeholder="e.g. Lead Floral Architect"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={editingMember.email || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2"
                  placeholder="name@confianzaevents.com"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Experience</label>
                <input
                  type="text"
                  value={editingMember.experience || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, experience: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2"
                  placeholder="e.g. 6+ Years"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="font-semibold text-foreground block mb-1">
                Specialties &amp; Domain (comma-separated)
              </label>
              <input
                type="text"
                value={
                  editingMember.specialtiesText !== undefined
                    ? editingMember.specialtiesText
                    : Array.isArray(editingMember.specialties)
                    ? editingMember.specialties.join(", ")
                    : ""
                }
                onChange={(e) =>
                  setEditingMember({ ...editingMember, specialtiesText: e.target.value })
                }
                className="w-full rounded-xl border border-border bg-card px-3 py-2"
                placeholder="Luxury Decor, Spatial Design, Guest Concierge"
              />
            </div>

            <div className="text-xs">
              <label className="font-semibold text-foreground block mb-1">Bio / Profile Description</label>
              <textarea
                rows={3}
                value={editingMember.bio || ""}
                onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3 py-2"
                placeholder="Describe their role and mastery in wedding coordination..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="px-4 py-2 rounded-full border text-xs hover:bg-accent/30"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-6"
              >
                Save Member
              </button>
            </div>
          </form>
        </div>
      )}
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-xl text-ink font-semibold">FAQ Items ({faq.length})</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Manage frequently asked questions &amp; answers</p>
        </div>
        <div className="flex items-center gap-2.5">
          <ModuleRefreshButton site={site} showSaved={showSaved} label="Refresh FAQ" />
          <button
            type="button"
            onClick={addFaq}
            className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Question</span>
          </button>
        </div>
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-xl text-ink font-semibold">Wedding Guides &amp; Blog Posts ({blogs.length})</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Manage editorial articles, wedding tips &amp; guides</p>
        </div>
        <div className="flex items-center gap-2.5">
          <ModuleRefreshButton site={site} showSaved={showSaved} label="Refresh Articles" />
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
                image: "",
              })
            }
            className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Write Article</span>
          </button>
        </div>
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
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <h3 className="font-display text-xl text-ink font-semibold">Contact Details &amp; Business Address</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Manage phone numbers, WhatsApp, official email, and physical studio address</p>
        </div>
        <ModuleRefreshButton site={site} showSaved={showSaved} label="Refresh Contact" />
      </div>

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
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <h3 className="font-display text-xl text-ink font-semibold">Branding &amp; SEO Metadata</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Customize global site name, tagline, and search engine metadata</p>
        </div>
        <ModuleRefreshButton site={site} showSaved={showSaved} label="Refresh Settings" />
      </div>

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

