import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="glass-card max-w-lg rounded-3xl p-8 sm:p-12 text-center shadow-luxe">
        <span className="gradient-royal mx-auto grid h-16 w-16 place-items-center rounded-full font-display text-2xl text-primary-foreground shadow-luxe">
          C
        </span>
        <span className="mt-4 block text-[0.7rem] uppercase tracking-[0.3em] text-secondary">
          Confianza Event's &amp; Entertainment
        </span>
        <h1 className="mt-2 font-display text-6xl text-ink">404</h1>
        <h2 className="mt-2 font-display text-2xl text-foreground">A Moment Strayed</h2>
        <span className="rule-gold mx-auto my-4" />
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The page you are looking for does not exist or has been moved to another celebration.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="btn-luxe gradient-royal text-primary-foreground"
          >
            Return to Homepage
          </Link>
          <Link
            href="/contact"
            className="btn-luxe gradient-gold text-ink"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
