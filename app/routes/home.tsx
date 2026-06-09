import type { Route } from "./+types/home";
import { NavLink } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Imgconv — Image Tools" }, { name: "description", content: "Convert, compress, and edit images instantly." }];
}

const TOOLS = [
  {
    path: "/convert",
    label: "Convert",
    desc: "Ubah format gambar ke PNG, JPG, atau WEBP.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 11h14M14 7l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    path: "/compress",
    label: "Compress",
    desc: "Perkecil ukuran file tanpa mengorbankan kualitas.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 4v14M7 14l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 8h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    path: "/edit",
    label: "Edit",
    desc: "Crop, resize, rotate, dan sesuaikan gambar kamu.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M14.5 4.5l3 3L7 18H4v-3L14.5 4.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="min-h-200 bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center px-6">
      {/* Hero */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 mb-3">Imgconv</h1>
        <p className="text-sm text-neutral-500 max-w-xs mx-auto">Semua yang kamu butuhkan untuk mengolah gambar, dalam satu tempat.</p>
      </div>

      {/* Tool cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        {TOOLS.map((tool) => (
          <NavLink
            key={tool.path}
            to="/convert"
            className="group rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-600 dark:hover:bg-neutral-900 p-6 flex flex-col gap-4 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 flex items-center justify-center text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
              {tool.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">{tool.label}</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-600 leading-relaxed">{tool.desc}</p>
            </div>
            <div className="mt-auto flex items-center gap-1 text-xs text-neutral-400 group-hover:text-neutral-600 dark:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">
              <span>Mulai</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
