"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangleIcon, HomeIcon, RotateCcwIcon } from "lucide-react";

/**
 * Global error boundary (`src/app/global-error.tsx`).
 *
 * Last-resort UI for errors thrown in the ROOT layout itself. It replaces
 * the root layout when active, so it must render its own <html> and <body>
 * and cannot rely on the app's shared components, fonts, or providers.
 *
 * Self-contained on purpose — inline Tailwind classes + inline styles for
 * the font so it renders correctly even when globals.css never loads.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily:
            "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "1rem",
            textAlign: "center",
            color: "hsl(0 0% 10%)",
            background: "hsl(0 0% 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "4rem",
              height: "4rem",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "1rem",
              background: "hsl(0 84% 95%)",
              color: "hsl(0 72% 45%)",
            }}
          >
            <AlertTriangleIcon size={32} />
          </div>

          <div style={{ display: "grid", gap: "0.5rem", maxWidth: "28rem" }}>
            <h1
              style={{
                fontSize: "1.875rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Application error
            </h1>
            <p
              style={{
                fontSize: "0.875rem",
                lineHeight: 1.6,
                color: "hsl(0 0% 45%)",
                margin: 0,
              }}
            >
              A critical error occurred while loading the application. Please
              try again — if the problem persists, return to the homepage.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                height: "2.5rem",
                padding: "0 1rem",
                borderRadius: "0.75rem",
                border: "none",
                background: "hsl(0 0% 10%)",
                color: "hsl(0 0% 100%)",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <RotateCcwIcon size={16} />
              Try again
            </button>

            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                height: "2.5rem",
                padding: "0 1rem",
                borderRadius: "0.75rem",
                border: "1px solid hsl(0 0% 85%)",
                background: "transparent",
                color: "hsl(0 0% 10%)",
                fontSize: "0.875rem",
                fontWeight: 500,
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <HomeIcon size={16} />
              Back to home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}