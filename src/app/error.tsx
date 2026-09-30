"use client";

import { useEffect } from "react";
import Link from "next/link";
import { reportLovableError } from "@/lib/lovable-error-reporting";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    reportLovableError(error, { boundary: "next_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="glass-card max-w-md rounded-3xl p-8 text-center shadow-luxe">
        <span className="gradient-royal mx-auto grid h-12 w-12 place-items-center rounded-full font-display text-lg text-primary-foreground">
          !
        </span>
        <h1 className="mt-4 font-display text-2xl text-foreground">
          This celebration paused
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something unexpected occurred. Please refresh or return to the main gallery.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => reset()}
            className="btn-luxe gradient-royal text-primary-foreground text-xs"
          >
            Try again
          </button>
          <Link
            href="/"
            className="btn-luxe border border-border bg-card text-foreground text-xs"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
