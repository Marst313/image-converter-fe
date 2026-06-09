import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, NavLink } from "react-router";
import type { Route } from "./+types/root";

import { useState, useEffect } from "react";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-neutral-950 text-neutral-100 min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// ── Sun icon ────────────────────────────────────────────────
function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.93 2.93l1.06 1.06M10.01 10.01l1.06 1.06M2.93 11.07l1.06-1.06M10.01 3.99l1.06-1.06" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

// ── Moon icon ───────────────────────────────────────────────
function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M12 7.9A5 5 0 016.1 2a5 5 0 100 10 5 5 0 005.9-4.1z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function App() {
  // ── Theme state: persisted in localStorage ─────────────────
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply class to <html> and persist preference
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const toggle = () => setDark((d) => !d);

  // ── Semantic color aliases driven by theme ─────────────────
  const bg = dark ? "bg-neutral-950" : "bg-white";
  const text = dark ? "text-neutral-100" : "text-neutral-900";
  const border = dark ? "border-neutral-800" : "border-neutral-200";
  const subtle = dark ? "text-neutral-400" : "text-neutral-500";
  const navHover = dark ? "hover:bg-neutral-800 hover:text-neutral-100" : "hover:bg-neutral-100 hover:text-neutral-900";
  const btnBg = dark ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-neutral-100" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900";
  const logoBg = dark ? "bg-neutral-100" : "bg-neutral-900";
  const logoFill = dark ? "#171717" : "#f5f5f5";
  const footerText = dark ? "text-neutral-600" : "text-neutral-400";

  return (
    <div className={`min-h-screen flex flex-col ${bg} ${text} transition-colors duration-200`}>
      <header className={`border-b ${border}`}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded ${logoBg} flex items-center justify-center transition-colors duration-200`}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" fill={logoFill} />
                <rect x="8" y="1" width="5" height="5" rx="1" fill={logoFill} />
                <rect x="1" y="8" width="5" height="5" rx="1" fill={logoFill} />
                <rect x="8" y="8" width="5" height="5" rx="1" fill={logoFill} opacity="0.4" />
              </svg>
            </div>
            <span className="text-sm font-medium tracking-tight">Imgconv</span>
          </NavLink>

          {/* Nav + toggle */}
          <div className="flex items-center gap-1">
            <NavLink to="/convert" className={`text-xs ${subtle} transition-colors px-3 py-1.5 rounded-md ${navHover}`}>
              Convert
            </NavLink>
            <NavLink to="/history" className={`text-xs ${subtle} transition-colors px-3 py-1.5 rounded-md ${navHover}`}>
              History
            </NavLink>

            {/* Theme toggle */}
            <button onClick={toggle} aria-label="Toggle theme" className={`ml-2 w-7 h-7 rounded-md flex items-center justify-center transition-colors duration-150 ${btnBg}`}>
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className={`border-t ${border} py-5`}>
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <span className={`text-xs ${footerText}`}>Imgconv</span>
          <span className={`text-xs ${footerText}`}>Image format converter</span>
        </div>
      </footer>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="flex items-center justify-center min-h-screen px-6">
      <div className="text-center">
        <p className="text-7xl font-light text-neutral-700 mb-4">{message}</p>
        <p className="text-sm text-neutral-400 mb-8">{details}</p>
        <a href="/" className="text-xs text-neutral-300 border border-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors">
          Back to home
        </a>
        {stack && (
          <pre className="mt-8 text-left text-xs text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-lg p-4 overflow-x-auto max-w-2xl">
            <code style={{ fontFamily: "'DM Mono', monospace" }}>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}
