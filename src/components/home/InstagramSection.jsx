"use client";

import { Instagram, Heart, ExternalLink, Sparkles } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import SectionHeading from "../ui/SectionHeading";

export default function InstagramSection({ showAll = false }) {
  const { instagram, instagramHeader, contact } = useSite();

  const posts = Array.isArray(instagram) ? instagram : [];
  const header = instagramHeader || {};
  const instaUrl =
    header.url || contact?.instagram || "https://www.instagram.com/confianza_events";
  const handle = header.handle || "@confianza_events";
  const followerCount = header.followerCount || "10K+ Followers";

  let displayedPosts;
  if (showAll) {
    // Gallery Page: showcase all available posts & reels
    displayedPosts = posts;
  } else {
    // Homepage: show only items marked with "showOnHome" (capped at 6), fallback to first 6 if none selected
    const homePosts = posts.filter((post) => Boolean(post.showOnHome));
    displayedPosts = (homePosts.length > 0 ? homePosts : posts).slice(0, 6);
  }

  return (
    <section className="py-10 sm:py-16 lg:py-24 relative bg-accent/20 overflow-hidden border-t border-border/40">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={header.eyebrow || "Follow Our Journey"}
          title={header.title || `${handle} on Instagram`}
          subtitle={
            header.subtitle ||
            "Behind-the-scenes reels, live setups in Udaipur, Pune, and Goa, and daily wedding decor inspiration."
          }
        />

        {/* Empty state when 0 posts exist in database */}
        {posts.length === 0 ? (
          <div className="mt-8 sm:mt-12 glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center text-muted-foreground border border-border/80 max-w-md mx-auto shadow-soft transition-all duration-300">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-secondary/15 ring-2 ring-secondary/40 flex items-center justify-center mx-auto mb-3 text-secondary">
              <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h4 className="font-display text-sm sm:text-base text-ink font-semibold">
              No Instagram Posts Configured
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Instagram posts and reels added in the Admin Panel will be showcased here.
            </p>
          </div>
        ) : (
          <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-6 transition-all duration-300">
            {displayedPosts.map((post) => {
              const targetUrl = post.url || instaUrl;
              return (
                <a
                  key={post.id}
                  href={targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl border border-border/80 bg-card shadow-soft block transition-all duration-500 hover:-translate-y-1 hover:shadow-luxe"
                >
                  <img
                    src={post.image}
                    alt={post.caption || "Confianza Instagram Post"}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-ink/80 opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 sm:gap-2 text-background p-2.5 sm:p-3 text-center">
                    <Instagram className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                    {typeof post.likes === "number" && post.likes > 0 && (
                      <div className="flex items-center gap-1 text-[0.68rem] sm:text-xs text-champagne font-medium">
                        <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-rose-gold text-rose-gold" />
                        <span>{post.likes.toLocaleString()}</span>
                      </div>
                    )}
                    {post.caption && (
                      <p className="text-[0.58rem] sm:text-[0.62rem] text-background/90 line-clamp-2 px-1 leading-snug">
                        {post.caption}
                      </p>
                    )}
                    <span className="text-[0.58rem] sm:text-[0.62rem] uppercase tracking-wider text-secondary font-semibold mt-0.5 flex items-center gap-1">
                      <span>View Post</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* Explore All on Instagram CTA Bar */}
        <div className="reveal mt-8 sm:mt-10 text-center flex items-center justify-center">
          <a
            href={instaUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-luxe gradient-royal text-primary-foreground text-[0.68rem] sm:text-xs shadow-luxe py-2.5 sm:py-3.5 px-6 sm:px-8 inline-flex items-center justify-center gap-2 sm:gap-2.5 hover:scale-105 transition font-semibold tracking-wide sm:tracking-wider uppercase w-auto max-w-[92vw] sm:max-w-none text-center whitespace-nowrap"
          >
            <Instagram className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-secondary shrink-0" />
            <span className="inline sm:hidden">Explore on Instagram</span>
            <span className="hidden sm:inline">Explore All on Instagram ({handle})</span>
            {followerCount && (
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] sm:text-xs font-mono font-bold shrink-0">
                {followerCount}
              </span>
            )}
            <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-secondary" />
          </a>
        </div>
      </div>
    </section>
  );
}
