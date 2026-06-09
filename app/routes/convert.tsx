import { useRef, useState, useCallback, useEffect } from "react";

type Format = "png" | "jpg" | "webp";
type Status = "idle" | "loading" | "success" | "error";

const FORMAT_OPTIONS: { value: Format; label: string; desc: string }[] = [
  { value: "png", label: "PNG", desc: "Lossless · transparency" },
  { value: "jpg", label: "JPG", desc: "Lossy · small size" },
  { value: "webp", label: "WEBP", desc: "Modern · best ratio" },
];

export default function Convert() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<Format>("png");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      setErrorMsg("File harus berupa gambar.");
      setStatus("error");
      return;
    }
    setFile(f);
    setStatus("idle");
    setErrorMsg("");
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleConvert = async () => {
    if (!file) return;

    setStatus("loading");
    setErrorMsg("");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", format);

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/convert/image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Konversi gagal. Coba lagi.");
      }

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition");
      let filename = `converted.${format}`;

      if (disposition) {
        const match = disposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan.");
      setStatus("error");
    }
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-3xl font-light tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">Convert your image</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-500">Upload gambar, pilih format, dan download hasilnya.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — Upload + Format */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Dropzone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !file && inputRef.current?.click()}
            className={[
              "relative rounded-xl border transition-all duration-200 select-none",
              file
                ? "border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 cursor-default"
                : isDragging
                  ? "border-neutral-400 bg-neutral-100 dark:border-neutral-400 dark:bg-neutral-800/60 cursor-pointer"
                  : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700 dark:hover:bg-neutral-900 cursor-pointer",
            ].join(" ")}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />

            {file ? (
              <div className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-neutral-500 dark:text-neutral-300">
                    <rect x="2" y="1" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M7 1v4h5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                    <path d="M5 9h6M5 11.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">{file.name}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    reset();
                  }}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-500 dark:hover:text-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center gap-3 text-center">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-neutral-400">
                    <path d="M9 12V4M9 4L6 7M9 4l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 13v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    <span className="text-neutral-900 dark:text-neutral-100 font-medium">Pilih file</span> atau drag & drop
                  </p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1">PNG, JPG, WEBP, GIF, dan lainnya</p>
                </div>
              </div>
            )}
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/50 p-3">
              <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3">Preview</p>
              <div
                className="rounded-lg overflow-hidden border border-neutral-100 dark:border-neutral-700/50 flex items-center justify-center"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Crect width='8' height='8' fill='%23f5f5f5'/%3E%3Crect x='8' y='8' width='8' height='8' fill='%23f5f5f5'/%3E%3Crect x='8' y='0' width='8' height='8' fill='%23e5e5e5'/%3E%3Crect x='0' y='8' width='8' height='8' fill='%23e5e5e5'/%3E%3C/svg%3E\")",
                }}
              >
                <img src={previewUrl} alt="Preview" className="max-h-64 w-full object-contain" />
              </div>
            </div>
          )}

          {/* Format selector */}
          <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/50 p-4">
            <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3">Format output</p>
            <div className="grid grid-cols-3 gap-2">
              {FORMAT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFormat(opt.value)}
                  className={[
                    "rounded-lg border px-3 py-2.5 text-left transition-all duration-150 cursor-pointer",
                    format === opt.value
                      ? "border-neutral-900 bg-neutral-900 dark:border-neutral-300 dark:bg-neutral-100"
                      : "border-neutral-200 bg-neutral-50 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600",
                  ].join(" ")}
                >
                  <p className={["text-sm font-medium", format === opt.value ? "text-neutral-100 dark:text-neutral-950" : "text-neutral-700 dark:text-neutral-200"].join(" ")}>{opt.label}</p>
                  <p className={["text-xs mt-0.5", format === opt.value ? "text-neutral-400 dark:text-neutral-500" : "text-neutral-400 dark:text-neutral-600"].join(" ")}>{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Summary + Action */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/50 p-5 flex flex-col gap-5">
            <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Summary</p>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500">File</span>
                <span className="text-xs text-neutral-700 dark:text-neutral-300 truncate max-w-[140px] text-right">{file ? file.name : <span className="text-neutral-300 dark:text-neutral-700">—</span>}</span>
              </div>
              <div className="h-px bg-neutral-100 dark:bg-neutral-800" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500">Ukuran</span>
                <span className="text-xs text-neutral-700 dark:text-neutral-300">{file ? formatFileSize(file.size) : <span className="text-neutral-300 dark:text-neutral-700">—</span>}</span>
              </div>
              <div className="h-px bg-neutral-100 dark:bg-neutral-800" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500">Output</span>
                <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 uppercase">{format}</span>
              </div>
            </div>

            {status === "success" && (
              <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg px-3 py-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 flex-shrink-0" />
                <span className="text-xs text-neutral-600 dark:text-neutral-300">Berhasil dikonversi ke {format.toUpperCase()}</span>
              </div>
            )}

            {status === "error" && errorMsg && (
              <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg px-3 py-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 flex-shrink-0" />
                <span className="text-xs text-neutral-600 dark:text-neutral-300">{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handleConvert}
              disabled={!file || status === "loading"}
              className={[
                "w-full py-3 rounded-lg text-sm font-medium transition-all duration-150",
                !file || status === "loading"
                  ? "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600 cursor-not-allowed"
                  : "bg-neutral-900 text-neutral-100 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-white active:scale-[0.98]",
              ].join(" ")}
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2" />
                    <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Converting…
                </span>
              ) : (
                "Convert & Download"
              )}
            </button>
          </div>

          {/* Tips */}
          <div className="rounded-xl border border-neutral-100 dark:border-neutral-800/50 p-4">
            <p className="text-xs text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mb-2.5">Tips</p>
            <ul className="flex flex-col gap-1.5">
              {["PNG untuk gambar dengan transparansi", "JPG untuk foto, ukuran lebih kecil", "WEBP untuk web, kualitas terbaik"].map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <span className="text-neutral-300 dark:text-neutral-700 mt-0.5 text-xs">·</span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-600">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
