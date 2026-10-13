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
  Compass,
  HeartHandshake,
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
  Mail,
  Clock,
  Calendar,
  Filter,
  ExternalLink,
  Share2,
  Send,
  FileText,
  CheckSquare,
  Tag,
  AlertCircle,
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

function limitFrontSelection(list, targetId, max = 3) {
  const updated = list.map((item) => {
    const id = item.id || item.name || item.label || item.slug;
    const isTarget = id === targetId || item.name === targetId || item.label === targetId || item.slug === targetId;
    const isObj = typeof item === "object";
    const base = isObj
      ? { ...item }
      : { id: `cat-${id}`, name: item, label: item, slug: String(item).toLowerCase().replace(/[^a-z0-9]+/g, "-") };
    if (isTarget) {
      return { ...base, showInFront: !Boolean(base.showInFront) };
    }
    return base;
  });

  const frontIndices = [];
  updated.forEach((c, idx) => {
    if (c.showInFront && c.id !== "all" && c.slug !== "all") {
      frontIndices.push(idx);
    }
  });

  if (frontIndices.length > max) {
    const excess = frontIndices.length - max;
    let deselectedCount = 0;
    for (let i = 0; i < frontIndices.length && deselectedCount < excess; i++) {
      const catIdx = frontIndices[i];
      const cat = updated[catIdx];
      const catId = cat.id || cat.name || cat.label || cat.slug;
      const isTarget = catId === targetId || cat.name === targetId || cat.label === targetId || cat.slug === targetId;
      if (!isTarget) {
        updated[catIdx] = { ...updated[catIdx], showInFront: false };
        deselectedCount++;
      }
    }
  }

  return updated;
}

