"use client";

/** Placeholder card shown while a section's data settles. */
export default function SkeletonCard({ className = "" }) {
  return (
    <div className={`glass-card rounded-3xl p-4 ${className}`}>
      <div className="skeleton h-48 w-full rounded-2xl" />
      <div className="skeleton mt-4 h-4 w-2/3 rounded-full" />
      <div className="skeleton mt-2 h-3 w-full rounded-full" />
      <div className="skeleton mt-2 h-3 w-4/5 rounded-full" />
    </div>
  );
}

