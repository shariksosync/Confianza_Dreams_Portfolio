"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, ArrowRight, BookOpen, X, Sparkles } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";

export default function BlogSection({ isStandalone = false }) {
  const { blogs } = useSite();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const articles = blogs || [];

  const categories = ["All", "Planning Guides", "Decor Ideas", "Destination Ideas", "Wedding Tips"];

  const filteredArticles = isStandalone
    ? articles.filter((a) => activeCategory === "All" || a.category === activeCategory)
    : articles.slice(0, 4);

  return (
    <section id="blog" className="section-pad relative bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="The Journal &amp; Guides"
          title="Inspiration, Decor Trends &amp; Planning Wisdom"
          subtitle="Expert advice from our seasoned directors on timelines, royal decor color schemes, destination venues, and etiquette."
        />

        {/* Category Pills if on standalone page */}
        {isStandalone && (
          <div className="reveal mt-10 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
                  activeCategory === cat
                    ? "gradient-royal text-primary-foreground shadow-luxe"
                    : "glass-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Blog Grid */}
        {filteredArticles.length === 0 ? (
          <div className="mt-14 glass-card rounded-3xl p-10 text-center text-muted-foreground border border-border transition-all duration-300">
            <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="font-display text-lg text-ink font-semibold">No Articles Published</h3>
            <p className="text-xs text-muted-foreground mt-1">Wedding guides and journal entries will appear here once created in the admin panel.</p>
          </div>
        ) : (
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-300">
            {filteredArticles.map((article, idx) => (
              <article
                key={article.id || idx}
                className="group glass-card rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe border border-border/80"
              >
                <div>
                  <div className="relative h-48 sm:h-52 overflow-hidden">
                    <img
                      src={article.image || "/images/hero-1.jpg"}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-ink/75 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-wider text-secondary backdrop-blur-md">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-[0.7rem] text-muted-foreground mb-2">
                      <Calendar className="h-3.5 w-3.5 text-secondary" />
                      <span>{article.date}</span>
                    </div>

                    <h3 className="font-display text-lg leading-snug text-ink group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>

                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => setSelectedArticle(article)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary hover:text-secondary transition-colors"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Standalone vs Homepage CTAs */}
        {!isStandalone && filteredArticles.length > 0 && (
          <div className="reveal mt-12 text-center">
            <Link
              href="/blog"
              className="btn-luxe gradient-royal text-primary-foreground text-xs shadow-luxe"
            >
              <span>Explore All Planning Articles</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-100 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="glass-card max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl p-6 sm:p-10 border border-border shadow-luxe animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5 text-secondary" />
                {selectedArticle.category}
              </span>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                aria-label="Close article"
                className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Calendar className="h-4 w-4 text-secondary" />
                <span>Published on {selectedArticle.date}</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-ink leading-tight">
                {selectedArticle.title}
              </h2>
            </div>

            <div className="my-6 overflow-hidden rounded-2xl h-64 sm:h-80 w-full">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-foreground/90 font-light">
              <p className="font-medium text-base sm:text-lg text-ink">
                {selectedArticle.excerpt}
              </p>
              <div className="rule-gold my-4" />
              <p>{selectedArticle.content}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground">
                Confianza Event's and Entertainment Editorial
              </span>
              <Link
                href="/contact"
                onClick={() => setSelectedArticle(null)}
                className="btn-luxe gradient-royal text-primary-foreground text-xs"
              >
                Book a Planning Session
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