function enforceMaxFrontCategories(list, targetId = null, max = 3) {
  let updated = list.map((item) => {
    const isObj = typeof item === "object";
    return isObj
      ? { ...item }
      : { id: `cat-${item}`, name: item, label: item, slug: String(item).toLowerCase().replace(/[^a-z0-9]+/g, "-") };
  });

  const frontIndices = [];
  updated.forEach((c, idx) => {
    if (c.showInFront && c.id !== "all" && c.slug !== "all") {
      frontIndices.push(idx);
    }
  });

  if (frontIndices.length > max) {
    const excess = frontIndices.length - max;
    let deselectedCount = 0;
    for (let i = 0; i < frontIndices.length && deselectedCount < excess; i++) {
      const catIdx = frontIndices[i];
      const cat = updated[catIdx];
      const catId = cat.id || cat.name || cat.label || cat.slug;
      const isTarget = targetId && (catId === targetId || cat.name === targetId || cat.label === targetId || cat.slug === targetId);
      if (!isTarget) {
        updated[catIdx] = { ...updated[catIdx], showInFront: false };
        deselectedCount++;
      }
    }
  }

  return updated;
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
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center p-4">
        <div className="bg-[#FAF8F5] max-w-md w-full rounded-3xl p-8 sm:p-10 border border-border shadow-2xl text-ink">
          <div className="text-center">
            <div className="relative mx-auto h-16 w-auto flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Confianza Logo"
                className="h-full w-auto object-contain select-none"
              />
            </div>
            <h1 className="mt-4 font-display text-2xl text-ink font-bold">
              Confianza Admin Portal
            </h1>
            <p className="mt-1 text-xs text-primary uppercase tracking-[0.25em] font-semibold">
              Executive Content Management
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            {loginError && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/30 p-3 text-xs text-destructive text-center font-medium">
                {loginError}
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-ink/80 block mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username (e.g. admin)"
                className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-primary focus:outline-none shadow-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-ink/80 block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-primary focus:outline-none shadow-xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="btn-luxe gradient-gold w-full text-ink font-bold shadow-md text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-98 transition"
              >
                <Lock className="h-4 w-4" />
                <span>Enter Admin Console</span>
              </button>
            </div>

            <div className="pt-3 text-center">
              <Link href="/" className="text-xs text-ink/60 hover:text-primary transition inline-flex items-center gap-1.5 font-medium">
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
  const pendingInquiriesCount = (site.messages || []).filter((m) => m.status === "unread" || !m.status).length;

  // Navigation Items
  const NAV_ITEMS = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "hero", label: "Home Page Banner", icon: Sliders },
    { id: "home-story", label: "Our Story & Philosophy", icon: Sparkles },
    {
      id: "contact-us",
      label: pendingInquiriesCount > 0 ? `Contact Us (${pendingInquiriesCount} New)` : "Contact Us",
      icon: PhoneCall,
      badge: pendingInquiriesCount > 0 ? pendingInquiriesCount : null,
    },
    { id: "about", label: "About Us Page", icon: BookOpen },
    { id: "services", label: "Services & Packages", icon: Briefcase },
    { id: "portfolio", label: "Portfolio Works", icon: ImageIcon },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    {
      id: "testimonials",
      label: pendingTestimonialsCount > 0 ? `Testimonials (${pendingTestimonialsCount} New)` : "Testimonials & Reviews",
      icon: MessageSquareQuote,
    },
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
        } transition-all duration-300 ease-in-out bg-[#FAF8F5] text-ink flex flex-col justify-between shrink-0 border-r border-border/80 shadow-xs ${
          sidebarCollapsed ? "p-3" : "p-4"
        } lg:min-h-screen sticky top-0 z-30`}
      >
        <div>
          {/* Brand header */}
          {sidebarCollapsed ? (
            <div className="flex flex-col items-center gap-3 pb-3.5 border-b border-border/70">
              <Link href="/" title="Confianza Home" className="flex items-center justify-center">
                <div className="relative h-10 w-auto shrink-0 flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="Confianza Logo"
                    className="h-full w-auto object-contain select-none"
                  />
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setSidebarCollapsed(false)}
                title="Expand Sidebar"
                className="p-1.5 rounded-lg border border-border/80 text-ink/70 hover:text-primary hover:border-primary/50 hover:bg-black/5 transition cursor-pointer flex items-center justify-center"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between pb-4 border-b border-border/70 gap-2">
              <Link href="/" className="flex items-center gap-2.5 min-w-0">
                <div className="relative h-11 w-auto shrink-0 flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="Confianza Logo"
                    className="h-full w-auto object-contain select-none"
                  />
                </div>
                <div className="truncate">
                  <span className="font-display text-sm font-bold text-ink block leading-tight truncate">
                    Confianza
                  </span>
                  <span className="text-[0.58rem] uppercase tracking-widest text-primary/80 font-bold block truncate">
                    Admin Dashboard
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-1 shrink-0">
                <Link
                  href="/"
                  title="View live site"
                  className="p-1.5 rounded-lg border border-border/80 text-ink/70 hover:text-primary hover:border-primary/50 hover:bg-black/5 transition"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setSidebarCollapsed(true)}
                  title="Collapse Sidebar"
                  className="p-1.5 rounded-lg border border-border/80 text-ink/70 hover:text-primary hover:border-primary/50 hover:bg-black/5 transition cursor-pointer"
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
                      : "text-ink/75 hover:bg-black/[0.04] hover:text-primary"
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
        <div className="pt-4 border-t border-border/70 space-y-2 mt-4">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Reload data from database?")) {
                site.refreshData();
                showSaved();
              }
            }}
            title="Refresh Database Data"
            className={`w-full flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-white/60 py-2 text-[0.7rem] text-ink/80 hover:text-primary hover:bg-primary/5 hover:border-primary/40 transition cursor-pointer font-medium shadow-2xs ${
              sidebarCollapsed ? "px-0" : ""
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5 shrink-0 text-primary" />
            {!sidebarCollapsed && <span>Refresh Database Data</span>}
          </button>

          <button
            type="button"
            onClick={logout}
            title={`Sign Out (${user.username})`}
            className={`w-full flex items-center justify-center gap-2 rounded-xl bg-destructive/10 border border-destructive/25 py-2 text-[0.7rem] text-destructive hover:bg-destructive/20 transition cursor-pointer font-semibold ${
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

            {(activeTab === "contact-us" || activeTab === "inbox" || activeTab === "contact") && (
              <ContactUsModule site={site} showSaved={showSaved} />
            )}

            {activeTab === "sections" && (
              <SectionsManagerModule site={site} showSaved={showSaved} />
            )}

            {activeTab === "hero" && (
              <HeroEditorModule site={site} showSaved={showSaved} />
            )}

            {activeTab === "home-story" && (
              <HomeStoryEditorModule site={site} showSaved={showSaved} />
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
    { label: "Client Inquiries", value: site.messages?.length || 0, tab: "contact-us", icon: PhoneCall },
    { label: "Story & Philosophy", value: "Dynamic", tab: "home-story", icon: Sparkles },
    { label: "Active Services", value: site.services?.length || 0, tab: "services", icon: Briefcase },
    { label: "Portfolio Projects", value: site.portfolio?.length || 0, tab: "portfolio", icon: ImageIcon },
    { label: "Gallery Photos", value: site.gallery?.length || 0, tab: "gallery", icon: ImageIcon },
    { label: "Client Testimonials", value: site.testimonials?.length || 0, tab: "testimonials", icon: MessageSquareQuote },
    { label: "Brand & SEO", value: "Active", tab: "settings", icon: SettingsIcon },
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
            onClick={() => setActiveTab("contact-us")}
            className="text-xs text-primary font-semibold hover:underline cursor-pointer"
          >
            View All Inquiries ({site.messages?.length || 0}) &rarr;
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
// MODULE 2: Unified Contact Us & Client Inquiries Manager
// -------------------------------------------------------------
function ContactUsModule({ site, showSaved }) {
  const [activeSubTab, setActiveSubTab] = useState("leads"); // "leads" | "details" | "hours" | "socials"

  // Lead Filters & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "unread" | "high" | "contacted" | "archived"
  const [sourceFilter, setSourceFilter] = useState("all"); // "all" | "Enquiry Now" | "Wedding Inquiry Form"

  // Selected Inquiry for Detail / Notes Modal
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [editingNotes, setEditingNotes] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Studio Contact Info Form State
  const [contactState, setContactState] = useState({
    business: site.contact?.business || "Confianza Event's and Entertainment",
    owner: site.contact?.owner || "Ashish Wankhede",
    partner: site.contact?.partner || "Rutik Pund",
    phone: site.contact?.phone || "7057357240",
    secondaryPhone: site.contact?.secondaryPhone || "9850983389",
    whatsapp: site.contact?.whatsapp || "917057357240",
    email: site.contact?.email || "confianzaevents2024@gmail.com",
    instagram: site.contact?.instagram || "https://www.instagram.com/confianza_events",
    facebook: site.contact?.facebook || "https://www.facebook.com/confianzaevents",
    youtube: site.contact?.youtube || "https://www.youtube.com/@confianzaevents",
    pinterest: site.contact?.pinterest || "https://www.pinterest.com/confianzaevents",
    address: {
      line1: site.contact?.address?.line1 || "Indrayani Complex",
      line2: site.contact?.address?.line2 || "Near Mr DIY, Warje Jakat Naka, Warje",
      city: site.contact?.address?.city || "Pune",
      state: site.contact?.address?.state || "Maharashtra",
      pincode: site.contact?.address?.pincode || "411052",
    },
    mapEmbed: site.contact?.mapEmbed || "",
    hours:
      site.contact?.hours && site.contact.hours.length > 0
        ? site.contact.hours
        : [
            { day: "Monday – Friday", time: "10:00 AM – 8:00 PM" },
            { day: "Saturday", time: "10:00 AM – 8:00 PM" },
            { day: "Sunday", time: "By Appointment" },
          ],
  });

  // Keep contactState synchronized when site.contact refreshes
  useEffect(() => {
    if (site.contact) {
      setContactState((prev) => ({
        ...prev,
        ...site.contact,
        address: {
          ...prev.address,
          ...(site.contact.address || {}),
        },
        hours:
          site.contact.hours && site.contact.hours.length > 0
            ? site.contact.hours
            : prev.hours,
      }));
    }
  }, [site.contact]);

  const messages = site.messages || [];

  // Filtered leads
  const filteredMessages = messages.filter((m) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.name?.toLowerCase().includes(q);
      const matchEmail = m.email?.toLowerCase().includes(q);
      const matchPhone = m.phone?.toLowerCase().includes(q);
      const matchService = m.service?.toLowerCase().includes(q);
      const matchMessage = m.message?.toLowerCase().includes(q);
      const matchNotes = m.notes?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchService && !matchMessage && !matchNotes) {
        return false;
      }
    }

    // Status filter
    if (statusFilter === "unread" && (m.status === "contacted" || m.status === "archived")) return false;
    if (statusFilter === "high" && m.priority !== "high") return false;
    if (statusFilter === "contacted" && m.status !== "contacted") return false;
    if (statusFilter === "archived" && m.status !== "archived") return false;

    // Source filter
    if (sourceFilter !== "all") {
      const normalizedMsgSource = (m.source === "Enquiry Now Modal" || m.source === "Enquiry Now") ? "Enquiry Now" : (m.source || "Wedding Inquiry Form");
      if (normalizedMsgSource !== sourceFilter) return false;
    }

    return true;
  });

  // Statistics counters
  const totalCount = messages.length;
  const unreadCount = messages.filter((m) => m.status === "unread" || !m.status).length;
  const highPriorityCount = messages.filter((m) => m.priority === "high").length;
  const contactedCount = messages.filter((m) => m.status === "contacted").length;

  // Toggle Priority Star
  const handleTogglePriority = async (msg) => {
    const nextPriority = msg.priority === "high" ? "normal" : "high";
    if (typeof site.updateInquiry === "function") {
      await site.updateInquiry(msg.id || msg._id, { priority: nextPriority });
    }
    showSaved(nextPriority === "high" ? "Marked as ⭐ High Priority VIP Lead!" : "Priority reset to normal");
  };

  // Change Status
  const handleStatusChange = async (msg, nextStatus) => {
    if (typeof site.updateInquiry === "function") {
      await site.updateInquiry(msg.id || msg._id, { status: nextStatus });
    }
    showSaved(`Inquiry marked as ${nextStatus}`);
  };

  // Save Contact Info
  const handleSaveContact = (e) => {
    e.preventDefault();
    site.update("contact", contactState);
    showSaved("Contact & Studio details updated in MongoDB Atlas!");
  };

  // Save Office Hours
  const handleSaveHours = (e) => {
    e.preventDefault();
    site.update("contact", contactState);
    showSaved("Office & Consultation hours saved successfully!");
  };

  // Save Social Links
  const handleSaveSocials = (e) => {
    e.preventDefault();
    site.update("contact", contactState);
    showSaved("Social media channels saved successfully!");
  };

  // Save Admin Note on Lead
  const handleSaveNote = async () => {
    if (!selectedInquiry) return;
    setSavingNote(true);
    try {
      if (typeof site.updateInquiry === "function") {
        await site.updateInquiry(selectedInquiry.id || selectedInquiry._id, { notes: editingNotes });
      }
      setSelectedInquiry((prev) => ({ ...prev, notes: editingNotes }));
      showSaved("Client consultation note saved!");
    } catch (err) {
      console.error("Save note error:", err);
    } finally {
      setSavingNote(false);
    }
  };

  // Hours Row Management
  const handleAddHourRow = () => {
    setContactState((prev) => ({
      ...prev,
      hours: [...prev.hours, { day: "New Schedule", time: "10:00 AM – 7:00 PM" }],
    }));
  };

  const handleUpdateHourRow = (index, field, val) => {
    setContactState((prev) => {
      const nextHours = [...prev.hours];
      nextHours[index] = { ...nextHours[index], [field]: val };
      return { ...prev, hours: nextHours };
    });
  };

  const handleRemoveHourRow = (index) => {
    setContactState((prev) => ({
      ...prev,
      hours: prev.hours.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Module Title Header & Global Sync */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl text-ink font-semibold">Contact Us &amp; Lead Management</h2>
            {unreadCount > 0 && (
              <span className="rounded-full bg-secondary text-ink px-2.5 py-0.5 text-xs font-bold animate-pulse">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage incoming wedding inquiries, automated emails, studio address, hours, and social media channels.
          </p>
        </div>
        <ModuleRefreshButton site={site} showSaved={showSaved} label="Sync Inquiries &amp; Contact" />
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab("leads")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
            activeSubTab === "leads"
              ? "gradient-royal text-primary-foreground shadow-md"
              : "bg-card text-muted-foreground hover:text-foreground border border-border"
          }`}
        >
          <Inbox className="h-4 w-4" />
          <span>Client Inquiries &amp; Leads</span>
          <span
            className={`ml-1.5 px-2 py-0.5 rounded-full text-[0.65rem] font-bold ${
              activeSubTab === "leads"
                ? "bg-secondary text-ink"
                : "bg-muted text-foreground"
            }`}
          >
            {totalCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("details")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
            activeSubTab === "details"
              ? "gradient-royal text-primary-foreground shadow-md"
              : "bg-card text-muted-foreground hover:text-foreground border border-border"
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>Studio Info &amp; Address</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("hours")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
            activeSubTab === "hours"
              ? "gradient-royal text-primary-foreground shadow-md"
              : "bg-card text-muted-foreground hover:text-foreground border border-border"
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Office &amp; Consultation Hours</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("socials")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
            activeSubTab === "socials"
              ? "gradient-royal text-primary-foreground shadow-md"
              : "bg-card text-muted-foreground hover:text-foreground border border-border"
          }`}
        >
          <Share2 className="h-4 w-4" />
          <span>Social Media Channels</span>
        </button>
      </div>

      {/* SUB-TAB 1: CLIENT INQUIRIES & LEADS */}
      {activeSubTab === "leads" && (
        <div className="space-y-6 animate-fade-in">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
            <div
              onClick={() => setStatusFilter("all")}
              className={`glass-card rounded-2xl p-4 border transition cursor-pointer ${
                statusFilter === "all" ? "border-primary shadow-sm bg-primary/5" : "border-border hover:border-border/80"
              }`}
            >
              <span className="text-muted-foreground block text-[0.7rem] uppercase tracking-wider font-medium">Total Inquiries</span>
              <span className="font-display text-2xl font-bold text-ink mt-0.5 block">{totalCount}</span>
            </div>

            <div
              onClick={() => setStatusFilter("unread")}
              className={`glass-card rounded-2xl p-4 border transition cursor-pointer ${
                statusFilter === "unread" ? "border-secondary shadow-sm bg-secondary/10" : "border-border hover:border-secondary/50"
              }`}
            >
              <span className="text-secondary font-bold block text-[0.7rem] uppercase tracking-wider">Pending / Unread</span>
              <span className="font-display text-2xl font-bold text-secondary mt-0.5 block">{unreadCount}</span>
            </div>

            <div
              onClick={() => setStatusFilter("high")}
              className={`glass-card rounded-2xl p-4 border transition cursor-pointer ${
                statusFilter === "high" ? "border-amber-500 shadow-sm bg-amber-500/10" : "border-border hover:border-amber-400"
              }`}
            >
              <span className="text-amber-600 dark:text-amber-400 font-bold block text-[0.7rem] uppercase tracking-wider">⭐ High Priority / VIP</span>
              <span className="font-display text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">{highPriorityCount}</span>
            </div>

            <div
              onClick={() => setStatusFilter("contacted")}
              className={`glass-card rounded-2xl p-4 border transition cursor-pointer ${
                statusFilter === "contacted" ? "border-emerald-500 shadow-sm bg-emerald-500/10" : "border-border hover:border-emerald-400"
              }`}
            >
              <span className="text-emerald-600 dark:text-emerald-400 font-bold block text-[0.7rem] uppercase tracking-wider">Contacted Leads</span>
              <span className="font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">{contactedCount}</span>
            </div>
          </div>

          {/* Search & Filters Controls */}
          <div className="glass-card rounded-2xl p-4 border border-border flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leads by name, email, phone, service, or message..."
                className="w-full rounded-xl border border-border bg-card pl-9 pr-4 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter by Status and Source */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-card rounded-xl border border-border p-1 text-xs">
                <Filter className="h-3.5 w-3.5 text-muted-foreground ml-1.5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-xs text-foreground px-2 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Statuses ({totalCount})</option>
                  <option value="unread">Pending / Unread ({unreadCount})</option>
                  <option value="high">High Priority / VIP ({highPriorityCount})</option>
                  <option value="contacted">Contacted ({contactedCount})</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-1 bg-card rounded-xl border border-border p-1 text-xs">
                <Tag className="h-3.5 w-3.5 text-muted-foreground ml-1.5" />
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="bg-transparent text-xs text-foreground px-2 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Form Sources</option>
                  <option value="Enquiry Now">Enquiry Now</option>
                  <option value="Wedding Inquiry Form">Wedding Inquiry Form</option>
                </select>
              </div>
            </div>
          </div>

          {/* Inquiries List */}
          {filteredMessages.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center text-muted-foreground border border-border">
              <Inbox className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-display text-lg text-ink">No Inquiries Found</p>
              <p className="text-xs mt-1">
                {messages.length === 0
                  ? "When users submit either the Enquiry Now pop-up or the Wedding Inquiry Form, their requests will appear here instantly."
                  : "No inquiries matched your search and filter criteria."}
              </p>
              {(searchQuery || statusFilter !== "all" || sourceFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setSourceFilter("all");
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-card border border-border text-xs font-semibold hover:border-primary transition cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((m) => {
                const isHighPriority = m.priority === "high";
                const isUnread = m.status === "unread" || !m.status;
                const isContacted = m.status === "contacted";
                const rawSource = m.source || "Wedding Inquiry Form";
                const leadSource = (rawSource === "Enquiry Now Modal" || rawSource === "Enquiry Now") ? "Enquiry Now" : rawSource;

                return (
                  <div
                    key={m.id || m._id}
                    className={`glass-card rounded-2xl p-5 border transition flex flex-col lg:flex-row justify-between gap-5 ${
                      isHighPriority
                        ? "border-amber-500/60 bg-amber-500/5 shadow-md ring-1 ring-amber-500/30"
                        : isUnread
                        ? "border-secondary/60 bg-secondary/5"
                        : "border-border"
                    }`}
                  >
                    {/* Left: Lead Details */}
                    <div className="space-y-3 flex-1">
                      {/* Name, Badges & Priority Star */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleTogglePriority(m)}
                          title={isHighPriority ? "Remove High Priority" : "Set as High Priority VIP lead"}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            isHighPriority
                              ? "bg-amber-500 text-ink border-amber-500 shadow-sm"
                              : "bg-card text-muted-foreground border-border hover:text-amber-500 hover:border-amber-400"
                          }`}
                        >
                          <Star className={`h-4 w-4 ${isHighPriority ? "fill-current" : ""}`} />
                        </button>

                        <h4 className="font-display text-lg text-ink font-semibold">{m.name}</h4>

                        {/* Source Badge */}
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider border ${
                            leadSource === "Enquiry Now"
                              ? "bg-primary/10 text-primary border-primary/30"
                              : "bg-secondary/15 text-secondary border-secondary/40"
                          }`}
                        >
                          {leadSource}
                        </span>

                        {/* Status Badge Dropdown */}
                        <select
                          value={m.status || "unread"}
                          onChange={(e) => handleStatusChange(m, e.target.value)}
                          className={`rounded-full px-2.5 py-0.5 text-[0.68rem] font-bold border focus:outline-none cursor-pointer ${
                            isUnread
                              ? "bg-secondary/20 text-secondary border-secondary/50"
                              : isContacted
                              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          <option value="unread">🟡 Pending / Unread</option>
                          <option value="contacted">🟢 Contacted</option>
                          <option value="archived">⚪ Archived</option>
                        </select>

                        {isHighPriority && (
                          <span className="rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 px-2 py-0.5 text-[0.65rem] font-bold uppercase">
                            VIP Lead
                          </span>
                        )}
                      </div>

                      {/* Lead Metadata Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs bg-card/60 p-3.5 rounded-xl border border-border/60">
                        <div>
                          <span className="block text-[0.65rem] uppercase text-muted-foreground font-semibold">Phone / WhatsApp</span>
                          <a
                            href={`tel:${m.phone}`}
                            className="text-primary font-semibold hover:underline block truncate mt-0.5"
                          >
                            {m.phone}
                          </a>
                        </div>
                        <div>
                          <span className="block text-[0.65rem] uppercase text-muted-foreground font-semibold">Email</span>
                          <a
                            href={`mailto:${m.email}`}
                            className="text-foreground hover:text-primary transition block truncate mt-0.5"
                          >
                            {m.email}
                          </a>
                        </div>
                        <div>
                          <span className="block text-[0.65rem] uppercase text-muted-foreground font-semibold">Event Date</span>
                          <span className="text-foreground font-medium block truncate mt-0.5">
                            {m.eventDate || "To Be Finalized"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[0.65rem] uppercase text-muted-foreground font-semibold">Estimated Budget</span>
                          <span className="text-foreground font-semibold block mt-0.5">
                            {m.budget === "To Be Tailored" ? (
                              <span className="text-secondary font-medium text-[0.7rem]">To Be Tailored ✨</span>
                            ) : (
                              m.budget || "To Be Tailored"
                            )}
                          </span>
                        </div>
                        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
                          <span className="block text-[0.65rem] uppercase text-muted-foreground font-semibold">Requested Service</span>
                          <span className="text-primary font-semibold block mt-0.5 leading-snug">
                            {m.service || "Full Wedding Planning"}
                          </span>
                        </div>
                      </div>

                      {/* Customer Message */}
                      {m.message && (
                        <div className="rounded-xl bg-card/80 p-3 text-xs text-foreground/90 border border-border/50">
                          <span className="text-[0.65rem] uppercase text-muted-foreground block mb-0.5 font-bold">
                            Client Message / Notes:
                          </span>
                          <p className="italic text-foreground/90 leading-relaxed">"{m.message}"</p>
                        </div>
                      )}

                      {/* Internal Admin Note (if any) */}
                      {m.notes && (
                        <div className="rounded-xl bg-primary/5 p-2.5 text-xs text-foreground/90 border border-primary/20 flex items-start gap-2">
                          <FileText className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[0.65rem] uppercase text-primary block font-bold">Internal Follow-Up Note:</span>
                            <span className="text-foreground/85">{m.notes}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Quick Action Controls */}
                    <div className="flex lg:flex-col justify-between items-end gap-2.5 shrink-0 border-t lg:border-t-0 lg:border-l border-border/60 pt-3 lg:pt-0 lg:pl-5">
                      {/* Action Buttons */}
                      <div className="flex flex-wrap lg:flex-col gap-2 w-full">
                        {/* WhatsApp Quick Chat */}
                        <a
                          href={`https://wa.me/${m.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(
                            m.name
                          )},%20thank%20you%20for%20reaching%20out%20to%20Confianza%20Events!%20We%20received%20your%20inquiry%20regarding%20${encodeURIComponent(
                            m.service || "Wedding Planning"
                          )}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        {/* Call Button */}
                        <a
                          href={`tel:${m.phone}`}
                          className="px-3 py-1.5 rounded-xl bg-card border border-border hover:border-primary text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                        >
                          <Phone className="h-3.5 w-3.5 text-primary" />
                          <span>Call</span>
                        </a>

                        {/* Notes / View Details Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInquiry(m);
                            setEditingNotes(m.notes || "");
                          }}
                          className="px-3 py-1.5 rounded-xl bg-card border border-border hover:border-secondary text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <FileText className="h-3.5 w-3.5 text-secondary" />
                          <span>{m.notes ? "Edit Note" : "Add Note"}</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete the inquiry from ${m.name}?`)) {
                              site.removeMessage(m.id || m._id);
                              showSaved("Inquiry deleted successfully");
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl text-destructive hover:bg-destructive/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                          title="Delete inquiry"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>

                      {/* Timestamp */}
                      <span className="text-[0.68rem] text-muted-foreground block text-right mt-1">
                        {new Date(m.createdAt || m.id).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Lead Notes & Details Modal */}
          {selectedInquiry && (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(37,27,49,0.38)] backdrop-blur-md p-4 animate-fade-in">
              <div className="modal-dialog-luxury bg-[#FFFDFB] max-w-lg w-full max-h-[88vh] overflow-y-auto no-scrollbar rounded-3xl p-6 sm:p-8 border border-[#E8E2EE] shadow-luxe text-[#4C4555] space-y-4 animate-zoom-in">
                <div className="flex items-center justify-between pb-3.5 border-b border-[#E8E2EE]">
                  <div>
                    <h3 className="font-display text-xl text-[#2B2138] font-bold">
                      Client Consultation Details
                    </h3>
                    <p className="text-xs text-[#7E7688] font-medium">{selectedInquiry.name} &bull; {selectedInquiry.source || "Wedding Inquiry Form"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedInquiry(null)}
                    className="p-1.5 rounded-full bg-[#F4F1F7] hover:bg-[#EAE4F0] text-[#2B2138] transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-[#FCFBFE] p-4 rounded-2xl border border-[#E8E2EE]">
                    <div>
                      <span className="text-[#7E7688] block text-[0.68rem] uppercase font-bold tracking-wider">Phone:</span>
                      <a href={`tel:${selectedInquiry.phone}`} className="text-[#6A439E] font-bold">{selectedInquiry.phone}</a>
                    </div>
                    <div>
                      <span className="text-[#7E7688] block text-[0.68rem] uppercase font-bold tracking-wider">Email:</span>
                      <a href={`mailto:${selectedInquiry.email}`} className="text-[#2B2138] truncate block font-medium">{selectedInquiry.email}</a>
                    </div>
                    <div>
                      <span className="text-[#7E7688] block text-[0.68rem] uppercase font-bold tracking-wider">Event Date:</span>
                      <span className="font-semibold text-[#2B2138] block">{selectedInquiry.eventDate || "To Be Finalized"}</span>
                    </div>
                    <div>
                      <span className="text-[#7E7688] block text-[0.68rem] uppercase font-bold tracking-wider">Estimated Budget:</span>
                      <span className="font-semibold text-[#2B2138] block">
                        {selectedInquiry.budget === "To Be Tailored"
                          ? "To Be Tailored (Quick Enquiry)"
                          : selectedInquiry.budget || "To Be Tailored"}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[#7E7688] block text-[0.68rem] uppercase font-bold tracking-wider">Requested Service:</span>
                      <span className="font-semibold text-[#6A439E] block leading-snug">{selectedInquiry.service || "Full Wedding Planning"}</span>
                    </div>
                  </div>

                  {selectedInquiry.message && (
                    <div className="bg-[#FCFBFE] p-3.5 rounded-2xl border border-[#E8E2EE]">
                      <span className="text-[#7E7688] block font-semibold mb-1 text-[0.68rem] uppercase tracking-wider">Customer Requirements:</span>
                      <p className="text-[#2B2138] italic">"{selectedInquiry.message}"</p>
                    </div>
                  )}

                  {/* Internal Admin Notes */}
                  <div>
                    <label className="font-semibold text-[#2B2138] block mb-1">
                      Internal Planning &amp; Follow-Up Notes
                    </label>
                    <textarea
                      rows={4}
                      value={editingNotes}
                      onChange={(e) => setEditingNotes(e.target.value)}
                      placeholder="Add notes about call discussions, venue choices, budget quotes, or mood board preferences..."
                      className="w-full rounded-xl border border-[#E8E2EE] bg-white p-3.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedInquiry(null)}
                    className="btn-modal-cancel"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    disabled={savingNote}
                    className="btn-modal-primary"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{savingNote ? "Saving..." : "Save Planning Note"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: STUDIO INFO & ADDRESS */}
      {activeSubTab === "details" && (
        <form onSubmit={handleSaveContact} className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/50">
            <div>
              <h3 className="font-display text-xl text-ink font-semibold">Studio Info &amp; Physical Address</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Official contact numbers, founder designations, and Pune studio location
              </p>
            </div>
            <button type="submit" className="btn-luxe gradient-royal text-primary-foreground text-xs">
              <Save className="h-4 w-4" />
              <span>Save Studio Details</span>
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-medium text-foreground block mb-1">Business Name</label>
              <input
                type="text"
                value={contactState.business}
                onChange={(e) => setContactState({ ...contactState, business: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
              />
            </div>
            <div>
              <label className="font-medium text-foreground block mb-1">Founder / Managing Director</label>
              <input
                type="text"
                value={contactState.owner}
                onChange={(e) => setContactState({ ...contactState, owner: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
              />
            </div>
            <div>
              <label className="font-medium text-foreground block mb-1">Co-Founder / Director</label>
              <input
                type="text"
                value={contactState.partner}
                onChange={(e) => setContactState({ ...contactState, partner: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
              />
            </div>
            <div>
              <label className="font-medium text-foreground block mb-1">Primary Phone Number</label>
              <input
                type="text"
                value={contactState.phone}
                onChange={(e) => setContactState({ ...contactState, phone: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
              />
            </div>
            <div>
              <label className="font-medium text-foreground block mb-1">Secondary / Concierge Phone</label>
              <input
                type="text"
                value={contactState.secondaryPhone}
                onChange={(e) => setContactState({ ...contactState, secondaryPhone: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
              />
            </div>
            <div>
              <label className="font-medium text-foreground block mb-1">WhatsApp Number (e.g. 917057357240)</label>
              <input
                type="text"
                value={contactState.whatsapp}
                onChange={(e) => setContactState({ ...contactState, whatsapp: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-medium text-foreground block mb-1">Official Inquiries Email</label>
              <input
                type="email"
                value={contactState.email}
                onChange={(e) => setContactState({ ...contactState, email: e.target.value })}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
              />
            </div>
            <div>
              <label className="font-medium text-foreground block mb-1">Google Maps Embed URL / Share Link</label>
              <input
                type="text"
                value={contactState.mapEmbed}
                onChange={(e) => setContactState({ ...contactState, mapEmbed: e.target.value })}
                placeholder="https://maps.google.com/..."
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
              />
            </div>
          </div>

          {/* Physical Address Fields */}
          <div className="space-y-3 pt-2 text-xs border-t border-border/50">
            <h4 className="font-semibold text-ink text-sm">Physical Studio Address</h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Address Line 1 (e.g. Indrayani Complex)"
                value={contactState.address?.line1}
                onChange={(e) =>
                  setContactState({
                    ...contactState,
                    address: { ...contactState.address, line1: e.target.value },
                  })
                }
                className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Address Line 2 (e.g. Near Mr DIY, Warje)"
                value={contactState.address?.line2}
                onChange={(e) =>
                  setContactState({
                    ...contactState,
                    address: { ...contactState.address, line2: e.target.value },
                  })
                }
                className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="City (e.g. Pune)"
                value={contactState.address?.city}
                onChange={(e) =>
                  setContactState({
                    ...contactState,
                    address: { ...contactState.address, city: e.target.value },
                  })
                }
                className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="State (e.g. Maharashtra)"
                value={contactState.address?.state}
                onChange={(e) =>
                  setContactState({
                    ...contactState,
                    address: { ...contactState.address, state: e.target.value },
                  })
                }
                className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Pincode (e.g. 411052)"
                value={contactState.address?.pincode}
                onChange={(e) =>
                  setContactState({
                    ...contactState,
                    address: { ...contactState.address, pincode: e.target.value },
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
      )}

      {/* SUB-TAB 3: OFFICE & CONSULTATION HOURS */}
      {activeSubTab === "hours" && (
        <form onSubmit={handleSaveHours} className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/50">
            <div>
              <h3 className="font-display text-xl text-ink font-semibold">Office &amp; Consultation Hours</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Customize studio working hours and client appointment schedule
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddHourRow}
              className="px-3.5 py-1.5 rounded-xl border border-primary/40 bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1.5 hover:bg-primary/20 transition cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Schedule Row</span>
            </button>
          </div>

          <div className="space-y-3">
            {contactState.hours.map((h, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-card p-3 rounded-2xl border border-border text-xs">
                <div className="flex-1">
                  <label className="text-[0.65rem] text-muted-foreground block mb-0.5 uppercase font-semibold">Days</label>
                  <input
                    type="text"
                    value={h.day}
                    onChange={(e) => handleUpdateHourRow(idx, "day", e.target.value)}
                    placeholder="e.g. Monday – Saturday"
                    className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[0.65rem] text-muted-foreground block mb-0.5 uppercase font-semibold">Timings</label>
                  <input
                    type="text"
                    value={h.time}
                    onChange={(e) => handleUpdateHourRow(idx, "time", e.target.value)}
                    placeholder="e.g. 10:00 AM – 8:00 PM"
                    className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveHourRow(idx)}
                  className="p-2 rounded-xl text-destructive hover:bg-destructive/10 transition mt-4 cursor-pointer"
                  title="Remove row"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-secondary/10 border border-secondary/30 p-4 text-xs text-ink space-y-1">
            <span className="font-bold text-secondary flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>24/7 Wedding Day Concierge Note</span>
            </span>
            <p className="text-muted-foreground">
              During booked wedding dates, our on-ground shadow managers and show runners operate 24/7 round-the-clock.
            </p>
          </div>

          <button type="submit" className="btn-luxe gradient-royal text-primary-foreground text-xs">
            <Save className="h-4 w-4" />
            <span>Save Consultation Hours</span>
          </button>
        </form>
      )}

      {/* SUB-TAB 4: SOCIAL MEDIA CHANNELS */}
      {activeSubTab === "socials" && (
        <form onSubmit={handleSaveSocials} className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/50">
            <div>
              <h3 className="font-display text-xl text-ink font-semibold">Social Media Channels</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage external links to Instagram, Facebook, and YouTube
              </p>
            </div>
            <button type="submit" className="btn-luxe gradient-royal text-primary-foreground text-xs">
              <Save className="h-4 w-4" />
              <span>Save Social Links</span>
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-medium text-foreground block mb-1">Instagram Profile URL</label>
              <input
                type="text"
                value={contactState.instagram || ""}
                onChange={(e) => setContactState({ ...contactState, instagram: e.target.value })}
                placeholder="https://www.instagram.com/confianza_events"
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
              />
            </div>
            <div>
              <label className="font-medium text-foreground block mb-1">Facebook Page URL</label>
              <input
                type="text"
                value={contactState.facebook || ""}
                onChange={(e) => setContactState({ ...contactState, facebook: e.target.value })}
                placeholder="https://www.facebook.com/..."
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
              />
            </div>
            <div>
              <label className="font-medium text-foreground block mb-1">YouTube Channel URL</label>
              <input
                type="text"
                value={contactState.youtube || ""}
                onChange={(e) => setContactState({ ...contactState, youtube: e.target.value })}
                placeholder="https://www.youtube.com/@..."
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
              />
            </div>
          </div>

          <button type="submit" className="btn-luxe gradient-royal text-primary-foreground text-xs">
            <Save className="h-4 w-4" />
            <span>Save Social Links</span>
          </button>
        </form>
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
// MODULE 4: Home Hero Banner Slider Manager (Fully Dynamic)
// -------------------------------------------------------------
function HeroEditorModule({ site, showSaved }) {
  const [formData, setFormData] = useState(site.hero || {});
  const [newImageUrl, setNewImageUrl] = useState("");
  const [previewIndex, setPreviewIndex] = useState(0);

  // Sync state if site context refreshes
  useEffect(() => {
    if (site.hero) {
      setFormData(site.hero);
    }
  }, [site.hero]);

  const defaultSlides = ["/images/hero-1.jpg", "/images/hero-2.jpg", "/images/hero-3.jpg"];

  const images = Array.isArray(formData.images) && formData.images.length > 0
    ? formData.images.filter(Boolean)
    : defaultSlides;

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      await site.update("hero", {
        ...formData,
        images,
        slideInterval: Number(formData.slideInterval) || 5000,
      });
      showSaved("Homepage luxury banner slider saved successfully in MongoDB!");
    } catch (err) {
      console.error("Failed to save hero banner:", err);
    }
  };

  const addImage = (url) => {
    if (!url) return;
    const updated = [...images, url.trim()];
    setFormData({ ...formData, images: updated });
    setNewImageUrl("");
    setPreviewIndex(updated.length - 1);
  };

  const removeImage = (idx) => {
    const updated = images.filter((_, i) => i !== idx);
    setFormData({ ...formData, images: updated });
    if (previewIndex >= updated.length) {
      setPreviewIndex(Math.max(0, updated.length - 1));
    }
  };

  const moveSlide = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= images.length) return;
    const updated = [...images];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setFormData({ ...formData, images: updated });
    setPreviewIndex(targetIdx);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Module Header Bar */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[0.68rem] uppercase tracking-[0.25em] text-secondary font-bold">
                Homepage Hero Slider
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary/20 text-secondary text-[0.68rem] font-bold">
                {images.length} Active Slides
              </span>
            </div>
            <h3 className="font-display text-2xl text-ink font-bold mt-1">
              Home Page Banner Manager
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Full dynamic control over Homepage luxury hero slides, Cloudinary uploads, slide order, and auto-transition speeds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <ModuleRefreshButton site={site} showSaved={showSaved} label="Refresh Banner" />
            <button
              type="button"
              onClick={handleSave}
              className="btn-luxe gradient-royal text-primary-foreground text-xs py-2.5 px-6 flex items-center gap-2 cursor-pointer shadow-luxe font-semibold"
            >
              <Save className="h-4 w-4 text-secondary" />
              <span>Save Banner Changes</span>
            </button>
          </div>
        </div>

        {/* Slider Controls & Cloudinary Upload */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Upload & Settings (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Direct Cloudinary Upload */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                  <Upload className="h-4 w-4 text-secondary" />
                  <span>Add New Banner Slide</span>
                </span>
                <span className="text-[0.68rem] text-muted-foreground">Upload to Cloudinary</span>
              </div>
              <ImageUploadField
                label="Upload Image (Recommended: 1920x1080 or High-Res Landscape)"
                value={newImageUrl}
                onChange={(url) => {
                  if (url) {
                    addImage(url);
                  }
                }}
              />
            </div>

            {/* 2. Slide Transition Timing */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <label className="text-xs font-bold text-ink block">
                  Auto-Slide Transition Interval
                </label>
                <p className="text-[0.72rem] text-muted-foreground mt-0.5">
                  How long each image stays on screen before transitioning to the next slide.
                </p>
              </div>
              <select
                value={formData.slideInterval || 5000}
                onChange={(e) =>
                  setFormData({ ...formData, slideInterval: Number(e.target.value) })
                }
                className="rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground focus:outline-none focus:border-secondary cursor-pointer"
              >
                <option value={3000}>3 Seconds (Fast)</option>
                <option value={4000}>4 Seconds</option>
                <option value={5000}>5 Seconds (Recommended)</option>
                <option value={6000}>6 Seconds</option>
                <option value={8000}>8 Seconds (Relaxed)</option>
                <option value={10000}>10 Seconds (Slow)</option>
              </select>
            </div>
          </div>

          {/* Right Column: Interactive Live Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-secondary" />
                  <span>Interactive Live Preview</span>
                </span>
                <span className="text-[0.68rem] font-bold text-secondary font-mono">
                  Slide {images.length > 0 ? previewIndex + 1 : 0} / {images.length}
                </span>
              </div>

              {/* Live Simulated Carousel */}
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-black/90 border border-border shadow-md select-none group">
                {images.length > 0 ? (
                  <img
                    src={images[previewIndex] || images[0]}
                    alt={`Preview Slide ${previewIndex + 1}`}
                    className="w-full h-full object-cover object-center transition-all duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "/images/hero-1.jpg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    No slides uploaded
                  </div>
                )}

                {/* Left navigation arrow */}
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewIndex((prev) => (prev - 1 + images.length) % images.length)
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition cursor-pointer"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                )}

                {/* Right navigation arrow */}
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setPreviewIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition cursor-pointer"
                    title="Next Slide"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}

                {/* Bottom slide indicators */}
                {images.length > 1 && (
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPreviewIndex(i)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          i === previewIndex
                            ? "w-5 bg-[#C2A438]"
                            : "w-1.5 bg-white/40 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <p className="text-[0.68rem] text-muted-foreground text-center">
                Click arrows to test slide transitions. All slides display 100% full-width on the public homepage.
              </p>
            </div>
          </div>
        </div>

        {/* Active Slides Manager (Cards with Reorder & Delete) */}
        <div className="pt-4 border-t border-border/60 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-display text-lg text-ink font-bold">
                Active Slide Sequence ({images.length})
              </h4>
              <p className="text-xs text-muted-foreground">
                Reorder slides using the left/right arrows, or delete slides anytime.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, idx) => (
              <div
                key={img + idx}
                className={`relative group rounded-2xl overflow-hidden border bg-card shadow-sm transition-all duration-300 ${
                  previewIndex === idx
                    ? "border-secondary ring-2 ring-secondary/30 shadow-md"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {/* Photo Preview with Aspect Ratio */}
                <div
                  className="aspect-[16/9] w-full bg-muted overflow-hidden relative cursor-pointer"
                  onClick={() => setPreviewIndex(idx)}
                >
                  <img
                    src={img}
                    alt={`Slide ${idx + 1}`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "/images/hero-1.jpg";
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[0.68rem] font-bold text-champagne uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    <span>Slide 0{idx + 1}</span>
                  </div>

                  {previewIndex === idx && (
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full gradient-gold text-ink text-[0.62rem] font-bold uppercase shadow-sm">
                      Active In Preview
                    </div>
                  )}
                </div>

                {/* Card Controls & Reordering */}
                <div className="p-3 bg-card border-t border-border/60 flex items-center justify-between gap-2">
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveSlide(idx, -1)}
                      className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition text-xs cursor-pointer"
                      title="Move Left (Earlier in sequence)"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => moveSlide(idx, 1)}
                      className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition text-xs cursor-pointer"
                      title="Move Right (Later in sequence)"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-[0.68rem] text-muted-foreground font-mono ml-1 truncate max-w-[120px]">
                      {img}
                    </span>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="p-1.5 rounded-lg text-destructive hover:bg-destructive/15 transition shrink-0 cursor-pointer"
                    title={`Delete Slide ${idx + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="pt-4 border-t border-border/60 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="btn-luxe gradient-royal text-primary-foreground text-xs py-3 px-8 flex items-center gap-2 cursor-pointer shadow-luxe font-bold"
          >
            <Save className="h-4 w-4 text-secondary" />
            <span>Save All Banner Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODULE 4B: Home Page "Our Story & Philosophy" Dynamic Editor
// -------------------------------------------------------------
function HomeStoryEditorModule({ site, showSaved }) {
  const [subTab, setSubTab] = useState("header"); // "header" | "visual" | "features" | "story" | "pillars" | "cta"
  const [formData, setFormData] = useState(() => ({
    eyebrow: site.homeStory?.eyebrow || "Our Story & Philosophy",
    title: site.homeStory?.title || site.about?.homepageHeading || "A Pune Studio Devoted to Weddings That Feel Personal",
    subtitle:
      site.homeStory?.subtitle ||
      "Where real emotions meet beautiful design. We create unforgettable weddings made specially for you.",
    badge: site.homeStory?.badge || "Since 2018 • Warje, Pune",
    quote: site.homeStory?.quote || '"Every love story deserves a stage as breathtaking as the journey itself."',
    quoteAuthor: site.homeStory?.quoteAuthor || "— Ashish Wankhede, Founder",
    image: site.homeStory?.image || "/images/hero-1.jpg",
    feature1Title: site.homeStory?.feature1Title || "Pan-India Destination",
    feature1Text: site.homeStory?.feature1Text || "From Udaipur palatial courtyards to Goa beachside mandaps.",
    feature2Title: site.homeStory?.feature2Title || "Zero Template Policy",
    feature2Text:
      site.homeStory?.feature2Text ||
      "Every color theme, flower setup, and schedule is made specially for you.",
    storyHeading: site.homeStory?.storyHeading || "The Confianza Story",
    storyText:
      site.homeStory?.storyText ||
      site.about?.homepageStory ||
      "Confianza began in 2018 with one belief — a wedding should sound like the couple, not like a catalogue. What started as a two-person decor team in Warje is now a full-service house planning, designing and executing weddings across India.",
    missionLabel: site.homeStory?.missionLabel || "Our Mission",
    missionText:
      site.homeStory?.missionText ||
      site.about?.mission ||
      "To take the weight of planning off a family's shoulders and hand back a celebration they can be fully present for.",
    visionLabel: site.homeStory?.visionLabel || "Our Vision",
    visionText:
      site.homeStory?.visionText ||
      site.about?.vision ||
      "To be the most trusted and admired name in personalised luxury weddings across Maharashtra and every landmark destination we travel to.",
    pillarsHeading: site.homeStory?.pillarsHeading || "Our Three Pillars of Excellence",
    pillars:
      Array.isArray(site.homeStory?.pillars) && site.homeStory.pillars.length > 0
        ? site.homeStory.pillars
        : Array.isArray(site.about?.values) && site.about.values.length > 0
        ? site.about.values
        : [
            {
              title: "Authentic Heritage",
              text: "Respect for sacred Maharashtrian, Marwari, and pan-Indian rituals without superficial modern shortcuts.",
            },
            {
              title: "Calm Execution",
              text: "Direct founder oversight on-ground ensuring flawless timing with zero last-minute panic.",
            },
            {
              title: "Uncompromising Aesthetic",
              text: "Spatial styling, royal chandeliers, and imported floral installations tailored exclusively for you.",
            },
          ],
    ctaLabel: site.homeStory?.ctaLabel || "Learn More About Us & Our Team",
    ctaLink: site.homeStory?.ctaLink || "/about",
  }));

  // Sync when site context refreshes
  useEffect(() => {
    if (site.homeStory) {
      setFormData((prev) => ({
        ...prev,
        ...site.homeStory,
        pillars:
          Array.isArray(site.homeStory.pillars) && site.homeStory.pillars.length > 0
            ? site.homeStory.pillars
            : prev.pillars,
      }));
    }
  }, [site.homeStory]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      await site.update("homeStory", formData);
      showSaved("Our Story & Philosophy section updated on MongoDB Atlas successfully!");
    } catch (err) {
      console.error("Failed to save home story:", err);
    }
  };

  const updateField = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  // Pillar management helpers
  const handlePillarChange = (index, key, val) => {
    const updated = [...(formData.pillars || [])];
    updated[index] = { ...updated[index], [key]: val };
    setFormData((prev) => ({ ...prev, pillars: updated }));
  };

  const handleAddPillar = () => {
    const newPillar = {
      title: "New Excellence Pillar",
      text: "Describe the custom value, tradition, or service standard Confianza delivers for this celebration.",
    };
    setFormData((prev) => ({
      ...prev,
      pillars: [...(prev.pillars || []), newPillar],
    }));
  };

  const handleDeletePillar = (index) => {
    const updated = [...(formData.pillars || [])];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, pillars: updated }));
  };

  const SUB_TABS = [
    { id: "header", label: "Section Header" },
    { id: "visual", label: "Visual Showcase & Quote" },
    { id: "features", label: "Quick Feature Badges" },
    { id: "story", label: "Story & Mission/Vision" },
    { id: "pillars", label: `Pillars of Excellence (${formData.pillars?.length || 0})` },
    { id: "cta", label: "CTA Button" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6">
        {/* Module Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div>
            <span className="text-[0.68rem] uppercase tracking-[0.25em] text-secondary font-bold block">
              Homepage Content Module
            </span>
            <h3 className="font-display text-2xl text-ink font-bold mt-1">
              Our Story &amp; Philosophy Manager
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live dynamic editor for the Homepage brand story, founder quote, visual showcase photo, mission &amp; vision statements, and pillars of excellence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <ModuleRefreshButton site={site} showSaved={showSaved} label="Refresh Story Data" />
            <button
              type="button"
              onClick={handleSave}
              className="btn-luxe gradient-royal text-primary-foreground text-xs py-2.5 px-6 flex items-center gap-2 cursor-pointer shadow-luxe font-semibold"
            >
              <Save className="h-4 w-4 text-secondary" />
              <span>Save Changes to Database</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-border/60 pb-3">
          {SUB_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                subTab === tab.id
                  ? "gradient-royal text-white shadow-xs"
                  : "bg-card border border-border/70 text-ink/75 hover:bg-black/5 hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body based on Sub-Tab */}
        <div className="space-y-6">
          {/* TAB 1: SECTION HEADER */}
          {subTab === "header" && (
            <div className="space-y-4 max-w-3xl">
              <div>
                <label className="text-xs font-bold text-ink block mb-1">
                  Section Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={formData.eyebrow}
                  onChange={(e) => updateField("eyebrow", e.target.value)}
                  placeholder="e.g. Our Story & Philosophy"
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-ink focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1">
                  Main Section Headline
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g. A Pune Studio Devoted to Weddings That Feel Personal"
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-ink focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1">
                  Section Subtitle / Supporting Intro
                </label>
                <textarea
                  rows={3}
                  value={formData.subtitle}
                  onChange={(e) => updateField("subtitle", e.target.value)}
                  placeholder="e.g. Where real emotions meet beautiful design. We create unforgettable weddings made specially for you."
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-ink focus:border-secondary focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: VISUAL SHOWCASE & QUOTE */}
          {subTab === "visual" && (
            <div className="grid lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <label className="text-xs font-bold text-ink block mb-1.5">
                    Showcase Photo (Left Card)
                  </label>
                  <ImageUploadField
                    label="Upload Showcase Image (Cloudinary or Select Preset)"
                    value={formData.image}
                    onChange={(url) => updateField("image", url)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">
                    Establishment Badge (Top of Card)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => updateField("badge", e.target.value)}
                    placeholder="e.g. Since 2018 • Warje, Pune"
                    className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-ink focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">
                    Founder Quote
                  </label>
                  <textarea
                    rows={3}
                    value={formData.quote}
                    onChange={(e) => updateField("quote", e.target.value)}
                    placeholder='e.g. "Every love story deserves a stage as breathtaking as the journey itself."'
                    className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-ink focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">
                    Quote Attribution / Author
                  </label>
                  <input
                    type="text"
                    value={formData.quoteAuthor}
                    onChange={(e) => updateField("quoteAuthor", e.target.value)}
                    placeholder="e.g. — Ashish Wankhede, Founder"
                    className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-ink focus:border-secondary focus:outline-none"
                  />
                </div>
              </div>

              {/* Preview Box */}
              <div className="lg:col-span-5 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-secondary" />
                  <span>Card Live Preview</span>
                </span>
                <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-md">
                  <div className="h-48 w-full overflow-hidden bg-black/10">
                    <img
                      src={formData.image || "/images/hero-1.jpg"}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4 bg-card border-t border-border/60">
                    <span className="text-[0.62rem] uppercase tracking-[0.22em] text-secondary font-bold block mb-1">
                      {formData.badge}
                    </span>
                    <p className="font-display text-sm text-ink italic leading-snug">
                      {formData.quote}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-primary">
                      {formData.quoteAuthor}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: QUICK FEATURE BADGES */}
          {subTab === "features" && (
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
              {/* Feature 1 */}
              <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <Compass className="h-5 w-5 text-primary" />
                  <span className="text-xs font-bold text-ink uppercase tracking-wider">
                    Feature Badge 1 (Left)
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink block mb-1">
                    Badge Title
                  </label>
                  <input
                    type="text"
                    value={formData.feature1Title}
                    onChange={(e) => updateField("feature1Title", e.target.value)}
                    placeholder="e.g. Pan-India Destination"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2 text-xs text-ink focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink block mb-1">
                    Badge Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.feature1Text}
                    onChange={(e) => updateField("feature1Text", e.target.value)}
                    placeholder="e.g. From Udaipur palatial courtyards to Goa beachside mandaps."
                    className="w-full rounded-xl border border-border bg-background px-4 py-2 text-xs text-ink focus:border-secondary focus:outline-none"
                  />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <HeartHandshake className="h-5 w-5 text-secondary" />
                  <span className="text-xs font-bold text-ink uppercase tracking-wider">
                    Feature Badge 2 (Right)
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink block mb-1">
                    Badge Title
                  </label>
                  <input
                    type="text"
                    value={formData.feature2Title}
                    onChange={(e) => updateField("feature2Title", e.target.value)}
                    placeholder="e.g. Zero Template Policy"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2 text-xs text-ink focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink block mb-1">
                    Badge Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.feature2Text}
                    onChange={(e) => updateField("feature2Text", e.target.value)}
                    placeholder="e.g. Every color theme, flower setup, and schedule is made specially for you."
                    className="w-full rounded-xl border border-border bg-background px-4 py-2 text-xs text-ink focus:border-secondary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: THE STORY, MISSION & VISION */}
          {subTab === "story" && (
            <div className="space-y-5 max-w-3xl">
              <div>
                <label className="text-xs font-bold text-ink block mb-1">
                  Story Card Heading
                </label>
                <input
                  type="text"
                  value={formData.storyHeading}
                  onChange={(e) => updateField("storyHeading", e.target.value)}
                  placeholder="e.g. The Confianza Story"
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-ink focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1">
                  Full Story Paragraph
                </label>
                <textarea
                  rows={4}
                  value={formData.storyText}
                  onChange={(e) => updateField("storyText", e.target.value)}
                  placeholder="Write the founding story and philosophy here..."
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-ink focus:border-secondary focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-primary">Mission Section</label>
                  </div>
                  <input
                    type="text"
                    value={formData.missionLabel}
                    onChange={(e) => updateField("missionLabel", e.target.value)}
                    placeholder="Mission Label (e.g. Our Mission)"
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-ink focus:outline-none"
                  />
                  <textarea
                    rows={3}
                    value={formData.missionText}
                    onChange={(e) => updateField("missionText", e.target.value)}
                    placeholder="Mission description statement..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-ink focus:outline-none"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-secondary">Vision Section</label>
                  </div>
                  <input
                    type="text"
                    value={formData.visionLabel}
                    onChange={(e) => updateField("visionLabel", e.target.value)}
                    placeholder="Vision Label (e.g. Our Vision)"
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-ink focus:outline-none"
                  />
                  <textarea
                    rows={3}
                    value={formData.visionText}
                    onChange={(e) => updateField("visionText", e.target.value)}
                    placeholder="Vision description statement..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-ink focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: THREE PILLARS OF EXCELLENCE */}
          {subTab === "pillars" && (
            <div className="space-y-5 max-w-4xl">
              <div>
                <label className="text-xs font-bold text-ink block mb-1">
                  Pillars Section Heading
                </label>
                <input
                  type="text"
                  value={formData.pillarsHeading}
                  onChange={(e) => updateField("pillarsHeading", e.target.value)}
                  placeholder="e.g. Our Three Pillars of Excellence"
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-ink focus:border-secondary focus:outline-none max-w-xl"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-ink">
                  Excellence Pillars List
                </span>
                <button
                  type="button"
                  onClick={handleAddPillar}
                  className="btn-luxe gradient-gold text-ink text-xs py-1.5 px-4 flex items-center gap-1.5 cursor-pointer font-bold rounded-xl"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add New Pillar</span>
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(formData.pillars || []).map((pillar, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-card border border-border/80 space-y-3 relative shadow-2xs group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[0.68rem] uppercase font-bold text-secondary tracking-wider">
                        Pillar #{idx + 1}
                      </span>
                      {formData.pillars.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeletePillar(idx)}
                          className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                          title="Delete Pillar"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="text-[0.68rem] text-muted-foreground block mb-0.5">
                        Title
                      </label>
                      <input
                        type="text"
                        value={pillar.title || ""}
                        onChange={(e) => handlePillarChange(idx, "title", e.target.value)}
                        placeholder="Pillar Title"
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-bold text-ink focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[0.68rem] text-muted-foreground block mb-0.5">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={pillar.text || ""}
                        onChange={(e) => handlePillarChange(idx, "text", e.target.value)}
                        placeholder="Pillar Description"
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-ink/80 focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CTA BUTTON */}
          {subTab === "cta" && (
            <div className="max-w-xl space-y-4">
              <div>
                <label className="text-xs font-bold text-ink block mb-1">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={formData.ctaLabel}
                  onChange={(e) => updateField("ctaLabel", e.target.value)}
                  placeholder="e.g. Learn More About Us & Our Team"
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-ink focus:border-secondary focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Save Action */}
        <div className="pt-4 border-t border-border/60 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="btn-luxe gradient-royal text-primary-foreground text-xs py-3 px-8 flex items-center gap-2 cursor-pointer shadow-luxe font-bold"
          >
            <Save className="h-4 w-4 text-secondary" />
            <span>Save All Story &amp; Philosophy Changes</span>
          </button>
        </div>
      </div>
    </div>
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
    brandImage: site.about?.brandImage || site.about?.brandIdentityImage || "https://res.cloudinary.com/tridevsosync/image/upload/v1791533413/confianza_events/o7afgfqbzmoju31zki1x.jpg",
    brandIdentityImage: site.about?.brandIdentityImage || site.about?.brandImage || "https://res.cloudinary.com/tridevsosync/image/upload/v1791533413/confianza_events/o7afgfqbzmoju31zki1x.jpg",
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
      quote: site.about?.founderAddress?.quote || "We believe every couple has a unique story, and we make sure your wedding is planned with love and care.",
      image: site.about?.founderAddress?.image || "/images/couple.jpg",
      name: site.about?.founderAddress?.name || "Mr. Ashish Wankhede",
      role: site.about?.founderAddress?.role || "Founder & Managing Director",
      story: site.about?.founderAddress?.story || "When we started Confianza Events and Entertainment, our goal was simple: to make wedding planning easy, transparent, and memorable for every family.\n\nEvery couple deserves custom 3D decor, honest pricing, and calm, reliable management so their special day feels truly joyful.\n\nWe are committed to delivering beautiful weddings and building lifelong relationships with every family who trusts us.",
      signatureName: site.about?.founderAddress?.signatureName || "Mr. Ashish Wankhede",
      signatureTitle: site.about?.founderAddress?.signatureTitle || "Founder & Principal Director, Confianza Events",
    },
    leadership: Array.isArray(site.about?.leadership) && site.about.leadership.length > 0
      ? site.about.leadership
      : [
          {
            id: "founder",
            badge: site.about?.founderAddress?.badge || "FOUNDER'S VISION",
            eyebrow: site.about?.founderAddress?.eyebrow || "FOUNDER'S ADDRESS",
            quote: site.about?.founderAddress?.quote || "We believe that every couple's love story is unique, and that's what inspires us to create truly personalized weddings.",
            image: site.about?.founderAddress?.image || "/images/couple.jpg",
            name: site.about?.founderAddress?.name || "Mr. Ashish Wankhede",
            role: site.about?.founderAddress?.role || "Founder & Managing Director",
            story: site.about?.founderAddress?.story || "At Confianza, we are passionate wedding planners who bring your dream celebrations to life with care and creativity.\n\nFor us, your wedding is just like our own family celebration. From traditional poojas to destination weddings across India, we take care of all arrangements, guest hospitality, vendors, and timing so your family can enjoy freely.\n\nOur commitment is to create beautiful weddings and lifelong memories for you and your family.",
          },
          {
            id: "cfo",
            badge: "CLEAR & HONEST BUDGETING",
            eyebrow: "CFO'S PERSPECTIVE",
            quote: "Clear cost estimates and honest pricing are the foundation of a stress-free wedding.",
            image: "/images/hero-2.jpg",
            name: "Mr. Rutik Pund",
            role: "CFO & Co-Founder",
            story: "At Confianza, we manage every family's wedding budget with complete honesty and care. True quality is about smart budget planning, clear vendor prices, and zero hidden markups.\n\nFrom detailed itemized cost sheets to hotel negotiations, our pricing approach ensures you get the best value for every rupee spent.\n\nWe believe financial peace of mind allows families to celebrate happily and with complete confidence.",
          },
          {
            id: "management-head",
            badge: "ON-GROUND EVENT MANAGEMENT",
            eyebrow: "MANAGEMENT ADDRESS",
            quote: "Smooth weddings happen through careful planning, on-time coordination, and calm teamwork.",
            image: "/images/hero-3.jpg",
            name: "Management Head",
            role: "Head of Operations & Production",
            story: "Behind every beautiful bride & groom entry and mandap setup is our hardworking on-ground team. Our setup teams, helpers, and sound/light technicians start early to make sure everything is ready on time.\n\nWe check every detail in advance and solve issues quickly behind the scenes so your event flows smoothly without delay.\n\nOur promise is simple: you enjoy as guests while we take care of everything on-ground.",
          },
        ],
    visionPillars: Array.isArray(site.about?.visionPillars) && site.about.visionPillars.length > 0
      ? site.about.visionPillars
      : [
          "Creating memorable destination wedding experiences across India",
          "Creating beautiful mandap, stage, and floral decor",
          "Honoring authentic cultural traditions with modern elegance",
        ],
    missionCommitments: Array.isArray(site.about?.missionCommitments) && site.about.missionCommitments.length > 0
      ? site.about.missionCommitments
      : [
          "Handling all the planning and logistics so families can enjoy as guests",
          "Complete budget transparency with zero hidden markups or surprises",
          "On-time execution managed by our calm, dedicated team",
        ],
    coreValues: Array.isArray(site.about?.coreValues) && site.about.coreValues.length > 0
      ? site.about.coreValues
      : [
          {
            icon: "ShieldCheck",
            title: "Complete Trust (Confianza)",
            subtitle: "Clear & Honest Pricing",
            text: "True to our name, we believe trust is everything. We provide clear, itemized price sheets with zero hidden charges or last-minute surprises.",
            gradient: "from-secondary to-amber-500",
          },
          {
            icon: "Palette",
            title: "Unique Creative Designs",
            subtitle: "Customized For You",
            text: "Every couple has a unique style. We create custom mood boards, beautiful fabric draping, and fresh floral setups designed specifically for your taste.",
            gradient: "from-primary to-purple-600",
          },
          {
            icon: "Clock",
            title: "Timely Execution",
            subtitle: "On-Time Every Time",
            text: "Our setup teams start early with clear timelines, backup power, and weather plans to make sure every ceremony starts right on time.",
            gradient: "from-blue-600 to-indigo-600",
          },
          {
            icon: "HeartHandshake",
            title: "Warm Hospitality",
            subtitle: "Caring for Your Family",
            text: "Weddings are emotional family moments. We coordinate with elders, prioritize guest comfort, and manage vendors so you stay relaxed throughout.",
            gradient: "from-rose-500 to-primary",
          },
          {
            icon: "Leaf",
            title: "Eco-Friendly Practices",
            subtitle: "Mindful Celebrations",
            text: "We source fresh flowers from local farms, use energy-saving LED lights, and clean up responsibly after every event.",
            gradient: "from-emerald-600 to-teal-600",
          },
        ],
    howWeWork: Array.isArray(site.about?.howWeWork) && site.about.howWeWork.length > 0
      ? site.about.howWeWork
      : [
          {
            num: "01",
            title: "First Meeting & Discussion",
            timeline: "60–90 Min Meeting • Ideas & Budget",
            summary: "A friendly one-on-one session to understand your wedding ideas, style preferences, guest count, and budget. We explain our planning options clearly and share a simple, honest wedding plan.",
            deliverables: ["Understanding Your Vision", "Clear Budget Planning", "Custom Wedding Plan & Timeline"],
          },
          {
            num: "02",
            title: "Detailed Planning & 3D Decor Design",
            timeline: "Design & Bookings • Creative Concepts",
            summary: "Our design team creates realistic 3D designs for your mandap, entrance, and stage so you see everything before setup starts. We help book trusted venues, caterers, sound, lights, and artists with honest pricing.",
            deliverables: ["3D Decor Previews & Flower Colors", "Venue & Vendor Confirmations", "Wedding Cards & Stationery"],
          },
          {
            num: "03",
            title: "Wedding Day Management & Execution",
            timeline: "Wedding Day • Smooth Delivery",
            summary: "Our team manages everything on the wedding day. Dedicated personal helpers assist the bride and groom, while our on-ground crew handles guest check-ins, food timings, rituals, and music so your family can enjoy freely.",
            deliverables: ["Personal Helpers for Bride & Groom", "Detailed Event Schedule", "Guest Care & Food Timing Supervision"],
          },
        ],
  }));

  // Sync state when site data updates
  useEffect(() => {
    if (site.about) {
      setAboutData((prev) => ({
        ...prev,
        ...site.about,
        brandImage:
          site.about?.brandImage ||
          site.about?.brandIdentityImage ||
          prev.brandImage ||
          "https://res.cloudinary.com/tridevsosync/image/upload/v1791533413/confianza_events/o7afgfqbzmoju31zki1x.jpg",
        brandIdentityImage:
          site.about?.brandIdentityImage ||
          site.about?.brandImage ||
          prev.brandIdentityImage ||
          "https://res.cloudinary.com/tridevsosync/image/upload/v1791533413/confianza_events/o7afgfqbzmoju31zki1x.jpg",
        headerBanner: {
          badge: site.about?.headerBanner?.badge || "Since 2018 • Warje, Pune",
          title: site.about?.headerBanner?.title || site.about?.heading || "Where Weddings Become Stories",
          subtitle: site.about?.headerBanner?.subtitle || site.about?.story || "At Confianza, we create beautiful, memorable weddings with personal care and creative design. For us, your event is just like our own.",
          image: site.about?.headerBanner?.image || "/images/hero-1.jpg",
          ...(site.about.headerBanner || {}),
        },
        founderAddress: {
          ...prev.founderAddress,
          ...(site.about.founderAddress || {}),
        },
        leadership: Array.isArray(site.about?.leadership) && site.about.leadership.length > 0
          ? site.about.leadership
          : (prev.leadership || [
              {
                id: "founder",
                badge: site.about?.founderAddress?.badge || "FOUNDER'S VISION",
                eyebrow: site.about?.founderAddress?.eyebrow || "FOUNDER'S ADDRESS",
                quote: site.about?.founderAddress?.quote || "We believe that every couple's love story is unique, and that's what inspires us to create truly personalized weddings.",
                image: site.about?.founderAddress?.image || "/images/couple.jpg",
                name: site.about?.founderAddress?.name || "Mr. Ashish Wankhede",
                role: site.about?.founderAddress?.role || "Founder & Managing Director",
                story: site.about?.founderAddress?.story || "At Confianza, we are passionate wedding planners who bring your dream celebrations to life with care and creativity.\n\nFor us, your wedding is just like our own family celebration. From traditional poojas to destination weddings across India, we take care of all arrangements, guest hospitality, vendors, and timing so your family can enjoy freely.\n\nOur commitment is to create beautiful weddings and lifelong memories for you and your family.",
              },
              {
                id: "cfo",
                badge: "CLEAR & HONEST BUDGETING",
                eyebrow: "CFO'S PERSPECTIVE",
                quote: "Clear cost estimates and honest pricing are the foundation of a stress-free wedding.",
                image: "/images/hero-2.jpg",
                name: "Mr. Rutik Pund",
                role: "CFO & Co-Founder",
                story: "At Confianza, we manage every family's wedding budget with complete honesty and care. True quality is about smart budget planning, clear vendor prices, and zero hidden markups.\n\nFrom detailed itemized cost sheets to hotel negotiations, our pricing approach ensures you get the best value for every rupee spent.\n\nWe believe financial peace of mind allows families to celebrate happily and with complete confidence.",
              },
              {
                id: "management-head",
                badge: "ON-GROUND EVENT MANAGEMENT",
                eyebrow: "MANAGEMENT ADDRESS",
                quote: "Smooth weddings happen through careful planning, on-time coordination, and calm teamwork.",
                image: "/images/hero-3.jpg",
                name: "Management Head",
                role: "Head of Operations & Production",
                story: "Behind every beautiful bride & groom entry and mandap setup is our hardworking on-ground team. Our setup teams, helpers, and sound/light technicians start early to make sure everything is ready on time.\n\nWe check every detail in advance and solve issues quickly behind the scenes so your event flows smoothly without delay.\n\nOur promise is simple: you enjoy as guests while we take care of everything on-ground.",
              },
            ]),
      }));
    }
    if (site.team) {
      setTeamMembers(site.team);
    }
  }, [site.about, site.team]);

  // Executive Leadership Leader Index (0 = Founder, 1 = CFO, 2 = Management Head)
  const [selectedLeaderIdx, setSelectedLeaderIdx] = useState(0);

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
    { id: "brand-identity", label: "Brand Identity Image" },
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

      {/* 1. EXECUTIVE LEADERSHIP / FOUNDER SUB-TAB (3 DYNAMIC CARDS: FOUNDER, CFO, MANAGEMENT HEAD) */}
      {subTab === "founder" && (() => {
        const leaders = Array.isArray(aboutData.leadership) && aboutData.leadership.length >= 3
          ? aboutData.leadership
          : [
              {
                id: "founder",
                badge: aboutData.founderAddress?.badge || "FOUNDER'S VISION",
                eyebrow: aboutData.founderAddress?.eyebrow || "FOUNDER'S ADDRESS",
                quote: aboutData.founderAddress?.quote || "We believe that every couple's love story is unique, and that's what inspires us to create truly personalized weddings.",
                image: aboutData.founderAddress?.image || "/images/couple.jpg",
                name: aboutData.founderAddress?.name || "Mr. Ashish Wankhede",
                role: aboutData.founderAddress?.role || "Founder & Managing Director",
                story: aboutData.founderAddress?.story || "At Confianza, we're the romantic and elegant wedding experts who bring love stories to life with passion and precision. We are a dedicated team obsessed with love, laughter, and happily ever afters.\n\nFor us, your event is no less than our own. From sacred heritage rituals to grand multi-day luxury weddings across India, we shoulder all logistics, hospitality, vendor coordination, and minute-by-minute show running so your family can celebrate as honored guests.\n\nWe pledge our continuous devotion to crafting not just flawless weddings, but heartfelt lifelong memories that outlast generations.",
              },
              {
                id: "cfo",
                badge: "FINANCIAL ARCHITECTURE",
                eyebrow: "CFO'S PERSPECTIVE",
                quote: "Transparent financial forecasting and ethical budgeting are the true foundation of stress-free luxury celebrations.",
                image: "/images/hero-2.jpg",
                name: "Mr. Rutik Pund",
                role: "CFO & Co-Founder",
                story: "At Confianza, we treat every family's wedding investment with absolute accountability and care. True luxury isn't about exorbitant markups—it is about intelligent budget allocation, transparent vendor pricing, and meticulous fiscal management.\n\nFrom detailed line-item expenditure sheets to contract negotiations with 5-star properties, our financial governance ensures you get maximum aesthetic and operational value at every milestone.\n\nWe believe financial peace of mind allows families to celebrate with uninhibited joy and complete confidence.",
              },
              {
                id: "management-head",
                badge: "OPERATIONAL MASTERY",
                eyebrow: "MANAGEMENT ADDRESS",
                quote: "Flawless weddings are not an accident—they are the result of disciplined show running, precision rehearsals, and calm leadership.",
                image: "/images/hero-3.jpg",
                name: "Management Head",
                role: "Head of Operations & Production",
                story: "Behind every breathtaking bridal entry and awe-inspiring floral mandap lies a clockwork production engine. Our ground crews, shadow coordinators, and technical teams begin work before sunrise to orchestrate acoustics, lighting, and hospitality transitions with millisecond precision.\n\nWe anticipate every variable before it arises, troubleshooting silently behind the scenes so that each celebration unfolds like a symphony.\n\nOur commitment is simple: you celebrate as honored guests while we handle every detail with military precision.",
              },
            ];

        const currentLeader = leaders[selectedLeaderIdx] || leaders[0];

        const updateLeaderField = (field, val) => {
          const nextList = [...leaders];
          nextList[selectedLeaderIdx] = {
            ...nextList[selectedLeaderIdx],
            [field]: val,
          };

          const nextAbout = {
            ...aboutData,
            leadership: nextList,
          };

          // If editing Founder (index 0), also sync founderAddress for backwards compatibility
          if (selectedLeaderIdx === 0) {
            nextAbout.founderAddress = {
              ...nextAbout.founderAddress,
              [field]: val,
            };
          }

          setAboutData(nextAbout);
        };

        const leaderTabLabels = [
          { icon: "👑", title: "Founder", subtitle: "Ashish Wankhede" },
          { icon: "💼", title: "CFO", subtitle: "Rutik Pund" },
          { icon: "⚙️", title: "Management Head", subtitle: "Operations & Production" },
        ];

        return (
          <div className="space-y-8">
            {/* Header Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-secondary text-xs uppercase tracking-[0.25em] font-bold">
                  <Sparkles className="h-4 w-4 text-secondary" />
                  <span>Executive Management</span>
                </div>
                <h3 className="font-display text-2xl text-ink font-bold mt-1">Executive Leadership &amp; Addresses</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Customize the 3 executive cards (<span className="text-primary font-semibold">Founder, CFO, Management Head</span>) displayed on the public <span className="text-primary font-semibold">About page</span>.
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
                    <span>Save Executive Section</span>
                  </>
                )}
              </button>
            </div>

            {/* Executive Leader Selector Tabs */}
            <div className="glass-card rounded-2xl p-2 border border-border flex flex-wrap gap-2">
              {leaderTabLabels.map((tab, idx) => {
                const isActive = selectedLeaderIdx === idx;
                const activeLead = leaders[idx] || {};
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedLeaderIdx(idx)}
                    className={`flex-1 min-w-[200px] flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                      isActive
                        ? "gradient-royal text-primary-foreground shadow-md ring-2 ring-secondary/40"
                        : "bg-card hover:bg-muted/60 text-foreground/80"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{tab.icon}</span>
                      <div>
                        <span className="text-xs font-bold block leading-tight">
                          {tab.title}
                        </span>
                        <span className={`text-[0.65rem] ${isActive ? "text-secondary font-semibold" : "text-muted-foreground"}`}>
                          {activeLead.name || tab.subtitle}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[0.68rem] font-bold opacity-60">
                      0{idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Form & Live Real-Time Preview Grid */}
            <div className="grid gap-8 lg:grid-cols-12 items-start">
              {/* Left Column: Form Controls */}
              <div className="lg:col-span-6 space-y-6 glass-card rounded-3xl p-6 sm:p-7 border border-border">
                <div className="border-b border-border/60 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-base font-bold text-ink flex items-center gap-2">
                      <span>{leaderTabLabels[selectedLeaderIdx]?.title} Information &amp; Photo</span>
                    </h4>
                    <p className="text-[0.68rem] text-muted-foreground mt-0.5">
                      Upload portrait photo and customize name, role, quote, and vision narrative.
                    </p>
                  </div>
                  <span className="text-[0.62rem] uppercase tracking-wider font-semibold text-secondary px-2.5 py-0.5 rounded-full bg-secondary/10 border border-secondary/20">
                    Card 0{selectedLeaderIdx + 1} of 03
                  </span>
                </div>

                {/* Photo Uploader */}
                <ImageUploadField
                  label={`${leaderTabLabels[selectedLeaderIdx]?.title} Portrait Photo`}
                  description="Upload a high-resolution portrait from your device or paste a URL."
                  value={currentLeader.image || ""}
                  onChange={(url) => updateLeaderField("image", url)}
                />

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={currentLeader.name || ""}
                      onChange={(e) => updateLeaderField("name", e.target.value)}
                      className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-medium focus:border-secondary focus:outline-none"
                      placeholder="e.g. Mr. Ashish Wankhede"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-foreground block mb-1">Role / Designation Title</label>
                    <input
                      type="text"
                      value={currentLeader.role || ""}
                      onChange={(e) => updateLeaderField("role", e.target.value)}
                      className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs focus:border-secondary focus:outline-none"
                      placeholder="e.g. Founder & Managing Director"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-foreground block mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={currentLeader.badge || ""}
                      onChange={(e) => updateLeaderField("badge", e.target.value)}
                      className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs focus:border-secondary focus:outline-none uppercase font-semibold"
                      placeholder="e.g. FOUNDER'S VISION"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-foreground block mb-1">Eyebrow Heading</label>
                    <input
                      type="text"
                      value={currentLeader.eyebrow || ""}
                      onChange={(e) => updateLeaderField("eyebrow", e.target.value)}
                      className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs focus:border-secondary focus:outline-none uppercase font-semibold"
                      placeholder="e.g. FOUNDER'S ADDRESS"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="font-semibold text-foreground block mb-1">
                    Highlight Quote Headline
                  </label>
                  <textarea
                    rows={2}
                    value={currentLeader.quote || ""}
                    onChange={(e) => updateLeaderField("quote", e.target.value)}
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-medium leading-relaxed focus:border-secondary focus:outline-none"
                    placeholder="We don't just decorate halls; we architect emotional memories that outlast generations."
                  />
                </div>

                <div className="text-xs">
                  <label className="font-semibold text-foreground block mb-1">
                    Address / Message Narrative (Separate paragraphs by blank line)
                  </label>
                  <textarea
                    rows={6}
                    value={currentLeader.story || ""}
                    onChange={(e) => updateLeaderField("story", e.target.value)}
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs leading-relaxed focus:border-secondary focus:outline-none font-sans"
                    placeholder="Enter full vision and journey narrative here..."
                  />
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
                        <span>Save {leaderTabLabels[selectedLeaderIdx]?.title} Changes</span>
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
                    Previewing {leaderTabLabels[selectedLeaderIdx]?.title} Card
                  </span>
                </div>

                {/* Exact replica of the updated FounderFeatureSection smooth cloud card */}
                <div className="bg-gradient-to-br from-white/95 via-card/90 to-accent/20 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-secondary/30 shadow-2xl relative overflow-hidden text-foreground space-y-5 ring-1 ring-secondary/15">
                  {/* Background glow effects */}
                  <div className="absolute top-0 right-0 w-60 h-60 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10 space-y-4">
                    {/* Clean Photo Card Preview (No Overlay Text or Dark Gradient) */}
                    <div className="relative rounded-2xl overflow-hidden h-60 sm:h-68 border-2 border-secondary/30 shadow-md bg-card ring-2 ring-secondary/10">
                      <img
                        src={currentLeader.image || "/images/couple.jpg"}
                        alt={currentLeader.name || "Leader"}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/images/couple.jpg";
                        }}
                      />
                    </div>

                    {/* Details Positioned Cleanly Below The Image */}
                    <div className="space-y-1 pt-1 pb-2 border-b border-border/60">
                      <span className="inline-flex items-center gap-1 rounded-full gradient-gold text-ink font-bold text-[0.62rem] tracking-wider uppercase px-2.5 py-0.5 shadow-sm">
                        <Sparkles className="h-2.5 w-2.5" />
                        {currentLeader.badge || "EXECUTIVE LEADERSHIP"}
                      </span>
                      <h4 className="font-display text-lg text-ink font-bold mt-1">
                        {currentLeader.name || "Executive Leader"}
                      </h4>
                      <p className="text-[0.72rem] text-secondary font-semibold tracking-wide">
                        {currentLeader.role || "Executive Role"}
                      </p>
                    </div>

                    {/* Prose Preview */}
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-1.5 text-primary font-bold text-[0.65rem] uppercase tracking-[0.25em] bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                        <Quote className="h-3 w-3 text-secondary rotate-180" />
                        <span>{currentLeader.eyebrow || "EXECUTIVE ADDRESS"}</span>
                      </div>

                      <h3 className="font-display text-base sm:text-lg text-ink font-normal leading-snug tracking-tight">
                        "{currentLeader.quote || "Where Weddings Become Stories."}"
                      </h3>

                      <div className="rule-gold" />

                      <div className="space-y-2 text-[0.75rem] text-foreground/80 leading-relaxed font-normal max-h-48 overflow-y-auto pr-1">
                        {(currentLeader.story || "")
                          .split("\n\n")
                          .filter(Boolean)
                          .map((p, idx) => (
                            <p key={idx}>{p}</p>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

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
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(37,27,49,0.38)] backdrop-blur-md p-4 animate-fade-in">
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
                className="modal-dialog-luxury bg-[#FFFDFB] max-w-lg w-full max-h-[88vh] overflow-y-auto no-scrollbar rounded-3xl p-6 sm:p-8 space-y-4 border border-[#E8E2EE] shadow-luxe"
              >
                <div className="flex justify-between items-center border-b border-[#E8E2EE] pb-3.5">
                  <h4 className="font-display text-lg text-[#2B2138] font-bold">
                    {editingMember.isNew ? "Add Team Member" : "Edit Team Member"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="p-1.5 rounded-full bg-[#F4F1F7] hover:bg-[#EAE4F0] text-[#2B2138] transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <ImageUploadField
                  label="Profile Photo"
                  value={editingMember.image || ""}
                  onChange={(url) => setEditingMember({ ...editingMember, image: url })}
                />

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-[#2B2138] block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editingMember.name || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                      placeholder="e.g. Radhika Deshmukh"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#2B2138] block mb-1">Designation / Role</label>
                    <input
                      type="text"
                      required
                      value={editingMember.role || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                      placeholder="e.g. Lead Floral Architect"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-[#2B2138] block mb-1">Official Email</label>
                    <input
                      type="email"
                      required
                      value={editingMember.email || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                      placeholder="name@confianzaevents.com"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#2B2138] block mb-1">Experience</label>
                    <input
                      type="text"
                      value={editingMember.experience || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, experience: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                      placeholder="e.g. 6+ Years"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="font-semibold text-[#2B2138] block mb-1">
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
                    className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                    placeholder="Luxury Decor, Spatial Design, Guest Concierge"
                  />
                </div>

                <div className="text-xs">
                  <label className="font-semibold text-[#2B2138] block mb-1">Bio / Profile Description</label>
                  <textarea
                    rows={3}
                    value={editingMember.bio || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E2EE] bg-white p-3 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                    placeholder="Describe their role and mastery in wedding coordination..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#E8E2EE]">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="btn-modal-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-modal-primary"
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
                Manage high-level guiding principles and bullet commitments shown on the About page.
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
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(37,27,49,0.38)] backdrop-blur-md p-4 animate-fade-in">
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
                className="modal-dialog-luxury bg-[#FFFDFB] max-w-md w-full max-h-[88vh] overflow-y-auto no-scrollbar rounded-3xl p-6 sm:p-8 space-y-4 border border-[#E8E2EE] shadow-luxe"
              >
                <div className="flex justify-between items-center border-b border-[#E8E2EE] pb-3.5">
                  <h4 className="font-display text-lg text-[#2B2138] font-bold">
                    {editingValue.isNew ? "Add Core Value" : "Edit Core Value"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingValue(null)}
                    className="p-1.5 rounded-full bg-[#F4F1F7] hover:bg-[#EAE4F0] text-[#2B2138] transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-semibold text-[#2B2138] block mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={editingValue.title || ""}
                      onChange={(e) => setEditingValue({ ...editingValue, title: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] px-3.5 py-2.5 bg-white text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                      placeholder="e.g. Uncompromised Trust (Confianza)"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#2B2138] block mb-1">Subtitle Tag</label>
                    <input
                      type="text"
                      value={editingValue.subtitle || ""}
                      onChange={(e) => setEditingValue({ ...editingValue, subtitle: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] px-3.5 py-2.5 bg-white text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                      placeholder="e.g. Absolute Honesty in Costing"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#2B2138] block mb-1">Icon Name</label>
                    <select
                      value={editingValue.icon || "ShieldCheck"}
                      onChange={(e) => setEditingValue({ ...editingValue, icon: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] px-3.5 py-2.5 bg-white text-[#2B2138] text-xs focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15 cursor-pointer"
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
                    <label className="font-semibold text-[#2B2138] block mb-1">Detailed Description</label>
                    <textarea
                      rows={3}
                      required
                      value={editingValue.text || ""}
                      onChange={(e) => setEditingValue({ ...editingValue, text: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] p-3 bg-white text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                      placeholder="Explain how this value guides your wedding planning..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#E8E2EE]">
                  <button
                    type="button"
                    onClick={() => setEditingValue(null)}
                    className="btn-modal-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-modal-primary"
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
                  The 5-Stage Luxury Methodology roadmap on the About page.
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
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(37,27,49,0.38)] backdrop-blur-md p-4 animate-fade-in">
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
                className="modal-dialog-luxury bg-[#FFFDFB] max-w-md w-full max-h-[88vh] overflow-y-auto no-scrollbar rounded-3xl p-6 sm:p-8 space-y-4 border border-[#E8E2EE] shadow-luxe"
              >
                <div className="flex justify-between items-center border-b border-[#E8E2EE] pb-3.5">
                  <h4 className="font-display text-lg text-[#2B2138] font-bold">
                    {editingStep.isNew ? "Add Methodology Stage" : "Edit Methodology Stage"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingStep(null)}
                    className="p-1.5 rounded-full bg-[#F4F1F7] hover:bg-[#EAE4F0] text-[#2B2138] transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-[#2B2138] block mb-1">Step Number</label>
                      <input
                        type="text"
                        required
                        value={editingStep.num || ""}
                        onChange={(e) => setEditingStep({ ...editingStep, num: e.target.value })}
                        className="w-full rounded-xl border border-[#E8E2EE] px-3.5 py-2.5 bg-white text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                        placeholder="01"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="font-semibold text-[#2B2138] block mb-1">Timeline Tag</label>
                      <input
                        type="text"
                        value={editingStep.timeline || ""}
                        onChange={(e) => setEditingStep({ ...editingStep, timeline: e.target.value })}
                        className="w-full rounded-xl border border-[#E8E2EE] px-3.5 py-2.5 bg-white text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                        placeholder="Month 1 • Foundation"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-[#2B2138] block mb-1">Stage Title</label>
                    <input
                      type="text"
                      required
                      value={editingStep.title || ""}
                      onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] px-3.5 py-2.5 bg-white text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                      placeholder="e.g. Discovery & Story Session"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#2B2138] block mb-1">Summary Description</label>
                    <textarea
                      rows={3}
                      required
                      value={editingStep.summary || ""}
                      onChange={(e) => setEditingStep({ ...editingStep, summary: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] p-3 bg-white text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                      placeholder="Describe what happens in this stage..."
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#2B2138] block mb-1">Key Deliverables (one per line)</label>
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
                      className="w-full rounded-xl border border-[#E8E2EE] p-3 bg-white font-mono text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                      placeholder="Deliverable item 1&#10;Deliverable item 2"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#E8E2EE]">
                  <button
                    type="button"
                    onClick={() => setEditingStep(null)}
                    className="btn-modal-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-modal-primary"
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
                    Customize the top hero banner title, subtitle, badge, and cover photo on the <span className="text-primary font-semibold">About page</span>.
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
                  <Eye className="h-3.5 w-3.5 text-secondary" /> Live About Header Preview
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

      {/* BRAND IDENTITY IMAGE SUB-TAB */}
      {subTab === "brand-identity" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-display text-lg text-ink">Brand Identity Image</h4>
              <p className="text-xs text-muted-foreground">
                Manage the single full-width Brand Identity showcase image displayed on the About Us page (/about).
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* Form Column */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveAbout(aboutData);
              }}
              className="lg:col-span-5 space-y-4 rounded-3xl border border-border bg-card p-6 shadow-xs"
            >
              <ImageUploadField
                label="Brand Identity Image"
                value={aboutData.brandImage || aboutData.brandIdentityImage || "/images/hero-1.jpg"}
                onChange={(url) =>
                  setAboutData({
                    ...aboutData,
                    brandImage: url,
                    brandIdentityImage: url,
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
                      <span>Saving Brand Image...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 text-secondary" />
                      <span>Save Brand Identity Image</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Live Preview Column */}
            <div className="lg:col-span-7 space-y-3 sticky top-6">
              <div className="flex items-center justify-between px-2">
                <span className="text-[0.68rem] uppercase tracking-[0.25em] text-primary font-bold flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-secondary" /> Live About Page Image Preview
                </span>
                <span className="text-[0.62rem] text-muted-foreground font-mono">
                  Exact Frontend Replica
                </span>
              </div>

              <div className="rounded-2xl sm:rounded-3xl border border-border/80 shadow-luxe bg-card overflow-hidden">
                <div className="relative w-full h-[360px] sm:h-[480px] overflow-hidden">
                  <img
                    src={aboutData.brandImage || aboutData.brandIdentityImage || "/images/hero-1.jpg"}
                    alt="Brand Identity Preview"
                    className="w-full h-full object-cover object-center transition-all duration-500"
                  />
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
  const [subTab, setSubTab] = useState("header"); // "header" | "typeOfServices" | "typeOfEvents" | "packages" | "stationery" | "cta" | "ceremonies"

  // 0. Services Page Hero Header Banner State
  const defaultServicesHeader = {
    badge: "Our Offerings",
    title: "Complete Wedding & Event Services",
    subtitle:
      "Explore our complete range of wedding planning services, custom decor, destination management, and rituals.",
    bgImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80",
  };

  const [headerForm, setHeaderForm] = useState({
    ...defaultServicesHeader,
    ...(site.servicesHeader || {}),
  });

  const [isSavingHeader, setIsSavingHeader] = useState(false);

  useEffect(() => {
    if (site.servicesHeader) {
      setHeaderForm({
        ...defaultServicesHeader,
        ...site.servicesHeader,
      });
    }
  }, [site.servicesHeader]);

  const saveHeaderSettings = async (e) => {
    e.preventDefault();
    setIsSavingHeader(true);
    try {
      await site.update("servicesHeader", headerForm);
      showSaved("Services Page Header updated successfully in database!");
    } catch (err) {
      console.error("Failed to save Services Page Header:", err);
    } finally {
      setIsSavingHeader(false);
    }
  };

  // 1. Type of Services State
  const defaultTypeOfServices = [
    {
      id: "tos-1",
      title: "Event Management",
      description:
        "Complete on-ground execution, timeline monitoring, vendor coordination, and stage queue direction for seamless event flow.",
      order: 1,
    },
    {
      id: "tos-2",
      title: "Event Planning",
      description:
        "Strategic concept design, comprehensive budgeting, master timeline planning, and milestone tracking.",
      order: 2,
    },
    {
      id: "tos-3",
      title: "Decor",
      description:
        "Custom 3D spatial design, architectural mandaps, floral installations, thematic stages, and ambient lighting.",
      order: 3,
    },
    {
      id: "tos-4",
      title: "Venue",
      description:
        "Curated palace, resort, and banquet sourcing with contract negotiation and site layout mapping.",
      order: 4,
    },
    {
      id: "tos-5",
      title: "Photograph/Videography",
      description:
        "Cinematic wedding films, candid photography, drone coverage, and instant social media edits.",
      order: 5,
    },
    {
      id: "tos-6",
      title: "Catering",
      description:
        "Gourmet multi-cuisine menu curation, live food stations, regional delicacies, and royal presentation.",
      order: 6,
    },
    {
      id: "tos-7",
      title: "Outfits",
      description:
        "Designer bridal styling, groom couture curation, family wardrobe alignment, and personal fitting assistance.",
      order: 7,
    },
  ];

  const defaultTypeOfEvents = [
    {
      id: "toe-1",
      title: "Wedding",
      description:
        "Grand destination weddings, traditional royal ceremonies, intimate beach weddings, and multi-day celebrations.",
      order: 1,
    },
    {
      id: "toe-2",
      title: "Social",
      description:
        "Milestone anniversaries, birthday galas, engagement soirees, and baby showers.",
      order: 2,
    },
    {
      id: "toe-3",
      title: "Sports",
      description:
        "Corporate sports leagues, celebrity matches, tournament opening ceremonies, and athlete hospitality.",
      order: 3,
    },
    {
      id: "toe-4",
      title: "Concert",
      description:
        "Live music festivals, celebrity artist performances, stage acoustic engineering, and crowd management.",
      order: 4,
    },
    {
      id: "toe-5",
      title: "Corporate",
      description:
        "Annual conferences, product launches, leadership summits, and award ceremonies.",
      order: 5,
    },
    {
      id: "toe-6",
      title: "Social Gathering",
      description:
        "Exclusive networking cocktail mixers, community festivals, family reunions, and festive soirees.",
      order: 6,
    },
  ];

  const [typeOfServicesList, setTypeOfServicesList] = useState(
    Array.isArray(site.typeOfServices) && site.typeOfServices.length > 0
      ? site.typeOfServices
      : defaultTypeOfServices
  );
  const [editingServiceItem, setEditingServiceItem] = useState(null);

  useEffect(() => {
    if (Array.isArray(site.typeOfServices) && site.typeOfServices.length > 0) {
      setTypeOfServicesList(site.typeOfServices);
    }
  }, [site.typeOfServices]);

  const saveTypeOfServicesList = async (newList) => {
    setTypeOfServicesList(newList);
    try {
      await site.update("typeOfServices", newList);
      showSaved("Type of Services saved successfully in database!");
    } catch (err) {
      console.error("Failed to save Type of Services:", err);
    }
  };

  const deleteServiceItem = (id) => {
    if (window.confirm("Are you sure you want to delete this service type?")) {
      saveTypeOfServicesList(typeOfServicesList.filter((s) => s.id !== id && s._id !== id));
    }
  };

  const moveServiceItem = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= typeOfServicesList.length) return;
    const updated = [...typeOfServicesList];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    saveTypeOfServicesList(updated);
  };

  const saveServiceItemModal = (e) => {
    e.preventDefault();
    const itemData = {
      id: editingServiceItem.id || `tos-${Date.now()}`,
      title: (editingServiceItem.title || "").trim(),
      description: (editingServiceItem.description || "").trim(),
      order: editingServiceItem.order || (editingServiceItem.isNew ? typeOfServicesList.length + 1 : 1),
    };

    if (editingServiceItem.isNew) {
      saveTypeOfServicesList([...typeOfServicesList, itemData]);
    } else {
      const targetId = editingServiceItem.id || editingServiceItem._id;
      saveTypeOfServicesList(
        typeOfServicesList.map((s) => (s.id === targetId || s._id === targetId ? itemData : s))
      );
    }
    setEditingServiceItem(null);
  };

  // 2. Type of Events State
  const [typeOfEventsList, setTypeOfEventsList] = useState(
    Array.isArray(site.typeOfEvents) && site.typeOfEvents.length > 0
      ? site.typeOfEvents
      : defaultTypeOfEvents
  );
  const [editingEventItem, setEditingEventItem] = useState(null);

  useEffect(() => {
    if (Array.isArray(site.typeOfEvents) && site.typeOfEvents.length > 0) {
      setTypeOfEventsList(site.typeOfEvents);
    }
  }, [site.typeOfEvents]);

  const saveTypeOfEventsList = async (newList) => {
    setTypeOfEventsList(newList);
    try {
      await site.update("typeOfEvents", newList);
      showSaved("Type of Events saved successfully in database!");
    } catch (err) {
      console.error("Failed to save Type of Events:", err);
    }
  };

  const deleteEventItem = (id) => {
    if (window.confirm("Are you sure you want to delete this event type?")) {
      saveTypeOfEventsList(typeOfEventsList.filter((e) => e.id !== id && e._id !== id));
    }
  };

  const moveEventItem = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= typeOfEventsList.length) return;
    const updated = [...typeOfEventsList];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    saveTypeOfEventsList(updated);
  };

  const saveEventItemModal = (e) => {
    e.preventDefault();
    const itemData = {
      id: editingEventItem.id || `toe-${Date.now()}`,
      title: (editingEventItem.title || "").trim(),
      description: (editingEventItem.description || "").trim(),
      order: editingEventItem.order || (editingEventItem.isNew ? typeOfEventsList.length + 1 : 1),
    };

    if (editingEventItem.isNew) {
      saveTypeOfEventsList([...typeOfEventsList, itemData]);
    } else {
      const targetId = editingEventItem.id || editingEventItem._id;
      saveTypeOfEventsList(
        typeOfEventsList.map((ev) => (ev.id === targetId || ev._id === targetId ? itemData : ev))
      );
    }
    setEditingEventItem(null);
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
    buttonText: "Call For Enquiry",
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
      {/* Header & Sub-Tab Navigation Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="font-display text-2xl text-ink">Services &amp; Packages Manager</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Full dynamic CRUD control over Services Header, Type of Services, Type of Events, Packages, Stationery, and Consultation CTA.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <ModuleRefreshButton site={site} showSaved={showSaved} label="Refresh Services" />
          {/* Sub-Tab Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-card border border-border shadow-xs">
          {[
            { id: "header", label: "Page Header", icon: Layers },
            { id: "typeOfServices", label: `Type of Services (${typeOfServicesList.length})`, icon: Briefcase },
            { id: "typeOfEvents", label: `Type of Events (${typeOfEventsList.length})`, icon: Calendar },
            { id: "packages", label: `Packages (${packages.length})`, icon: DollarSign },
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
      {/* SUB-TAB 0: SERVICES PAGE HERO BANNER */}
      {/* ------------------------------------------------------------- */}
      {subTab === "header" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-display text-lg text-ink">Services Page Hero Banner</h4>
              <p className="text-xs text-muted-foreground">
                Customize the top hero banner displayed on the public Services page (/services).
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* Left Column: Form Controls */}
            <form
              onSubmit={saveHeaderSettings}
              className="lg:col-span-6 space-y-4 rounded-3xl border border-border bg-card p-6 shadow-xs"
            >
              <div>
                <label className="text-xs font-semibold text-ink block mb-1">
                  Badge / Tagline Text
                </label>
                <input
                  type="text"
                  required
                  value={headerForm.badge || ""}
                  onChange={(e) => setHeaderForm({ ...headerForm, badge: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="e.g., Our Offerings"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink block mb-1">
                  Main Page Heading
                </label>
                <input
                  type="text"
                  required
                  value={headerForm.title || ""}
                  onChange={(e) => setHeaderForm({ ...headerForm, title: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="e.g., Complete Wedding & Event Services"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink block mb-1">
                  Subtitle / Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={headerForm.subtitle || ""}
                  onChange={(e) => setHeaderForm({ ...headerForm, subtitle: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="Explore our complete range of wedding planning services..."
                />
              </div>

              <ImageUploadField
                label="Hero Background Banner Image"
                value={headerForm.bgImage || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80"}
                onChange={(url) => setHeaderForm({ ...headerForm, bgImage: url })}
              />

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingHeader}
                  className="btn-luxe gradient-royal w-full text-primary-foreground text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isSavingHeader ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                      <span>Saving Header...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 text-secondary" />
                      <span>Save Services Page Header</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Right Column: Live Header Preview */}
            <div className="lg:col-span-6 space-y-3 sticky top-6">
              <div className="flex items-center justify-between px-2">
                <span className="text-[0.68rem] uppercase tracking-[0.25em] text-primary font-bold flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-secondary" /> Live Services Header Preview
                </span>
                <span className="text-[0.62rem] text-muted-foreground font-mono">
                  Exact Frontend Replica
                </span>
              </div>

              <div className="relative bg-ink rounded-3xl p-8 sm:p-10 text-background overflow-hidden border border-secondary/30 shadow-2xl text-center">
                <div className="absolute inset-0 z-0 opacity-25">
                  <img
                    src={headerForm.bgImage || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80"}
                    alt="Services banner"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/50" />
                </div>

                <div className="relative z-10 space-y-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3.5 py-1 text-[0.68rem] uppercase tracking-[0.3em] text-secondary font-medium backdrop-blur-md">
                    <Sparkles className="h-3 w-3 text-secondary" />
                    <span>{headerForm.badge || "Our Offerings"}</span>
                  </span>

                  <h1 className="font-display text-2xl sm:text-3xl text-white font-normal leading-tight">
                    {headerForm.title || "Complete Wedding & Event Services"}
                  </h1>

                  <div className="rule-gold mx-auto my-3" />

                  <p className="mx-auto max-w-lg text-xs sm:text-sm text-background/80 font-light leading-relaxed">
                    {headerForm.subtitle ||
                      "Explore our complete range of wedding planning services, custom decor, destination management, and rituals."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 1: TYPE OF SERVICES CRUD */}
      {/* ------------------------------------------------------------- */}
      {subTab === "typeOfServices" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-display text-lg text-ink">Type of Services ({typeOfServicesList.length})</h4>
              <p className="text-xs text-muted-foreground">
                Card-based services rendered on the Services page and Homepage under "Type of Services".
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setEditingServiceItem({
                  isNew: true,
                  title: "",
                  description: "",
                  order: typeOfServicesList.length + 1,
                })
              }
              className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Service Type</span>
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/40 text-[0.68rem] uppercase tracking-wider text-muted-foreground font-bold">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4 w-1/4">Heading / Service Name</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-center w-28">Order</th>
                    <th className="py-3 px-4 text-right w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {typeOfServicesList.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4 text-center font-mono text-[0.72rem] text-muted-foreground font-bold">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-ink">
                        <span className="font-display text-sm block">{item.title}</span>
                      </td>
                      <td className="py-3.5 px-4 max-w-md">
                        <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveServiceItem(idx, -1)}
                            className="p-1 rounded-md border border-border hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === typeOfServicesList.length - 1}
                            onClick={() => moveServiceItem(idx, 1)}
                            className="p-1 rounded-md border border-border hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingServiceItem({
                                ...item,
                                isNew: false,
                              })
                            }
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-primary cursor-pointer"
                            title="Edit Service Type"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteServiceItem(item.id || item._id)}
                            className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-destructive cursor-pointer"
                            title="Delete Service Type"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {editingServiceItem && (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(37,27,49,0.38)] backdrop-blur-md p-4 animate-fade-in">
              <form
                onSubmit={saveServiceItemModal}
                className="modal-dialog-luxury bg-[#FFFDFB] max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-4 max-h-[88vh] overflow-y-auto no-scrollbar border border-[#E8E2EE] shadow-luxe"
              >
                <div className="flex justify-between items-center border-b border-[#E8E2EE] pb-3.5">
                  <h4 className="font-display text-xl text-[#2B2138] font-bold">
                    {editingServiceItem.isNew ? "Add New Service Type" : "Edit Service Type"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingServiceItem(null)}
                    className="p-1.5 rounded-full bg-[#F4F1F7] hover:bg-[#EAE4F0] text-[#2B2138] transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2138] block mb-1">Heading / Service Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Event Management, Decor, Outfits"
                    value={editingServiceItem.title}
                    onChange={(e) => setEditingServiceItem({ ...editingServiceItem, title: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2138] block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Enter description for this service type..."
                    value={editingServiceItem.description}
                    onChange={(e) =>
                      setEditingServiceItem({ ...editingServiceItem, description: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E8E2EE] bg-white p-3 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                  />
                  <span className="text-[0.68rem] text-[#7E7688] mt-1 block">
                    Card displays a line-clamped preview automatically to keep uniform heights, and clicking the Eye button opens the full description in a popup.
                  </span>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#E8E2EE]">
                  <button
                    type="button"
                    onClick={() => setEditingServiceItem(null)}
                    className="btn-modal-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-modal-primary"
                  >
                    Save Service Type
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 2: TYPE OF EVENTS CRUD */}
      {/* ------------------------------------------------------------- */}
      {subTab === "typeOfEvents" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-display text-lg text-ink">Type of Events ({typeOfEventsList.length})</h4>
              <p className="text-xs text-muted-foreground">
                Card-based events rendered on the Services page and Homepage under "Type of Events".
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setEditingEventItem({
                  isNew: true,
                  title: "",
                  description: "",
                  order: typeOfEventsList.length + 1,
                })
              }
              className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Event Type</span>
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/40 text-[0.68rem] uppercase tracking-wider text-muted-foreground font-bold">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4 w-1/4">Heading / Event Name</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-center w-28">Order</th>
                    <th className="py-3 px-4 text-right w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {typeOfEventsList.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4 text-center font-mono text-[0.72rem] text-muted-foreground font-bold">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-ink">
                        <span className="font-display text-sm block">{item.title}</span>
                      </td>
                      <td className="py-3.5 px-4 max-w-md">
                        <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveEventItem(idx, -1)}
                            className="p-1 rounded-md border border-border hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === typeOfEventsList.length - 1}
                            onClick={() => moveEventItem(idx, 1)}
                            className="p-1 rounded-md border border-border hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingEventItem({
                                ...item,
                                isNew: false,
                              })
                            }
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-primary cursor-pointer"
                            title="Edit Event Type"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteEventItem(item.id || item._id)}
                            className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-destructive cursor-pointer"
                            title="Delete Event Type"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {editingEventItem && (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(37,27,49,0.38)] backdrop-blur-md p-4 animate-fade-in">
              <form
                onSubmit={saveEventItemModal}
                className="modal-dialog-luxury bg-[#FFFDFB] max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-4 max-h-[88vh] overflow-y-auto no-scrollbar border border-[#E8E2EE] shadow-luxe"
              >
                <div className="flex justify-between items-center border-b border-[#E8E2EE] pb-3.5">
                  <h4 className="font-display text-xl text-[#2B2138] font-bold">
                    {editingEventItem.isNew ? "Add New Event Type" : "Edit Event Type"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingEventItem(null)}
                    className="p-1.5 rounded-full bg-[#F4F1F7] hover:bg-[#EAE4F0] text-[#2B2138] transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2138] block mb-1">Heading / Event Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Wedding, Corporate, Concert, Sports"
                    value={editingEventItem.title}
                    onChange={(e) => setEditingEventItem({ ...editingEventItem, title: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2138] block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Enter description for this event type..."
                    value={editingEventItem.description}
                    onChange={(e) =>
                      setEditingEventItem({ ...editingEventItem, description: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E8E2EE] bg-white p-3 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                  />
                  <span className="text-[0.68rem] text-[#7E7688] mt-1 block">
                    Card displays a line-clamped preview automatically to keep uniform heights, and clicking the Eye button opens the full description in a popup.
                  </span>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#E8E2EE]">
                  <button
                    type="button"
                    onClick={() => setEditingEventItem(null)}
                    className="btn-modal-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-modal-primary"
                  >
                    Save Event Type
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
                  tag: "Custom Plan",
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
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(37,27,49,0.38)] backdrop-blur-md p-4 animate-fade-in">
              <form
                onSubmit={handleSavePkgModal}
                className="modal-dialog-luxury bg-[#FFFDFB] max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-4 max-h-[88vh] overflow-y-auto no-scrollbar border border-[#E8E2EE] shadow-luxe"
              >
                <div className="flex justify-between items-center border-b border-[#E8E2EE] pb-3.5">
                  <h4 className="font-display text-lg text-[#2B2138] font-bold">
                    {editingPkg.isNew ? "Add New Package Tier" : "Edit Package Tier"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingPkg(null)}
                    className="p-1.5 rounded-full bg-[#F4F1F7] hover:bg-[#EAE4F0] text-[#2B2138] transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2138] block mb-1">Tier Name</label>
                  <input
                    type="text"
                    required
                    value={editingPkg.name || ""}
                    onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                    placeholder="e.g. The Royal Heritage Experience"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#2B2138] block mb-1">Starting Price</label>
                    <input
                      type="text"
                      required
                      value={editingPkg.price || ""}
                      onChange={(e) => setEditingPkg({ ...editingPkg, price: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                      placeholder="e.g. ₹5,50,000"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#2B2138] block mb-1">Badge / Tag</label>
                    <input
                      type="text"
                      value={editingPkg.tag || ""}
                      onChange={(e) => setEditingPkg({ ...editingPkg, tag: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                      placeholder="e.g. Full-Service Luxury"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2138] block mb-1">
                    Included Features (one per line)
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={editingPkg.features || ""}
                    onChange={(e) => setEditingPkg({ ...editingPkg, features: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E2EE] bg-white p-3 text-xs font-mono text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                    placeholder={"End-to-End Wedding Management\n3D Mandap & Stage Renders\nDedicated Bride & Groom Shadows"}
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="pkg-featured-toggle"
                    checked={Boolean(editingPkg.featured)}
                    onChange={(e) => setEditingPkg({ ...editingPkg, featured: e.target.checked })}
                    className="h-4 w-4 rounded border-[#E8E2EE] text-[#6A439E] focus:ring-[#6A439E] cursor-pointer"
                  />
                  <label htmlFor="pkg-featured-toggle" className="text-xs font-semibold text-[#2B2138] cursor-pointer">
                    Highlight as Featured / Most Chosen Tier
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#E8E2EE]">
                  <button
                    type="button"
                    onClick={() => setEditingPkg(null)}
                    className="btn-modal-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-modal-primary"
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
              <h4 className="font-display text-lg text-ink">Wedding Ceremonies &amp; Functions ({ceremonies.length})</h4>
              <p className="text-xs text-muted-foreground">
                Wedding functions &amp; rituals rendered under "Wedding Functions &amp; Ceremonies".
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
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(37,27,49,0.38)] backdrop-blur-md p-4 animate-fade-in">
              <form
                onSubmit={saveCeremonyModal}
                className="modal-dialog-luxury bg-[#FFFDFB] max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-4 max-h-[88vh] overflow-y-auto no-scrollbar border border-[#E8E2EE] shadow-luxe"
              >
                <div className="flex justify-between items-center border-b border-[#E8E2EE] pb-3.5">
                  <h4 className="font-display text-lg text-[#2B2138] font-bold">
                    {editingCeremony.isNew ? "Add New Ceremony" : "Edit Ceremony"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingCeremony(null)}
                    className="p-1.5 rounded-full bg-[#F4F1F7] hover:bg-[#EAE4F0] text-[#2B2138] transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2138] block mb-1">Ceremony Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mehendi & Sangeet Soirée"
                    value={editingCeremony.name || ""}
                    onChange={(e) => setEditingCeremony({ ...editingCeremony, name: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#2B2138] block mb-1">Subtitle</label>
                    <input
                      type="text"
                      placeholder="e.g. Rhythmic Celebrations & Glitz"
                      value={editingCeremony.subtitle || ""}
                      onChange={(e) => setEditingCeremony({ ...editingCeremony, subtitle: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#2B2138] block mb-1">Theme Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Bohemian Glamour, Vedic Heritage"
                      value={editingCeremony.theme || ""}
                      onChange={(e) => setEditingCeremony({ ...editingCeremony, theme: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2138] block mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Detailed explanation of how Confianza coordinates this function..."
                    value={editingCeremony.description || ""}
                    onChange={(e) =>
                      setEditingCeremony({ ...editingCeremony, description: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E8E2EE] bg-white p-3 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2138] block mb-1">
                    Key Highlights &amp; Deliverables (One per line)
                  </label>
                  <textarea
                    rows={4}
                    placeholder={"Choreographed couple entry\nLive DJ & Sound rider sync\nSignature mocktail bar flow"}
                    value={editingCeremony.highlights || ""}
                    onChange={(e) =>
                      setEditingCeremony({ ...editingCeremony, highlights: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E8E2EE] bg-white p-3 font-mono text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                  />
                </div>

                <ImageUploadField
                  label="Ceremony Photo Cover"
                  value={editingCeremony.image || ""}
                  onChange={(url) => setEditingCeremony({ ...editingCeremony, image: url })}
                />

                <div className="flex justify-end gap-3 pt-3 border-t border-[#E8E2EE]">
                  <button
                    type="button"
                    onClick={() => setEditingCeremony(null)}
                    className="btn-modal-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-modal-primary"
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
              <h4 className="font-display text-lg text-ink">Wedding Stationery &amp; Welcome Items ({stationery.length})</h4>
              <p className="text-xs text-muted-foreground">
                Physical guest items rendered under "Wedding Stationery &amp; Welcome Items".
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
                  badge: "Stationery",
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
                Click "Add Stationery Item" above to showcase wedding stationery &amp; guest welcome items.
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
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(37,27,49,0.38)] backdrop-blur-md p-4 animate-fade-in">
              <form
                onSubmit={saveStationeryModal}
                className="modal-dialog-luxury bg-[#FFFDFB] max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-4 max-h-[88vh] overflow-y-auto no-scrollbar border border-[#E8E2EE] shadow-luxe"
              >
                <div className="flex justify-between items-center border-b border-[#E8E2EE] pb-3.5">
                  <h4 className="font-display text-lg text-[#2B2138] font-bold">
                    {editingStationery.isNew ? "Add Stationery Item" : "Edit Stationery Item"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingStationery(null)}
                    className="p-1.5 rounded-full bg-[#F4F1F7] hover:bg-[#EAE4F0] text-[#2B2138] transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2138] block mb-1">Item Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Custom Itinerary Cards"
                    value={editingStationery.title || ""}
                    onChange={(e) => setEditingStationery({ ...editingStationery, title: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#2B2138] block mb-1">Subtitle</label>
                    <input
                      type="text"
                      placeholder="e.g. Room & Welcome Placements"
                      value={editingStationery.subtitle || ""}
                      onChange={(e) => setEditingStationery({ ...editingStationery, subtitle: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#2B2138] block mb-1">Badge Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Guest Itinerary, Key Jackets"
                      value={editingStationery.badge || ""}
                      onChange={(e) => setEditingStationery({ ...editingStationery, badge: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2138] block mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe how this luxury physical touchpoint elevates guest experience..."
                    value={editingStationery.description || ""}
                    onChange={(e) =>
                      setEditingStationery({ ...editingStationery, description: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E8E2EE] bg-white p-3 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                  />
                </div>

                <ImageUploadField
                  label="Stationery Photo"
                  value={editingStationery.image || ""}
                  onChange={(url) => setEditingStationery({ ...editingStationery, image: url })}
                />

                <div className="flex justify-end gap-3 pt-3 border-t border-[#E8E2EE]">
                  <button
                    type="button"
                    onClick={() => setEditingStationery(null)}
                    className="btn-modal-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-modal-primary"
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
                placeholder="e.g. Call For Enquiry"
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

/**
 * Enforces a strict max limit of 4 featured testimonials for Homepage & Portfolio.
 * If enabling a 5th review, automatically unticks the first/oldest selected review.
 */
function enforceMaxFeaturedTestimonials(list, newlySelectedId) {
  const MAX_FEATURED = 4;
  const featured = (list || []).filter((item) => Boolean(item.showOnPortfolio));

  if (featured.length <= MAX_FEATURED) {
    return list;
  }

  const excessCount = featured.length - MAX_FEATURED;
  let evicted = 0;

  return list.map((item) => {
    const isThisItem =
      (item.id && String(item.id) === String(newlySelectedId)) ||
      (item._id && String(item._id) === String(newlySelectedId));

    if (!isThisItem && item.showOnPortfolio && evicted < excessCount) {
      evicted++;
      return { ...item, showOnPortfolio: false };
    }
    return item;
  });
}

// Rule: Maximum 6 Instagram posts featured on Homepage (View on Home).
// If a user selects a 7th post with "showOnHome: true", automatically unselect the oldest/first selected one (FIFO).
function enforceMaxFeaturedInstagram(list, newlySelectedId) {
  const MAX_FEATURED = 6;
  const featured = (list || []).filter((item) => Boolean(item.showOnHome));

  if (featured.length <= MAX_FEATURED) {
    return list;
  }

  const excessCount = featured.length - MAX_FEATURED;
  let evicted = 0;

  return list.map((item) => {
    const isThisItem =
      (item.id && String(item.id) === String(newlySelectedId)) ||
      (item._id && String(item._id) === String(newlySelectedId));

    if (!isThisItem && item.showOnHome && evicted < excessCount) {
      evicted++;
      return { ...item, showOnHome: false };
    }
    return item;
  });
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

  // 4. Section heading state (Moments of Joy & Celebration)
  const [sectionData, setSectionData] = useState(site.portfolioSection || {
    eyebrow: "Our Works",
    title: "Moments of Joy & Celebration",
    subtitle: "Explore our portfolio of mandaps, reception stages, cheerful haldi events, and destination weddings across India.",
  });

  // 5. Gratitude / Testimonials state
  const [testimonials, setTestimonials] = useState(site.testimonials || []);
  const [testimonialsHeader, setTestimonialsHeader] = useState(site.testimonialsHeader || {
    eyebrow: "Client Reviews",
    title: "What Couples & Families Say",
    subtitle: "Read how couples and families experienced their wedding celebrations with Confianza.",
  });
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  // 6. Portfolio CTA state
  const [ctaData, setCtaData] = useState(site.portfolioCta || {
    eyebrow: "LET'S PLAN YOUR SPECIAL DAY",
    headline: "Ready to Plan Your Dream Wedding?",
    subtitle: "Connect directly with founders Ashish Wankhede and Rutik Pund to discuss your venue options, custom 3D decor ideas, and event timeline.",
    buttonText: "Call For Enquiry",
    buttonLink: "/contact",
    notice: "Free Consultation • No Obligation",
    perks: [
      "1-on-1 Planning Meeting",
      "Talk Directly with Founders (Ashish & Rutik)",
      "Realistic 3D Decor Previews",
      "Clear & Honest Cost Estimates",
    ],
  });

  // Keep local states in reactive sync with site context (isolated per slice)
  useEffect(() => {
    if (Array.isArray(site.portfolio)) {
      setItems(site.portfolio);
    }
  }, [site.portfolio]);

  useEffect(() => {
    if (Array.isArray(site.portfolioCategories) && site.portfolioCategories.length > 0) {
      setCategories(site.portfolioCategories);
    }
  }, [site.portfolioCategories]);

  useEffect(() => {
    if (site.portfolioHeader && Object.keys(site.portfolioHeader).length > 0) {
      setHeaderData(site.portfolioHeader);
    }
  }, [site.portfolioHeader]);

  useEffect(() => {
    if (site.portfolioSection && Object.keys(site.portfolioSection).length > 0) {
      setSectionData(site.portfolioSection);
    }
  }, [site.portfolioSection]);

  useEffect(() => {
    if (Array.isArray(site.testimonials)) {
      setTestimonials(site.testimonials);
    }
  }, [site.testimonials]);

  useEffect(() => {
    if (site.testimonialsHeader && Object.keys(site.testimonialsHeader).length > 0) {
      setTestimonialsHeader(site.testimonialsHeader);
    }
  }, [site.testimonialsHeader]);

  useEffect(() => {
    if (site.portfolioCta && Object.keys(site.portfolioCta).length > 0) {
      setCtaData(site.portfolioCta);
    }
  }, [site.portfolioCta]);

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

  const featuredCount = testimonials.filter((t) => Boolean(t.showOnPortfolio)).length;

  // Sub-tabs configuration
  const subTabs = [
    { id: "portfolio-works", label: `Signature Works (${items.length})` },
    { id: "categories", label: `Category Filter Pills (${categories.length})` },
    { id: "header-banner", label: "Page Header Banner" },
    { id: "gratitude", label: `Words of Gratitude (${featuredCount}/4)` },
    { id: "cta-banner", label: "Consultation CTA Banner" },
  ];

  // Category names list for dropdowns
  const categoryNames = categories.map((c) => (typeof c === "string" ? c : c.name || c.label)).filter(Boolean);

  // Filtered portfolio list for admin view
  const filteredAdminItems = items.filter((p) => {
    const matchCat =
      selectedFilterCategory === "All" ||
      ((p.category || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "").trim() ===
        selectedFilterCategory.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "").trim());
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
      {/* 1. PORTFOLIO WORKS CATALOG SUB-TAB */}
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
                  Our Works Section
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
                  placeholder="e.g. Our Works"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">Section Main Title</label>
                <input
                  type="text"
                  value={sectionData.title || ""}
                  onChange={(e) => setSectionData({ ...sectionData, title: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold"
                  placeholder="e.g. Moments of Joy & Celebration"
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
                placeholder="Explore our portfolio of mandaps, reception stages, cheerful haldi events..."
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
                  Manage real wedding showcases rendered on the <span className="text-primary font-semibold">Portfolio page</span> and Homepage. Deleting all items will strictly display 0 items.
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
                          onClick={() => setEditingProject({ ...p, isNew: false })}
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
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(37,27,49,0.38)] backdrop-blur-md p-4 animate-fade-in">
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
                    const targetId = editingProject.id;
                    const targetMongoId = editingProject._id;
                    updated = items.map((x) => {
                      const isMatch = Boolean(
                        (targetId && x.id === targetId) ||
                        (targetMongoId && (x._id === targetMongoId || x.id === targetMongoId)) ||
                        (targetId && x._id === targetId)
                      );
                      if (isMatch) return cleanProject;
                      return x;
                    });
                  }
                  savePortfolioList(updated);
                  setEditingProject(null);
                }}
                className="modal-dialog-luxury bg-[#FFFDFB] max-w-lg w-full max-h-[88vh] overflow-y-auto no-scrollbar rounded-3xl p-6 sm:p-8 space-y-4 border border-[#E8E2EE] shadow-luxe"
              >
                <div className="flex justify-between items-center border-b border-[#E8E2EE] pb-3.5">
                  <h4 className="font-display text-lg text-[#2B2138] font-bold">
                    {editingProject.isNew ? "Add Portfolio Project" : "Edit Portfolio Project"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="p-1.5 rounded-full bg-[#F4F1F7] hover:bg-[#EAE4F0] text-[#2B2138] transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2138] block mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                    placeholder="e.g. Lakeside Royal Mandap"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-[#2B2138] block mb-1">Category</label>
                    <select
                      value={editingProject.category || categoryNames[0] || "Destination Weddings"}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15 cursor-pointer"
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
                    <label className="font-semibold text-[#2B2138] block mb-1">Venue / City Location</label>
                    <input
                      type="text"
                      value={editingProject.location || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
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
                  <label className="font-semibold text-[#2B2138] block mb-1">
                    Highlight Story / Concept Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.description || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E2EE] bg-white p-3 text-xs leading-relaxed text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                    placeholder="Describe the architectural concept, floral conditioning, or custom decor elements..."
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="featured-check"
                    checked={Boolean(editingProject.featured)}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    className="rounded border-[#E8E2EE] text-[#6A439E] focus:ring-[#6A439E] cursor-pointer h-4 w-4"
                  />
                  <label htmlFor="featured-check" className="text-xs font-semibold text-[#2B2138] cursor-pointer">
                    Mark as Featured Showcase Project
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#E8E2EE]">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="btn-modal-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-modal-primary"
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
                  Manage the category pill filters displayed on the public <span className="text-primary font-semibold">Portfolio page</span> and Homepage showcase.
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

            {/* Table / List View */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border/80 bg-muted/40 text-[0.68rem] uppercase tracking-wider text-muted-foreground font-bold">
                      <th className="py-3 px-4 w-12 text-center">#</th>
                      <th className="py-3 px-4">Category Name</th>
                      <th className="py-3 px-4 text-center">Linked Projects</th>
                      <th className="py-3 px-4 text-center">
                        Front Row Visibility ({categories.filter((c) => Boolean(typeof c === "object" ? c.showInFront : false)).length}/3 Selected)
                      </th>
                      <th className="py-3 px-4 text-center w-28">Order</th>
                      <th className="py-3 px-4 text-right w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {categories.map((cat, idx) => {
                      const cName = typeof cat === "string" ? cat : cat.name || cat.label;
                      const cId = typeof cat === "string" ? `cat-${idx}` : cat.id || `cat-${idx}`;
                      const count = items.filter((p) => {
                        const pc = (p.category || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "").trim();
                        const nc = (cName || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "").trim();
                        return Boolean(pc && nc && pc === nc);
                      }).length;
                      const isFront = typeof cat === "object" ? Boolean(cat.showInFront) : false;

                      return (
                        <tr key={cId} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3.5 px-4 text-center font-mono text-[0.72rem] text-muted-foreground font-bold">
                            {String(idx + 1).padStart(2, "0")}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-display font-bold text-ink text-sm block">
                              {cName}
                            </span>
                            <span className="text-[0.68rem] text-muted-foreground font-mono">
                              slug: {typeof cat === "object" ? cat.slug || cat.id : cName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.68rem] font-bold bg-primary/10 text-primary">
                              {count} {count === 1 ? "project" : "projects"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = limitFrontSelection(categories, cId, 3);
                                saveCategoriesList(updated);
                              }}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer shadow-xs ${
                                isFront
                                  ? "gradient-gold text-ink ring-1 ring-secondary/40 font-bold"
                                  : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                              }`}
                              title="Toggle whether this category appears in the 4 front pills on the Portfolio page"
                            >
                              <Sparkles className="h-3 w-3" />
                              <span>{isFront ? "★ In Front Row" : "In Dropdown"}</span>
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => {
                                  if (idx === 0) return;
                                  const updated = [...categories];
                                  const temp = updated[idx];
                                  updated[idx] = updated[idx - 1];
                                  updated[idx - 1] = temp;
                                  saveCategoriesList(updated);
                                }}
                                className="p-1 rounded-md border border-border hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                title="Move Up"
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === categories.length - 1}
                                onClick={() => {
                                  if (idx === categories.length - 1) return;
                                  const updated = [...categories];
                                  const temp = updated[idx];
                                  updated[idx] = updated[idx + 1];
                                  updated[idx + 1] = temp;
                                  saveCategoriesList(updated);
                                }}
                                className="p-1 rounded-md border border-border hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                title="Move Down"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingCategory({
                                    isNew: false,
                                    _origName: cName,
                                    name: cName,
                                    id: cId,
                                    showInFront: isFront,
                                  })
                                }
                                className="p-1.5 rounded-lg border border-border hover:bg-muted text-primary cursor-pointer"
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
                                className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-destructive cursor-pointer"
                                title="Delete Category"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Category Add/Edit Modal */}
          {editingCategory && (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(37,27,49,0.38)] backdrop-blur-md p-4 animate-fade-in">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const cleanName = editingCategory.name.trim();
                  if (!cleanName) return;

                  const cleanCat = {
                    id: editingCategory.id || `cat-${Date.now()}`,
                    name: cleanName,
                    slug: cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    showInFront: Boolean(editingCategory.showInFront),
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
                      return typeof c === "string" ? { id: `cat-${currName}`, name: currName, slug: currName.toLowerCase().replace(/[^a-z0-9]+/g, "-") } : c;
                    });
                  }
                  if (cleanCat.showInFront) {
                    updated = enforceMaxFrontCategories(updated, cleanCat.id, 3);
                  }
                  saveCategoriesList(updated);
                  setEditingCategory(null);
                }}
                className="modal-dialog-luxury bg-[#FFFDFB] max-w-sm w-full rounded-3xl p-6 space-y-4 max-h-[88vh] overflow-y-auto no-scrollbar border border-[#E8E2EE] shadow-luxe"
              >
                <div className="flex justify-between items-center border-b border-[#E8E2EE] pb-3.5">
                  <h4 className="font-display text-base text-[#2B2138] font-bold">
                    {editingCategory.isNew ? "Add Category" : "Edit Category"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="p-1.5 rounded-full bg-[#F4F1F7] hover:bg-[#EAE4F0] text-[#2B2138] transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2138] block mb-1">
                    Category Name / Label
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                    placeholder="e.g. Royal Baraat & Entry"
                  />
                </div>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E8E2EE] bg-white cursor-pointer hover:bg-[#F4F1F7]/60 transition">
                  <input
                    type="checkbox"
                    checked={Boolean(editingCategory.showInFront)}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, showInFront: e.target.checked })
                    }
                    className="rounded border-[#E8E2EE] text-[#6A439E] focus:ring-[#6A439E] h-4 w-4 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[#2B2138] block">
                      Show in Front Row (Public Page Pill)
                    </span>
                    <span className="text-[0.68rem] text-[#7E7688] block">
                      Top 3 categories marked "Show in Front" appear directly as pills; others appear in the "More Categories" dropdown.
                    </span>
                  </div>
                </label>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#E8E2EE]">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="btn-modal-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-modal-primary"
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
                    Customize the top hero banner title, subtitle, badge, and cover photo on the <span className="text-primary font-semibold">Portfolio page</span>.
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
                  <Eye className="h-3.5 w-3.5 text-secondary" /> Live Portfolio Header Preview
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
                  Client Reviews &amp; Testimonials Section
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
                  placeholder="e.g. Client Reviews & Stories"
                />
              </div>
              <div>
                <label className="font-semibold text-foreground block mb-1">Main Section Title</label>
                <input
                  type="text"
                  value={testimonialsHeader.title || ""}
                  onChange={(e) => setTestimonialsHeader({ ...testimonialsHeader, title: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold"
                  placeholder="e.g. Real Stories from Happy Families"
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
                  Manage real couple testimonials rendered on the <span className="text-primary font-semibold">Portfolio page</span>, <span className="text-primary font-semibold">Testimonials page</span>, and Homepage.
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
                    showOnPortfolio: true,
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
                            <div className="mt-1">
                              {t.showOnPortfolio ? (
                                <span className="inline-block rounded-full bg-secondary/20 text-secondary text-[0.62rem] font-bold px-2 py-0.5 border border-secondary/40">
                                  ✓ On Portfolio
                                </span>
                              ) : (
                                <span className="inline-block rounded-full bg-muted text-muted-foreground text-[0.62rem] font-medium px-2 py-0.5">
                                  Hidden from Portfolio
                                </span>
                              )}
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

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const targetId = t.id || t._id;
                          const nextVal = !t.showOnPortfolio;
                          let updated = testimonials.map((x) =>
                            (x.id && x.id === targetId) || (x._id && x._id === targetId)
                              ? { ...x, showOnPortfolio: nextVal }
                              : x
                          );
                          if (nextVal) {
                            updated = enforceMaxFeaturedTestimonials(updated, targetId);
                          }
                          saveTestimonialsList(updated);
                        }}
                        className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 cursor-pointer transition ${
                          t.showOnPortfolio
                            ? "border-secondary/60 bg-secondary/15 text-secondary font-semibold"
                            : "border-border hover:bg-muted text-muted-foreground"
                        }`}
                        title={t.showOnPortfolio ? "Click to hide from Homepage & Portfolio Words of Gratitude" : "Click to feature on Homepage & Portfolio Words of Gratitude"}
                      >
                        <span>{t.showOnPortfolio ? "On Home & Portfolio ✓" : "+ Feature on Home & Portfolio"}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
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
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Testimonial Add / Edit Modal */}
          {editingTestimonial && (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(37,27,49,0.38)] backdrop-blur-md p-4 animate-fade-in">
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
                  if (cleanTestimonial.showOnPortfolio) {
                    updated = enforceMaxFeaturedTestimonials(updated, cleanTestimonial.id || cleanTestimonial._id);
                  }
                  saveTestimonialsList(updated);
                  setEditingTestimonial(null);
                }}
                className="modal-dialog-luxury bg-[#FFFDFB] max-w-md w-full max-h-[88vh] overflow-y-auto no-scrollbar rounded-3xl p-6 sm:p-8 space-y-4 border border-[#E8E2EE] shadow-luxe"
              >
                <div className="flex justify-between items-center border-b border-[#E8E2EE] pb-3.5">
                  <h4 className="font-display text-lg text-[#2B2138] font-bold">
                    {editingTestimonial.isNew ? "Add Couple Story" : "Edit Couple Story"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingTestimonial(null)}
                    className="p-1.5 rounded-full bg-[#F4F1F7] hover:bg-[#EAE4F0] text-[#2B2138] transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2138] block mb-1">Couple Names *</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.name || ""}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15 font-medium"
                    placeholder="e.g. Sneha & Rohan Kulkarni"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-[#2B2138] block mb-1">Relationship / Role</label>
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
                            className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3 py-2 text-xs text-[#2B2138] focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15 cursor-pointer"
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
                              className="w-full rounded-xl border border-[#C2A438]/60 bg-white px-3 py-2 text-xs text-[#2B2138] ring-1 ring-[#C2A438]/20 animate-fade-in"
                              placeholder="e.g. Sister of the Bride, Family Friend, Groom's Cousin"
                            />
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  <div>
                    <label className="font-semibold text-[#2B2138] block mb-1">Event Category</label>
                    {(() => {
                      const standardCats = Array.isArray(site.testimonialsCategories) && site.testimonialsCategories.length > 0
                        ? site.testimonialsCategories.map((c) => (typeof c === "string" ? c : c.name || c.label)).filter(Boolean)
                        : [
                            "Royal & Destination Weddings",
                            "Mandap & Rituals",
                            "Haldi & Sangeet",
                            "Grand Receptions",
                            "Corporate Celebrations",
                          ];
                      const currentCat = editingTestimonial.category || standardCats[0];

                      return (
                        <select
                          value={currentCat}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, category: e.target.value })}
                          className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3 py-2 text-xs text-[#2B2138] focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15 cursor-pointer"
                        >
                          {standardCats.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                      );
                    })()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-[#2B2138] block mb-1">Wedding Location</label>
                    <input
                      type="text"
                      value={editingTestimonial.location || ""}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, location: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                      placeholder="e.g. Udaipur & Pune"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#2B2138] block mb-1">Wedding Date / Year</label>
                    <input
                      type="text"
                      value={editingTestimonial.date || ""}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, date: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                      placeholder="e.g. 14 Feb 2025"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2138] block mb-1">
                    Rating Stars (1 to 5)
                  </label>
                  <select
                    value={editingTestimonial.rating || 5}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                    className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15 cursor-pointer"
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
                  <label className="font-semibold text-[#2B2138] block mb-1">Testimonial Quote / Narrative</label>
                  <textarea
                    rows={4}
                    required
                    value={editingTestimonial.text || ""}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E2EE] bg-white p-3 text-xs leading-relaxed text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                    placeholder="Enter what the couple said about their wedding planning experience..."
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="test-show-on-portfolio"
                    checked={Boolean(editingTestimonial.showOnPortfolio)}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, showOnPortfolio: e.target.checked })}
                    className="rounded border-[#E8E2EE] text-[#6A439E] focus:ring-[#6A439E] cursor-pointer h-4 w-4"
                  />
                  <label htmlFor="test-show-on-portfolio" className="text-xs font-semibold text-[#2B2138] cursor-pointer">
                    Show on Homepage &amp; Portfolio (Words of Gratitude)
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#E8E2EE]">
                  <button
                    type="button"
                    onClick={() => setEditingTestimonial(null)}
                    className="btn-modal-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-modal-primary"
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
        <div className="grid lg:grid-cols-12 gap-8 animate-fade-in">
          {/* Left Column: CTA Editor Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveCta(ctaData);
            }}
            className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div>
                <div className="flex items-center gap-1.5 text-primary text-xs uppercase tracking-[0.25em] font-bold">
                  <Sparkles className="h-4 w-4 text-secondary" />
                  <span>Portfolio Consultation Action</span>
                </div>
                <h3 className="font-display text-xl text-ink font-bold mt-1">
                  Free Consultation Banner
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Customize the luxury action card displayed at the bottom of the <span className="text-primary font-semibold">Portfolio page</span>.
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
                  placeholder="Let’s Plan Your Dream Wedding"
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
                placeholder="Talk directly with Ashish Wankhede and Rutik Pund. We will help you pick a venue, show you 3D decor designs, and handle every detail from start to finish."
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">Primary Button Label</label>
                <input
                  type="text"
                  value={ctaData.buttonText || ""}
                  onChange={(e) => setCtaData({ ...ctaData, buttonText: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs"
                  placeholder="Call For Enquiry"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Button Destination Link</label>
                <input
                  type="text"
                  value={ctaData.buttonLink || "/contact"}
                  onChange={(e) => setCtaData({ ...ctaData, buttonLink: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs"
                  placeholder="/contact"
                />
              </div>
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
                      title="Remove perk"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </form>

          {/* Right Column: Live Luxury Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground px-1">
              <Eye className="h-4 w-4 text-primary" />
              <span>Live Client Preview</span>
              <span className="text-[0.68rem] font-normal text-muted-foreground ml-auto">
                Simulated Portfolio Bottom Banner
              </span>
            </div>

            <div className="relative rounded-3xl p-6 sm:p-8 bg-ink text-background overflow-hidden border border-white/10 shadow-2xl text-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/30 via-ink to-ink pointer-events-none" />
              <div className="absolute top-0 right-1/4 w-48 h-48 bg-secondary/15 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-3">
                <span className="inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.25em] text-secondary font-bold">
                  <Sparkles className="h-3.5 w-3.5 text-secondary" />
                  <span>{ctaData.eyebrow || "WHERE WEDDINGS BECOME STORIES"}</span>
                </span>

                <h3 className="font-display text-lg sm:text-xl text-white font-normal leading-snug">
                  {ctaData.headline || "Let’s Plan Your Dream Wedding"}
                </h3>

                <div className="rule-gold mx-auto my-2" />

                <p className="text-xs text-background/85 font-light leading-relaxed max-w-md mx-auto">
                  {ctaData.subtitle ||
                    "Talk directly with Ashish Wankhede and Rutik Pund. We will help you pick a venue, show you 3D decor designs, and handle every detail from start to finish."}
                </p>

                {/* Consultation Perks Chips */}
                {Array.isArray(ctaData.perks) && ctaData.perks.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 pb-1">
                    {ctaData.perks.map((perk, pIdx) => (
                      <span
                        key={pIdx}
                        className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[0.68rem] text-champagne backdrop-blur-md border border-white/15"
                      >
                        <CheckCircle2 className="h-3 w-3 text-secondary shrink-0" />
                        <span>{perk}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Simulated Action Buttons */}
                <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
                  <div className="btn-luxe gradient-gold text-ink font-bold py-2 px-4 text-[0.7rem] tracking-wider uppercase flex items-center gap-1.5 shadow-md">
                    <span>{ctaData.buttonText || "Call For Enquiry"}</span>
                  </div>
                  <div className="btn-luxe bg-white/10 text-white border border-white/20 py-2 px-3 text-[0.7rem] font-semibold flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-secondary" />
                    <span>Call Us</span>
                  </div>
                </div>

                {ctaData.notice && (
                  <p className="text-[0.65rem] text-background/60 font-light pt-2">
                    {ctaData.notice}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
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
  const [isSaving, setIsSaving] = useState(false);

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
    { id: "reception", name: "Grand Receptions", slug: "reception", order: 3 },
    { id: "haldi-sangeet", name: "Haldi & Sangeet", slug: "haldi-sangeet", order: 4 },
    { id: "bridal-entries", name: "Bridal Entries & Portraits", slug: "bridal-entries", order: 5 },
    { id: "destination", name: "Destination Venues", slug: "destination", order: 6 },
    { id: "spatial-decor", name: "Mandap & Flower Decor", slug: "spatial-decor", order: 7 },
  ];

  const [categories, setCategories] = useState(
    Array.isArray(site.galleryCategories) && site.galleryCategories.length > 0
      ? site.galleryCategories
      : defaultCategories
  );
  const [editingCategory, setEditingCategory] = useState(null);

  // Hero Banner State
  const defaultHeroHeader = {
    badge: "Wedding Photo Gallery",
    eyebrow: "OUR PHOTOS",
    title: "Wedding Photo Gallery",
    subtitle:
      "Photos of our mandap decor, flower arrangements, bridal entries, and grand wedding stages.",
    image: "https://res.cloudinary.com/tridevsosync/image/upload/v1790881511/confianza_heroes/gallery_hero_banner.jpg",
    stats: [
      "500+ Happy Weddings Across India",
      "15+ Cities Across India",
      "100% Custom 3D Decor Designs",
      "Smooth On-Ground Execution",
    ],
  };
  const [heroHeader, setHeroHeader] = useState(site.galleryHeader || defaultHeroHeader);

  // Spatial Craft Highlights State (From PDF Materials)
  const defaultHighlights = [
    {
      id: "mandap-sanctum",
      title: "Mandap & Traditional Ritual Setups",
      subtitle: "Sacred Setups & Floral Art",
      description:
        "From temple pillars to lotus pools, our mandaps blend traditional Vedic rituals with fresh seasonal flowers.",
      icon: "Sparkles",
      badge: "Traditional Mandap",
    },
    {
      id: "stage-production",
      title: "Stage, Lighting & Special Effects",
      subtitle: "3D Design-to-Reality Execution",
      description:
        "Moving light setups, LED screens, cold pyro fireworks, and stages managed with precise timing.",
      icon: "Layers",
      badge: "Stage & Lights",
    },
    {
      id: "haldi-carnival",
      title: "Themed Haldi & Mehendi Setups",
      subtitle: "Bright Yellow Blooms & Traditional Art",
      description:
        "Phoolon ki Holi setups, marigold canopies, brass urlis, mehendi cabanas, and energetic dhol tasha groups.",
      icon: "Award",
      badge: "Haldi & Mehendi",
    },
    {
      id: "luxe-tablescapes",
      title: "Guest Tables & Welcome Hampers",
      subtitle: "Warm Hospitality & Personal Touches",
      description:
        "Chandeliers, candlelit centerpieces, personalized luggage tags, itinerary cards, and dedicated guest hospitality.",
      icon: "Users",
      badge: "Guest Hospitality",
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
    eyebrow: "LET'S PLAN YOUR SPECIAL DAY",
    headline: "Let Us Plan Your Dream Wedding",
    subtitle:
      "Connect directly with founders Ashish Wankhede and Rutik Pund in Warje, Pune to plan your wedding decor.",
    buttonText: "Call For Enquiry",
    buttonLink: "/contact",
    notice: "Free 1-on-1 Consultation • Direct Founder Interaction",
    perks: [
      "60–90 Min Planning Session",
      "Talk Directly with Founders (Ashish & Rutik)",
      "3D Decor Design Previews",
      "Clear & Honest Cost Estimates",
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
    setIsSaving(true);
    setInstagramPosts(newPosts);
    try {
      await site.update("instagram", newPosts);
      showSaved("Instagram posts updated successfully in MongoDB!");
    } catch (err) {
      console.error("Failed to save instagram posts:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const saveInstagramHeader = async () => {
    setIsSaving(true);
    try {
      await site.update("instagramHeader", instaHeader);
      showSaved("Instagram header settings saved successfully in MongoDB!");
    } catch (err) {
      console.error("Failed to save instagram header:", err);
    } finally {
      setIsSaving(false);
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

  const featuredOnHomeCount = (instagramPosts || []).filter((p) => Boolean(p.showOnHome)).length;

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
            Manage Photo Gallery, Filter Categories, Hero Banner, Social Feed & Highlights
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
                category: categories[1]?.name || "Mandap & Decor",
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
          { id: "photos", label: `Photo Gallery (${gallery.length})`, icon: ImageIcon },
          { id: "categories", label: `Categories (${categories.length})`, icon: Layers },
          { id: "header", label: "Hero Header Banner", icon: Sliders },
          { id: "highlights", label: `Decor & Stage Highlights (${highlights.length})`, icon: Sparkles },
          { id: "instagram", label: `Follow Journey (${featuredOnHomeCount}/6 on Home)`, icon: MessageSquareQuote },
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

      {/* SUBTAB 1: Photo Gallery Archive */}
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
                          onClick={() => setEditingPhoto({ ...g, isNew: false })}
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

          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/40 text-[0.68rem] uppercase tracking-wider text-muted-foreground font-bold">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Category Name</th>
                    <th className="py-3 px-4 text-center">Linked Photos</th>
                    <th className="py-3 px-4 text-center">
                      Front Row Visibility ({categories.filter((c) => Boolean(c.showInFront) && c.id !== "all" && c.slug !== "all").length}/3 Selected)
                    </th>
                    <th className="py-3 px-4 text-center w-28">Order</th>
                    <th className="py-3 px-4 text-right w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
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

                    const isAll = cat.id === "all" || cat.slug === "all";
                    const isFront = Boolean(cat.showInFront);

                    return (
                      <tr key={cat.id || idx} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4 text-center font-mono text-[0.72rem] text-muted-foreground font-bold">
                          {String(idx + 1).padStart(2, "0")}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-display font-bold text-ink text-sm block">
                            {cat.name}
                          </span>
                          <span className="text-[0.68rem] text-muted-foreground font-mono">
                            slug: {cat.slug || cat.id}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.68rem] font-bold bg-primary/10 text-primary">
                            {count} {count === 1 ? "photo" : "photos"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {isAll ? (
                            <span className="text-[0.68rem] text-muted-foreground italic">Always Front</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = limitFrontSelection(categories, cat.id || cat.slug || cat.name, 3);
                                saveCategories(updated);
                              }}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer shadow-xs ${
                                isFront
                                  ? "gradient-gold text-ink ring-1 ring-secondary/40 font-bold"
                                  : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                              }`}
                              title="Toggle whether this category appears in the 4 front pills on the Gallery page"
                            >
                              <Sparkles className="h-3 w-3" />
                              <span>{isFront ? "★ In Front Row" : "In Dropdown"}</span>
                            </button>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                if (idx === 0) return;
                                const updated = [...categories];
                                const temp = updated[idx];
                                updated[idx] = updated[idx - 1];
                                updated[idx - 1] = temp;
                                saveCategories(updated);
                              }}
                              className="p-1 rounded-md border border-border hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === categories.length - 1}
                              onClick={() => {
                                if (idx === categories.length - 1) return;
                                const updated = [...categories];
                                const temp = updated[idx];
                                updated[idx] = updated[idx + 1];
                                updated[idx + 1] = temp;
                                saveCategories(updated);
                              }}
                              className="p-1 rounded-md border border-border hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingCategory({ ...cat, showInFront: isFront })}
                              className="p-1.5 rounded-lg border border-border hover:bg-muted text-primary cursor-pointer"
                              title="Edit Category"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            {!isAll && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Delete category "${cat.name}"?`)) {
                                    saveCategories(categories.filter((c) => c.id !== cat.id));
                                  }
                                }}
                                className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-destructive cursor-pointer"
                                title="Delete Category"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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

      {/* SUBTAB 4: Decor & Stage Highlights */}
      {subTab === "highlights" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 p-4 bg-card rounded-2xl border border-border">
            <div>
              <h4 className="font-display text-base text-ink font-semibold">
                Signature Decor &amp; Stage Highlights
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Aesthetic feature cards showcasing Confianza's specialty decor and production from our wedding portfolio.
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
              disabled={isSaving}
              onClick={saveInstagramHeader}
              className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-5 font-semibold cursor-pointer flex items-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-secondary" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Instagram Settings</span>
              )}
            </button>
          </div>

          {/* Instagram Posts Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 p-4 bg-card rounded-2xl border border-border">
              <div>
                <h4 className="font-display text-base text-ink font-semibold">
                  Instagram Posts &amp; Reels Showcase ({instagramPosts.length})
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
                    showOnHome: featuredOnHomeCount < 6,
                  })
                }
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="h-4 w-4 text-secondary" />
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
                {instagramPosts.map((post, pIdx) => {
                  const pId = post.id || post._id || `insta-${pIdx}`;
                  return (
                    <div
                      key={pId}
                      className="relative group rounded-2xl overflow-hidden border border-border bg-card shadow-xs flex flex-col justify-between"
                    >
                      <div className="aspect-square w-full overflow-hidden bg-muted/40 relative">
                        <img
                          src={post.image || "/images/hero-1.jpg"}
                          alt={post.caption || "Instagram Post"}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = "/images/hero-1.jpg";
                          }}
                        />
                        {post.showOnHome && (
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-0.5 rounded-full bg-secondary text-primary-foreground text-[0.6rem] font-bold shadow-xs">
                              ✓ Home
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-2.5 bg-card text-xs flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1 text-[0.68rem] text-secondary font-medium">
                            <span>❤️ {(post.likes || 0).toLocaleString()}</span>
                          </div>
                          <p className="text-[0.62rem] text-muted-foreground line-clamp-2 mt-1 leading-tight">
                            {post.caption || "Instagram Reel"}
                          </p>
                        </div>
                        <div className="flex items-center justify-between gap-1 mt-2 pt-1.5 border-t border-border/50">
                          <button
                            type="button"
                            onClick={() => {
                              const willShow = !post.showOnHome;
                              const targetId = post.id || post._id || `insta-${pIdx}`;
                              let updated = instagramPosts.map((p, idx) => {
                                const pMatch =
                                  (p.id && targetId && String(p.id) === String(targetId)) ||
                                  (p._id && targetId && String(p._id) === String(targetId)) ||
                                  idx === pIdx;
                                return pMatch ? { ...p, showOnHome: willShow } : p;
                              });
                              if (willShow) {
                                updated = enforceMaxFeaturedInstagram(updated, targetId);
                              }
                              saveInstagram(updated);
                            }}
                            className={`px-2 py-1 rounded-lg text-[0.62rem] font-semibold transition cursor-pointer flex items-center gap-1 ${
                              post.showOnHome
                                ? "bg-secondary text-primary-foreground shadow-xs"
                                : "bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                            title={
                              post.showOnHome
                                ? "Featured on Homepage (Click to disable)"
                                : "Click to feature on Homepage (Max 6, auto-replaces oldest)"
                            }
                          >
                            {post.showOnHome ? "✓ On Home" : "View on Home"}
                          </button>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingInstaPost({ ...post, isNew: false })}
                              className="p-1 rounded-lg bg-accent text-foreground hover:text-secondary cursor-pointer"
                              title="Edit Post Card"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm("Delete this Instagram post card?")) {
                                  const targetId = post.id || post._id;
                                  const updated = instagramPosts.filter(
                                    (p) => (p.id ? p.id !== targetId : p._id !== targetId) && p !== post
                                  );
                                  saveInstagram(updated);
                                }
                              }}
                              className="p-1 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive hover:text-white cursor-pointer"
                              title="Delete Post Card"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(37,27,49,0.38)] backdrop-blur-md p-4 animate-fade-in">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingPhoto.isNew) {
                const newPhoto = {
                  ...editingPhoto,
                  id: editingPhoto.id || `gallery-${Date.now()}`,
                  order: Number(editingPhoto.order) || gallery.length + 1,
                };
                delete newPhoto.isNew;
                saveGalleryPhotos([...gallery, newPhoto]);
              } else {
                const targetId = editingPhoto.id;
                const targetMongoId = editingPhoto._id;
                const updatedList = gallery.map((x) => {
                  const isMatch = Boolean(
                    (targetId && x.id === targetId) ||
                    (targetMongoId && (x._id === targetMongoId || x.id === targetMongoId)) ||
                    (targetId && x._id === targetId)
                  );
                  if (isMatch) {
                    const clean = { ...editingPhoto };
                    delete clean.isNew;
                    return clean;
                  }
                  return x;
                });
                saveGalleryPhotos(updatedList);
              }
              setEditingPhoto(null);
            }}
            className="modal-dialog-luxury bg-[#FFFDFB] max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-4 max-h-[88vh] overflow-y-auto no-scrollbar border border-[#E8E2EE] shadow-luxe"
          >
            <div className="flex justify-between items-center border-b border-[#E8E2EE] pb-3.5">
              <h4 className="font-display text-lg text-[#2B2138] font-bold">
                {editingPhoto.isNew ? "Add Gallery Photo" : "Edit Photo Details"}
              </h4>
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="p-1.5 rounded-full bg-[#F4F1F7] hover:bg-[#EAE4F0] text-[#2B2138] transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2B2138] block mb-1">Photo Caption / Title</label>
              <input
                type="text"
                required
                value={editingPhoto.caption || ""}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, caption: e.target.value })}
                placeholder="e.g. Sacred Vedic Mandap with Lotus Arch"
                className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div>
                <label className="font-semibold text-[#2B2138] block mb-1">Category</label>
                <select
                  value={editingPhoto.category || categories[1]?.name || "Mandap Architecture"}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value })}
                  className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15 cursor-pointer"
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
                <label className="font-semibold text-[#2B2138] block mb-1">Location</label>
                <input
                  type="text"
                  value={editingPhoto.location || ""}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, location: e.target.value })}
                  placeholder="e.g. Udaipur, Rajasthan or Pune"
                  className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                />
              </div>
            </div>

            <ImageUploadField
              label="Gallery Image (Cloudinary <= 2MB)"
              value={editingPhoto.image || ""}
              onChange={(url) => setEditingPhoto({ ...editingPhoto, image: url })}
            />

            <div>
              <label className="text-xs font-semibold text-[#2B2138] block mb-1">Display Order #</label>
              <input
                type="number"
                value={editingPhoto.order || 1}
                onChange={(e) => setEditingPhoto({ ...editingPhoto, order: Number(e.target.value) })}
                className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#E8E2EE]">
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="btn-modal-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-modal-primary"
              >
                Save Photo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: Add/Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(37,27,49,0.38)] backdrop-blur-md p-4 animate-fade-in">
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

              let updated;
              if (editingCategory.isNew) {
                updated = [...categories, cleanCat];
              } else {
                updated = categories.map((c) => (c.id === editingCategory.id ? cleanCat : c));
              }
              if (cleanCat.showInFront) {
                updated = enforceMaxFrontCategories(updated, cleanCat.id, 3);
              }
              saveCategories(updated);
              setEditingCategory(null);
            }}
            className="modal-dialog-luxury bg-[#FFFDFB] max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-4 max-h-[88vh] overflow-y-auto no-scrollbar border border-[#E8E2EE] shadow-luxe"
          >
            <div className="flex justify-between items-center border-b border-[#E8E2EE] pb-3">
              <h4 className="font-display text-lg text-[#2B2138] font-semibold">
                {editingCategory.isNew ? "Add New Category" : "Edit Category"}
              </h4>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="text-[#7E7688] hover:text-[#2B2138] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2B2138] block mb-1">Category Name</label>
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
                className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
              />
            </div>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E8E2EE] bg-white cursor-pointer hover:bg-[#F4F1F7]/60 transition">
              <input
                type="checkbox"
                checked={Boolean(editingCategory.showInFront)}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, showInFront: e.target.checked })
                }
                className="rounded border-[#E8E2EE] text-[#6A439E] focus:ring-[#6A439E] h-4 w-4 cursor-pointer"
              />
              <div>
                <span className="text-xs font-semibold text-[#2B2138] block">
                  Show in Front Row (Public Page Pill)
                </span>
                <span className="text-[0.68rem] text-[#7E7688] block">
                  Top 3 categories marked "Show in Front" appear directly as pills; others appear in the "More Categories" dropdown.
                </span>
              </div>
            </label>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#E8E2EE]">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="btn-modal-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-modal-primary"
              >
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: Add/Edit Highlight Card Modal */}
      {editingHighlight && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(37,27,49,0.38)] backdrop-blur-md p-4 animate-fade-in">
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
            className="modal-dialog-luxury bg-[#FFFDFB] max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-4 max-h-[88vh] overflow-y-auto no-scrollbar border border-[#E8E2EE] shadow-luxe"
          >
            <div className="flex justify-between items-center border-b border-[#E8E2EE] pb-3">
              <h4 className="font-display text-lg text-[#2B2138] font-semibold">
                {editingHighlight.isNew ? "Add Spatial Highlight" : "Edit Highlight"}
              </h4>
              <button
                type="button"
                onClick={() => setEditingHighlight(null)}
                className="text-[#7E7688] hover:text-[#2B2138] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2B2138] block mb-1">Card Title</label>
              <input
                type="text"
                required
                value={editingHighlight.title || ""}
                onChange={(e) => setEditingHighlight({ ...editingHighlight, title: e.target.value })}
                placeholder="e.g. Mandap & Traditional Ritual Setups"
                className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2B2138] block mb-1">Subtitle</label>
              <input
                type="text"
                value={editingHighlight.subtitle || ""}
                onChange={(e) => setEditingHighlight({ ...editingHighlight, subtitle: e.target.value })}
                placeholder="e.g. Sacred Setups & Floral Art"
                className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2B2138] block mb-1">Description</label>
              <textarea
                rows={3}
                required
                value={editingHighlight.description || ""}
                onChange={(e) => setEditingHighlight({ ...editingHighlight, description: e.target.value })}
                className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-[#2B2138] block mb-1">Badge</label>
                <input
                  type="text"
                  value={editingHighlight.badge || ""}
                  onChange={(e) => setEditingHighlight({ ...editingHighlight, badge: e.target.value })}
                  placeholder="e.g. Traditional Mandap"
                  className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#2B2138] block mb-1">Icon</label>
                <select
                  value={editingHighlight.icon || "Sparkles"}
                  onChange={(e) => setEditingHighlight({ ...editingHighlight, icon: e.target.value })}
                  className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15 cursor-pointer"
                >
                  <option value="Sparkles">Sparkles</option>
                  <option value="Layers">Layers</option>
                  <option value="Award">Award</option>
                  <option value="Users">Users</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#E8E2EE]">
              <button
                type="button"
                onClick={() => setEditingHighlight(null)}
                className="btn-modal-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-modal-primary"
              >
                Save Highlight
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: Add/Edit Instagram Post Modal */}
      {editingInstaPost && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(37,27,49,0.38)] backdrop-blur-md p-4 animate-fade-in">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!editingInstaPost.image || !editingInstaPost.image.trim()) {
                alert("Please upload or enter an image for the Instagram post card.");
                return;
              }
              const targetId = editingInstaPost.id || editingInstaPost._id;
              const cleanPost = {
                id: targetId || `insta-${Date.now()}`,
                image: editingInstaPost.image.trim(),
                likes: Number(editingInstaPost.likes) || 0,
                caption: (editingInstaPost.caption || "").trim(),
                url:
                  (editingInstaPost.url || "").trim() ||
                  instaHeader.url ||
                  "https://www.instagram.com/confianza_events",
                showOnHome: Boolean(editingInstaPost.showOnHome),
              };

              let updatedList;
              if (editingInstaPost.isNew) {
                updatedList = [...instagramPosts, cleanPost];
              } else {
                updatedList = instagramPosts.map((p) => {
                  const isMatch = Boolean(
                    (targetId && (p.id === targetId || p._id === targetId)) ||
                    (p.image && p.image === editingInstaPost.image)
                  );
                  return isMatch ? cleanPost : p;
                });
              }

              if (cleanPost.showOnHome) {
                updatedList = enforceMaxFeaturedInstagram(updatedList, cleanPost.id || cleanPost._id);
              }

              await saveInstagram(updatedList);
              setEditingInstaPost(null);
            }}
            className="modal-dialog-luxury bg-[#FFFDFB] max-w-md w-full rounded-3xl p-6 sm:p-8 space-y-4 max-h-[88vh] overflow-y-auto no-scrollbar border border-[#E8E2EE] shadow-luxe"
          >
            <div className="flex justify-between items-center border-b border-[#E8E2EE] pb-3">
              <h4 className="font-display text-lg text-[#2B2138] font-semibold">
                {editingInstaPost.isNew ? "Add Instagram Post" : "Edit Post Card"}
              </h4>
              <button
                type="button"
                onClick={() => setEditingInstaPost(null)}
                className="text-[#7E7688] hover:text-[#2B2138] cursor-pointer"
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
              <label className="text-xs font-semibold text-[#2B2138] block mb-1">Likes Count</label>
              <input
                type="number"
                value={editingInstaPost.likes || 0}
                onChange={(e) =>
                  setEditingInstaPost({ ...editingInstaPost, likes: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2B2138] block mb-1">Caption / Hashtags</label>
              <input
                type="text"
                value={editingInstaPost.caption || ""}
                onChange={(e) =>
                  setEditingInstaPost({ ...editingInstaPost, caption: e.target.value })
                }
                placeholder="e.g. Mandap reveal at Lake Pichola #ConfianzaWeddings"
                className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2B2138] block mb-1">Post / Reel Link (Optional)</label>
              <input
                type="text"
                value={editingInstaPost.url || ""}
                onChange={(e) =>
                  setEditingInstaPost({ ...editingInstaPost, url: e.target.value })
                }
                placeholder="https://www.instagram.com/p/..."
                className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
              />
            </div>

            <div className="p-3 rounded-2xl bg-[#F9F8FB] border border-[#E8E2EE] flex items-start gap-3">
              <input
                type="checkbox"
                id="insta-show-on-home"
                checked={Boolean(editingInstaPost.showOnHome)}
                onChange={(e) =>
                  setEditingInstaPost({ ...editingInstaPost, showOnHome: e.target.checked })
                }
                className="mt-0.5 h-4 w-4 rounded border-[#E8E2EE] text-[#6A439E] focus:ring-[#6A439E] cursor-pointer"
              />
              <label htmlFor="insta-show-on-home" className="text-xs cursor-pointer select-none">
                <span className="font-semibold text-[#2B2138] block">
                  View on Home ({featuredOnHomeCount}/6 selected)
                </span>
                <span className="text-[0.68rem] text-[#7E7688] block mt-0.5 leading-tight">
                  Feature this post in the Homepage "Follow Our Journey" grid. If 6 are already selected, selecting this will automatically replace the oldest selected post.
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#E8E2EE]">
              <button
                type="button"
                onClick={() => setEditingInstaPost(null)}
                className="btn-modal-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="btn-modal-primary flex items-center gap-1.5"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#C2A438]" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Post</span>
                )}
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
    eyebrow: site.testimonialsHeader?.eyebrow || "Client Reviews",
    title: site.testimonialsHeader?.title || "What Couples & Families Say",
    subtitle:
      site.testimonialsHeader?.subtitle ||
      "Read honest feedback and reviews from couples and families whose weddings we planned.",
    image:
      site.testimonialsHeader?.image ||
      "https://res.cloudinary.com/tridevsosync/image/upload/v1790838224/confianza_portfolio/portfolio_hero_banner.jpg",
    stats: site.testimonialsHeader?.stats || [
      "5.0 Average Couple Rating ★",
      "500+ Happy Weddings Across India",
      "100% On-Time Event Flow",
      "Zero Day-Of Stress for Families",
    ],
  });

  // Categories
  const [categories, setCategories] = useState(
    site.testimonialsCategories || [
      { id: "royal-destination", name: "Royal & Destination Weddings", slug: "royal-destination", order: 1 },
      { id: "mandap-rituals", name: "Mandap & Rituals", slug: "mandap-rituals", order: 2 },
      { id: "haldi-sangeet", name: "Haldi & Sangeet", slug: "haldi-sangeet", order: 3 },
      { id: "receptions", name: "Grand Receptions", slug: "receptions", order: 4 },
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
        title: "Personal Helpers",
        subtitle: "Dedicated Support for Bride & Groom",
        description:
          "A dedicated helper assists with every personal need, dress touch-ups, snacks, and water behind the scenes.",
        icon: "Users",
        badge: "Personal Care",
      },
      {
        id: "ritual-mgmt",
        title: "Smooth Pooja Coordination",
        subtitle: "Complete Pandit & Pooja Item Setup",
        description:
          "Complete management of traditional poojas (Baraat, Milni, Pheras, Havan) ensuring all rituals happen at the right time.",
        icon: "Sparkles",
        badge: "Traditional Rituals",
      },
      {
        id: "production-decor",
        title: "3D Decor Design & Setup",
        subtitle: "Exact Real-Life Match to 3D Previews",
        description:
          "From custom stage backdrops to fresh flower arrangements and lighting, everything matches your 3D design preview.",
        icon: "Layers",
        badge: "Custom 3D Decor",
      },
      {
        id: "show-runner",
        title: "On-Ground Event Direction",
        subtitle: "Smooth On-Time Stage Coordination",
        description:
          "Our ground team coordinates artists, DJs, sound engineers, and couple entries with clear timing.",
        icon: "Award",
        badge: "Event Direction",
      },
    ]
  );

  // FAQs
  const [faqs, setFaqs] = useState(
    site.testimonialsFaq || [
      {
        question: "How do I share our wedding review and photos?",
        answer:
          "Click the 'Share Your Story' button on this page. You can write your review, select your star rating, and upload your wedding photos directly.",
      },
      {
        question: "Can we include a video link or Instagram Reel?",
        answer:
          "Yes! You can paste your YouTube, Vimeo, Google Drive, or Instagram Reel link in the video link field. Our team will feature the interactive video player on your review card.",
      },
      {
        question: "Why does my review say 'Waiting for Approval'?",
        answer:
          "To ensure all reviews are genuine and appropriate, our team checks all submissions before publishing them on the website.",
      },
      {
        question: "How long does review verification take?",
        answer: "Our team usually checks and publishes new reviews within 12 to 24 hours.",
      },
    ]
  );

  // Sync local state when site context updates from server/background
  useEffect(() => {
    if (Array.isArray(site.testimonialsCategories) && site.testimonialsCategories.length > 0) {
      setCategories(site.testimonialsCategories);
    }
  }, [site.testimonialsCategories]);

  useEffect(() => {
    if (site.testimonialsHeader && Object.keys(site.testimonialsHeader).length > 0) {
      setHeaderData(site.testimonialsHeader);
    }
  }, [site.testimonialsHeader]);

  useEffect(() => {
    if (Array.isArray(site.testimonialsExperience) && site.testimonialsExperience.length > 0) {
      setExperiencePillars(site.testimonialsExperience);
    }
  }, [site.testimonialsExperience]);

  useEffect(() => {
    if (Array.isArray(site.testimonialsFaq) && site.testimonialsFaq.length > 0) {
      setFaqs(site.testimonialsFaq);
    }
  }, [site.testimonialsFaq]);

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
    showSaved("Testimonials saved successfully in MongoDB!");
  };

  // Save Header & Trust Stats
  const saveHeader = async (newHeader) => {
    setIsSaving(true);
    setHeaderData(newHeader);
    await site.update("testimonialsHeader", newHeader);
    setIsSaving(false);
    showSaved("Testimonials hero header saved successfully in MongoDB!");
  };

  // Save Categories
  const saveCategories = async (newCategories) => {
    setIsSaving(true);
    setCategories(newCategories);
    await site.update("testimonialsCategories", newCategories);
    setIsSaving(false);
    showSaved("Testimonials categories updated successfully in MongoDB!");
  };

  // Save Experience & FAQs
  const saveFaqs = async (newList) => {
    const listToSave = Array.isArray(newList) ? newList : faqs;
    setIsSaving(true);
    setFaqs(listToSave);
    await site.update("testimonialsFaq", listToSave);
    setIsSaving(false);
    showSaved("Testimonials FAQs saved successfully in MongoDB!");
  };

  const saveExperiencePillars = async (newList) => {
    const listToSave = Array.isArray(newList) ? newList : experiencePillars;
    setIsSaving(true);
    setExperiencePillars(listToSave);
    await site.update("testimonialsExperience", listToSave);
    setIsSaving(false);
    showSaved("Experience pillars saved successfully in MongoDB!");
  };

  const saveExperienceAndFaqs = async () => {
    setIsSaving(true);
    setExperiencePillars(experiencePillars);
    setFaqs(faqs);
    await site.update("testimonialsExperience", experiencePillars);
    await site.update("testimonialsFaq", faqs);
    setIsSaving(false);
    showSaved("Experience pillars and FAQs saved successfully in MongoDB!");
  };

  // Filtered Published Reviews
  const filteredPublished = publishedReviews.filter((t) => {
    if (selectedCategory !== "All") {
      if (selectedCategory === "Video Reviews & Reels") {
        if (!t.videoUrl) return false;
      } else {
        const norm1 = (t.category || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "").trim();
        const norm2 = selectedCategory.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "").trim();
        if (norm1 !== norm2) return false;
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
                  Reviews submitted by couples &amp; guests from the <span className="text-primary font-semibold">Testimonials page</span>. Once approved, they go live on the website.
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
                  Currently active couple stories rendered on the <span className="text-primary font-semibold">Testimonials page</span>, <span className="text-primary font-semibold">Portfolio page</span>, and Homepage.
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
                    showOnPortfolio: false,
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

                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {t.category && (
                          <span className="text-[0.65rem] uppercase tracking-wider text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded">
                            {t.category}
                          </span>
                        )}
                        {t.showOnPortfolio ? (
                          <span className="text-[0.65rem] uppercase tracking-wider text-secondary font-bold bg-secondary/15 border border-secondary/40 px-2 py-0.5 rounded">
                            ✓ On Portfolio
                          </span>
                        ) : (
                          <span className="text-[0.65rem] uppercase tracking-wider text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded">
                            Hidden from Portfolio
                          </span>
                        )}
                      </div>

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
                      <button
                        type="button"
                        onClick={() => {
                          const targetId = t.id || t._id;
                          const nextVal = !t.showOnPortfolio;
                          let updated = allReviews.map((x) =>
                            (x.id && x.id === targetId) || (x._id && x._id === targetId)
                              ? { ...x, showOnPortfolio: nextVal }
                              : x
                          );
                          if (nextVal) {
                            updated = enforceMaxFeaturedTestimonials(updated, targetId);
                          }
                          saveReviewsList(updated);
                        }}
                        className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 cursor-pointer transition ${
                          t.showOnPortfolio
                            ? "border-secondary/60 bg-secondary/15 text-secondary font-semibold"
                            : "border-border hover:bg-muted text-muted-foreground"
                        }`}
                        title={t.showOnPortfolio ? "Click to hide from Homepage & Portfolio Words of Gratitude" : "Click to feature on Homepage & Portfolio Words of Gratitude"}
                      >
                        <span>{t.showOnPortfolio ? "On Home & Portfolio ✓" : "+ Feature on Home & Portfolio"}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingReview({ ...t, isNew: false })}
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
                    Customize the hero header, cover image, and trust metrics on the <span className="text-primary font-semibold">Testimonials page</span>.
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
                  <Eye className="h-3.5 w-3.5 text-secondary" /> Live Testimonials Hero Preview
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
                  Manage the filter pills displayed on the public <span className="text-primary font-semibold">Testimonials page</span>.
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

            {/* Table / List View */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border/80 bg-muted/40 text-[0.68rem] uppercase tracking-wider text-muted-foreground font-bold">
                      <th className="py-3 px-4 w-12 text-center">#</th>
                      <th className="py-3 px-4">Category Name</th>
                      <th className="py-3 px-4 text-center">Linked Reviews</th>
                      <th className="py-3 px-4 text-center">
                        Front Row Visibility ({categories.filter((c) => Boolean(typeof c === "object" ? c.showInFront : false)).length}/3 Selected)
                      </th>
                      <th className="py-3 px-4 text-center w-28">Order</th>
                      <th className="py-3 px-4 text-right w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {categories.map((cat, idx) => {
                      const cName = typeof cat === "string" ? cat : cat.name || cat.label;
                      const cId = typeof cat === "string" ? `cat-${idx}` : cat.id || `cat-${idx}`;
                      const count = allReviews.filter((t) => {
                        const norm1 = (t.category || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "").trim();
                        const norm2 = cName.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "").trim();
                        return Boolean(norm1 && norm2 && norm1 === norm2);
                      }).length;
                      const isFront = typeof cat === "object" ? Boolean(cat.showInFront) : false;

                      return (
                        <tr key={cId} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3.5 px-4 text-center font-mono text-[0.72rem] text-muted-foreground font-bold">
                            {String(idx + 1).padStart(2, "0")}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-display font-bold text-ink text-sm block">
                              {cName}
                            </span>
                            <span className="text-[0.68rem] text-muted-foreground font-mono">
                              slug: {typeof cat === "object" ? cat.slug || cat.id : cName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.68rem] font-bold bg-primary/10 text-primary">
                              {count} {count === 1 ? "review" : "reviews"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = limitFrontSelection(categories, cId, 3);
                                saveCategories(updated);
                              }}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer shadow-xs ${
                                isFront
                                  ? "gradient-gold text-ink ring-1 ring-secondary/40 font-bold"
                                  : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted"
                              }`}
                              title="Toggle whether this category appears in the 4 front pills on the Testimonials page"
                            >
                              <Sparkles className="h-3 w-3" />
                              <span>{isFront ? "★ In Front Row" : "In Dropdown"}</span>
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => {
                                  if (idx === 0) return;
                                  const updated = [...categories];
                                  const temp = updated[idx];
                                  updated[idx] = updated[idx - 1];
                                  updated[idx - 1] = temp;
                                  saveCategories(updated);
                                }}
                                className="p-1 rounded-md border border-border hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                title="Move Up"
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === categories.length - 1}
                                onClick={() => {
                                  if (idx === categories.length - 1) return;
                                  const updated = [...categories];
                                  const temp = updated[idx];
                                  updated[idx] = updated[idx + 1];
                                  updated[idx + 1] = temp;
                                  saveCategories(updated);
                                }}
                                className="p-1 rounded-md border border-border hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                title="Move Down"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingCategory({
                                    isNew: false,
                                    _origName: cName,
                                    name: cName,
                                    id: cId,
                                    showInFront: isFront,
                                  })
                                }
                                className="p-1.5 rounded-lg border border-border hover:bg-muted text-primary cursor-pointer"
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
                                className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-destructive cursor-pointer"
                                title="Delete Category"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Add / Edit Category Modal */}
          {editingCategory && (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(37,27,49,0.38)] backdrop-blur-md p-4 animate-fade-in">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const cleanName = editingCategory.name.trim();
                  if (!cleanName) return;

                  const cleanCat = {
                    id: editingCategory.id || `cat-${Date.now()}`,
                    name: cleanName,
                    slug: cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    showInFront: Boolean(editingCategory.showInFront),
                  };

                  let updated;
                  if (editingCategory.isNew) {
                    updated = [...categories, cleanCat];
                  } else {
                    updated = categories.map((c) => {
                      const currId = typeof c === "string" ? c : c.id;
                      const currName = typeof c === "string" ? c : c.name || c.label;
                      if (editingCategory.id && currId === editingCategory.id) return cleanCat;
                      if (editingCategory._origName && currName === editingCategory._origName) return cleanCat;
                      return typeof c === "string" ? { id: `cat-${currName}`, name: currName, slug: currName.toLowerCase().replace(/[^a-z0-9]+/g, "-") } : c;
                    });
                  }
                  if (cleanCat.showInFront) {
                    updated = enforceMaxFrontCategories(updated, cleanCat.id, 3);
                  }
                  saveCategories(updated);
                  setEditingCategory(null);
                }}
                className="modal-dialog-luxury bg-[#FFFDFB] max-w-sm w-full rounded-3xl p-6 sm:p-8 space-y-4 max-h-[88vh] overflow-y-auto no-scrollbar border border-[#E8E2EE] shadow-luxe"
              >
                <div className="flex justify-between items-center border-b border-[#E8E2EE] pb-3">
                  <h4 className="font-display text-base text-[#2B2138] font-bold">
                    {editingCategory.isNew ? "Add Category" : "Edit Category"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="text-[#7E7688] hover:text-[#2B2138] cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2B2138] block mb-1">
                    Category Name / Label
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                    placeholder="e.g. Royal Baraat & Entry"
                  />
                </div>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E8E2EE] bg-white cursor-pointer hover:bg-[#F4F1F7]/60 transition">
                  <input
                    type="checkbox"
                    checked={Boolean(editingCategory.showInFront)}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, showInFront: e.target.checked })
                    }
                    className="rounded border-[#E8E2EE] text-[#6A439E] focus:ring-[#6A439E] h-4 w-4 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-semibold text-[#2B2138] block">
                      Show in Front Row (Public Page Pill)
                    </span>
                    <span className="text-[0.68rem] text-[#7E7688] block">
                      Top 3 categories marked "Show in Front" appear directly as pills; others appear in the "More Categories" dropdown.
                    </span>
                  </div>
                </label>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#E8E2EE]">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="btn-modal-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-modal-primary"
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
                onClick={() => saveExperiencePillars(experiencePillars)}
                disabled={isSaving}
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2.5 px-5 flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-60 font-semibold"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 text-secondary" />}
                <span>Save Experience Pillars</span>
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

            <div className="flex justify-end pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={() => saveExperiencePillars(experiencePillars)}
                disabled={isSaving}
                className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-6 flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-60 font-semibold"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 text-secondary" />}
                <span>Save All Pillars</span>
              </button>
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

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const newFaq = {
                      id: `faq-${Date.now()}`,
                      question: "New FAQ Question?",
                      answer: "New detailed answer...",
                    };
                    const updated = [...faqs, newFaq];
                    setFaqs(updated);
                  }}
                  className="btn-luxe gradient-royal text-primary-foreground text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer shadow-sm font-semibold"
                >
                  <Plus className="h-4 w-4 text-secondary" />
                  <span>Add FAQ Item</span>
                </button>

                <button
                  type="button"
                  onClick={() => saveFaqs(faqs)}
                  disabled={isSaving}
                  className="btn-luxe gradient-gold text-ink text-xs py-2 px-5 flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-60 font-bold"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Save FAQs</span>
                </button>
              </div>
            </div>

            {faqs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground bg-card/40">
                <p className="text-xs">No FAQ items yet. Click "+ Add FAQ Item" above to create one.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {faqs.map((faq, fIdx) => (
                  <div key={faq.id || fIdx} className="p-4 rounded-2xl bg-card border border-border space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={faq.question || ""}
                        onChange={(e) => {
                          const updated = [...faqs];
                          updated[fIdx] = { ...updated[fIdx], question: e.target.value };
                          setFaqs(updated);
                        }}
                        className="flex-1 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold"
                        placeholder="Question title..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = faqs.filter((_, i) => i !== fIdx);
                          saveFaqs(updated);
                        }}
                        className="text-destructive p-1.5 rounded-lg hover:bg-destructive/10 cursor-pointer transition"
                        title="Delete Question"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={faq.answer || ""}
                      onChange={(e) => {
                        const updated = [...faqs];
                        updated[fIdx] = { ...updated[fIdx], answer: e.target.value };
                        setFaqs(updated);
                      }}
                      className="w-full rounded-xl border border-border bg-card px-3 py-1.5 text-xs leading-relaxed"
                      placeholder="Detailed answer explanation..."
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/60">
              <button
                type="button"
                onClick={() => {
                  const newFaq = {
                    id: `faq-${Date.now()}`,
                    question: "New FAQ Question?",
                    answer: "New detailed answer...",
                  };
                  setFaqs([...faqs, newFaq]);
                }}
                className="px-4 py-2 rounded-xl border border-border bg-card text-xs hover:bg-muted font-semibold cursor-pointer text-primary"
              >
                + Add Another Question
              </button>

              <button
                type="button"
                onClick={() => saveFaqs(faqs)}
                disabled={isSaving}
                className="btn-luxe gradient-gold text-ink text-xs py-2 px-6 flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-60 font-bold"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>Save All FAQs</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* REVIEW ADD / EDIT MODAL */}
      {/* ============================================================= */}
      {editingReview && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(37,27,49,0.38)] backdrop-blur-md p-4 animate-fade-in">
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
                  const targetId = editingReview.id ? String(editingReview.id) : "";
                  const targetMongoId = editingReview._id ? String(editingReview._id) : "";
                  updated = allReviews.map((x) => {
                    const isMatch = Boolean(
                      (targetId && (String(x.id) === targetId || String(x._id) === targetId)) ||
                      (targetMongoId && (String(x._id) === targetMongoId || String(x.id) === targetMongoId))
                    );
                    return isMatch ? cleanReview : x;
                  });
                }
                if (cleanReview.showOnPortfolio) {
                  updated = enforceMaxFeaturedTestimonials(updated, cleanReview.id || cleanReview._id);
                }
                saveReviewsList(updated);
              }
              setEditingReview(null);
            }}
            className="modal-dialog-luxury bg-[#FFFDFB] max-w-lg w-full max-h-[88vh] overflow-y-auto no-scrollbar rounded-3xl p-6 sm:p-8 space-y-4 border border-[#E8E2EE] shadow-luxe"
          >
            <div className="flex justify-between items-center border-b border-[#E8E2EE] pb-3">
              <h4 className="font-display text-lg text-[#2B2138] font-bold">
                {editingReview.isNew
                  ? "Add New Client Review"
                  : editingReview.isModerationEdit
                  ? "Edit & Approve Submission"
                  : "Edit Review"}
              </h4>
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="text-[#7E7688] hover:text-[#2B2138] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-[#2B2138] block mb-1">Couple / Client Name *</label>
                <input
                  type="text"
                  required
                  value={editingReview.name || ""}
                  onChange={(e) => setEditingReview({ ...editingReview, name: e.target.value })}
                  className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] font-semibold placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                  placeholder="e.g. Ananya & Rohit Roy"
                />
              </div>

              <div>
                <label className="font-semibold text-[#2B2138] block mb-1">Relationship / Role</label>
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
                        className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15 cursor-pointer"
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
                          className="w-full rounded-xl border border-[#C2A438] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] ring-1 ring-[#C2A438]/20 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15 animate-fade-in"
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
                <label className="font-semibold text-[#2B2138] block mb-1">Event Category</label>
                {(() => {
                  const catNames = categories.map((c) => (typeof c === "string" ? c : c.name || c.label)).filter(Boolean);
                  const currentCat = editingReview.category || catNames[0] || "Royal & Destination Weddings";

                  return (
                    <select
                      value={currentCat}
                      onChange={(e) => setEditingReview({ ...editingReview, category: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15 cursor-pointer"
                    >
                      {catNames.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  );
                })()}
              </div>

              <div>
                <label className="font-semibold text-[#2B2138] block mb-1">Venue / City Location</label>
                <input
                  type="text"
                  value={editingReview.location || ""}
                  onChange={(e) => setEditingReview({ ...editingReview, location: e.target.value })}
                  className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                  placeholder="e.g. Udaipur Destination Wedding"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-[#2B2138] block mb-1">Star Rating (0 to 5)</label>
                <select
                  value={editingReview.rating || 5}
                  onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                  className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15 cursor-pointer font-semibold"
                >
                  <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                  <option value={4}>★★★★☆ (4 Stars - Wonderful)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Good)</option>
                  <option value={2}>★★☆☆☆ (2 Stars - Average)</option>
                  <option value={1}>★☆☆☆☆ (1 Star)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#2B2138] block mb-1">Date / Year</label>
                <input
                  type="text"
                  value={editingReview.date || ""}
                  onChange={(e) => setEditingReview({ ...editingReview, date: e.target.value })}
                  className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
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
              <label className="font-semibold text-[#2B2138] block mb-1">Video Testimonial Link (Optional)</label>
              <input
                type="url"
                value={editingReview.videoUrl || ""}
                onChange={(e) => setEditingReview({ ...editingReview, videoUrl: e.target.value })}
                className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] font-mono placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div className="text-xs">
              <label className="font-semibold text-[#2B2138] block mb-1">Review Quote / Love Story Narrative *</label>
              <textarea
                rows={4}
                required
                value={editingReview.text || ""}
                onChange={(e) => setEditingReview({ ...editingReview, text: e.target.value })}
                className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] leading-relaxed placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                placeholder="Enter what the couple said about their wedding..."
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rev-featured"
                  checked={Boolean(editingReview.featured)}
                  onChange={(e) => setEditingReview({ ...editingReview, featured: e.target.checked })}
                  className="rounded border-[#E8E2EE] text-[#6A439E] focus:ring-[#6A439E] cursor-pointer h-4 w-4"
                />
                <label htmlFor="rev-featured" className="text-xs font-semibold text-[#2B2138] cursor-pointer">
                  Featured Review
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rev-show-on-portfolio"
                  checked={Boolean(editingReview.showOnPortfolio)}
                  onChange={(e) => setEditingReview({ ...editingReview, showOnPortfolio: e.target.checked })}
                  className="rounded border-[#E8E2EE] text-[#6A439E] focus:ring-[#6A439E] cursor-pointer h-4 w-4"
                />
                <label htmlFor="rev-show-on-portfolio" className="text-xs font-semibold text-[#2B2138] cursor-pointer">
                  Show on Homepage &amp; Portfolio (Words of Gratitude)
                </label>
              </div>

              {editingReview.status === "pending" && (
                <span className="text-[0.68rem] text-[#6A439E] font-bold bg-[#6A439E]/10 px-2 py-0.5 rounded">
                  Will be approved &amp; published on save
                </span>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#E8E2EE]">
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="btn-modal-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-modal-primary"
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
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(37,27,49,0.38)] backdrop-blur-md p-4 animate-fade-in">
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
            className="modal-dialog-luxury bg-[#FFFDFB] max-w-lg w-full max-h-[88vh] overflow-y-auto no-scrollbar rounded-3xl p-6 sm:p-8 space-y-4 border border-[#E8E2EE] shadow-luxe"
          >
            <div className="flex justify-between items-center border-b border-[#E8E2EE] pb-3">
              <h4 className="font-display text-lg text-[#2B2138] font-bold">
                {editingMember.isNew ? "Add Team Member" : "Edit Team Member"}
              </h4>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="text-[#7E7688] hover:text-[#2B2138] cursor-pointer"
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
                <label className="font-semibold text-[#2B2138] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingMember.name || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                  placeholder="e.g. Radhika Deshmukh"
                />
              </div>

              <div>
                <label className="font-semibold text-[#2B2138] block mb-1">Designation / Role</label>
                <input
                  type="text"
                  required
                  value={editingMember.role || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                  placeholder="e.g. Lead Floral Architect"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-[#2B2138] block mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={editingMember.email || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                  className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                  placeholder="name@confianzaevents.com"
                />
              </div>

              <div>
                <label className="font-semibold text-[#2B2138] block mb-1">Experience</label>
                <input
                  type="text"
                  value={editingMember.experience || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, experience: e.target.value })}
                  className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                  placeholder="e.g. 6+ Years"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="font-semibold text-[#2B2138] block mb-1">
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
                className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                placeholder="Luxury Decor, Spatial Design, Guest Concierge"
              />
            </div>

            <div className="text-xs">
              <label className="font-semibold text-[#2B2138] block mb-1">Bio / Profile Description</label>
              <textarea
                rows={3}
                value={editingMember.bio || ""}
                onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                placeholder="Describe their role and mastery in wedding coordination..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#E8E2EE]">
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="btn-modal-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-modal-primary"
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
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(37,27,49,0.38)] backdrop-blur-md p-4 animate-fade-in">
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
            className="modal-dialog-luxury bg-[#FFFDFB] max-w-2xl w-full max-h-[88vh] overflow-y-auto no-scrollbar rounded-3xl p-6 sm:p-8 space-y-4 border border-[#E8E2EE] shadow-luxe"
          >
            <div className="flex justify-between items-center border-b border-[#E8E2EE] pb-3">
              <h4 className="font-display text-lg text-[#2B2138] font-bold">
                {editing.isNew ? "Write Article" : "Edit Article"}
              </h4>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="text-[#7E7688] hover:text-[#2B2138] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2B2138] block mb-1">Title</label>
              <input
                type="text"
                required
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#2B2138] block mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#2B2138] block mb-1">Date</label>
                <input
                  type="text"
                  required
                  value={editing.date}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                  className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2B2138] block mb-1">Excerpt Summary</label>
              <textarea
                rows={2}
                required
                value={editing.excerpt}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2B2138] block mb-1">Full Article Content</label>
              <textarea
                rows={5}
                required
                value={editing.content}
                onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                className="w-full rounded-xl border border-[#E8E2EE] bg-white px-3.5 py-2.5 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:outline-none focus:border-[#6A439E] focus:ring-2 focus:ring-[#6A439E]/15 leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#E8E2EE]">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="btn-modal-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-modal-primary"
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

