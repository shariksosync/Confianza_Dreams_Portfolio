"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { hero as heroSeed } from "../mock/hero";
import { services as servicesSeed, whyChooseUs as whySeed } from "../mock/services";
import { portfolio as portfolioSeed } from "../mock/portfolio";
import { gallery as gallerySeed, instagramFeed as instagramSeed } from "../mock/gallery";
import { testimonials as testimonialsSeed } from "../mock/testimonials";
import { blogs as blogsSeed } from "../mock/blogs";
import { faq as faqSeed } from "../mock/faq";
import { team as teamSeed } from "../mock/team";
import {
  stats as statsSeed,
  processSteps as processSeed,
  packages as packagesSeed,
} from "../mock/stats";
import { contact as contactSeed, about as aboutSeed } from "../mock/contact";
import { settings as settingsSeed } from "../mock/settings";

const STORAGE_KEY = "confianza:site:v1";
const MESSAGES_KEY = "confianza:messages:v1";
const THEME_KEY = "confianza:theme:v1";

/** The full editable dataset, seeded from the mock files. */
const seed = () => ({
  hero: heroSeed,
  about: aboutSeed,
  services: servicesSeed,
  why: whySeed,
  portfolio: portfolioSeed,
  gallery: gallerySeed,
  instagram: instagramSeed,
  testimonials: testimonialsSeed,
  blogs: blogsSeed,
  faq: faqSeed,
  team: teamSeed,
  stats: statsSeed,
  process: processSeed,
  packages: packagesSeed,
  contact: contactSeed,
  settings: settingsSeed,
});

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [data, setData] = useState(seed);
  const [messages, setMessages] = useState([]);
  const [theme, setTheme] = useState("light");
  const [ready, setReady] = useState(false);

  // Load persisted admin edits after hydration (keeps SSR markup stable).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.contact && (parsed.contact.email === "tridevx9@gmail.com" || !parsed.contact.email)) {
          parsed.contact.email = "Confianza@supportgmail.com";
        }
        setData({ ...seed(), ...parsed });
      }
      const msgs = window.localStorage.getItem(MESSAGES_KEY);
      if (msgs) setMessages(JSON.parse(msgs));
      const t = window.localStorage.getItem(THEME_KEY);
      if (t) setTheme(t);
    } catch {
      /* ignore corrupted storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, ready]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }, [messages, ready]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(THEME_KEY, theme);
    document.documentElement.classList.toggle("dark", theme === "luxury");
  }, [theme, ready]);

  /** Replace one top-level slice of the dataset. */
  const update = useCallback((key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: typeof value === "function" ? value(prev[key]) : value,
    }));
  }, []);

  const resetAll = useCallback(() => setData(seed()), []);

  const addMessage = useCallback((msg) => {
    setMessages((prev) => [{ ...msg, id: Date.now(), read: false }, ...prev]);
  }, []);

  const removeMessage = useCallback(
    (id) => setMessages((prev) => prev.filter((m) => m.id !== id)),
    [],
  );

  const value = useMemo(
    () => ({
      ...data,
      data,
      ready,
      update,
      resetAll,
      messages,
      addMessage,
      removeMessage,
      theme,
      setTheme,
    }),
    [data, ready, update, resetAll, messages, addMessage, removeMessage, theme],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}
