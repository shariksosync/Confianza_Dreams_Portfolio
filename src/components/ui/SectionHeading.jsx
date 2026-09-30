"use client";

/** Shared eyebrow + title + subtitle block used by every section. */
export default function SectionHeading({ eyebrow, title, subtitle, align = "center", light = false }) {
  const alignment = align === "left" ? "items-start text-left" : "items-center text-center";
  return (
    <div className={`reveal flex flex-col gap-4 ${alignment}`}>
      {eyebrow && (
        <span
          className={`text-[0.7rem] font-medium uppercase tracking-[0.34em] ${
            light ? "text-secondary" : "text-primary"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`max-w-3xl text-3xl leading-tight sm:text-4xl lg:text-5xl ${
          light ? "text-background" : "text-ink"
        }`}
      >
        {title}
      </h2>
      <span className="rule-gold" />
      {subtitle && (
        <p
          className={`max-w-2xl text-sm leading-relaxed sm:text-base ${
            light ? "text-background/75" : "text-muted-foreground"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

