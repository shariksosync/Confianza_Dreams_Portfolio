"use client";

import { useState, useRef } from "react";
import {
  Upload,
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
  X,
  Link as LinkIcon,
  Sparkles,
  CloudUpload,
} from "lucide-react";

export default function ImageUploadField({
  label = "Image",
  value = "",
  onChange,
  folder = "confianza_events",
  description = "",
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadPhase, setUploadPhase] = useState("idle"); // "idle" | "uploading" | "preloading" | "ready"
  const [progressPercent, setProgressPercent] = useState(0);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WebP, AVIF, etc.)");
      return;
    }

    setUploading(true);
    setUploadPhase("uploading");
    setProgressPercent(20);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      // Progress animation step
      const progressTimer = setInterval(() => {
        setProgressPercent((prev) => (prev < 65 ? prev + 15 : prev));
      }, 300);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressTimer);
      setProgressPercent(75);

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        // Phase 2: Preload in-browser memory so image is ready with 0ms latency
        setUploadPhase("preloading");
        setProgressPercent(90);

        await new Promise((resolve) => {
          const img = new Image();
          img.src = data.url;
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          setTimeout(() => resolve(true), 3000); // 3s safety timeout
        });

        setProgressPercent(100);
        setUploadPhase("ready");
        onChange(data.url);
        setError("");

        // Reset phase after short success confirmation
        setTimeout(() => {
          setUploadPhase("idle");
          setUploading(false);
          setProgressPercent(0);
        }, 1200);
      } else {
        setUploading(false);
        setUploadPhase("idle");
        setError(data.error || "Image upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploading(false);
      setUploadPhase("idle");
      setError(err?.message || "Network error while uploading image.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-foreground flex items-center gap-1.5">
          <span>{label}</span>
        </label>
        {value && !uploading && (
          <span className="text-[0.68rem] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium animate-fade-in">
            <CheckCircle2 className="h-3.5 w-3.5 text-secondary" /> Photo Active &amp; Ready
          </span>
        )}
      </div>

      {description && <p className="text-[0.68rem] text-muted-foreground">{description}</p>}

      {/* Upload Zone & Input */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-2xl border transition-all ${
          dragActive
            ? "border-secondary bg-secondary/10 shadow-md"
            : "border-border/80 bg-card/50 hover:border-primary/40"
        } p-3.5 space-y-3 overflow-hidden`}
      >
        {/* Full Container Luxury Loading HUD during active upload */}
        {uploading && (
          <div className="absolute inset-0 z-20 bg-ink/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center text-background animate-fade-in space-y-3">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-2 border-secondary/30 border-t-secondary animate-spin flex items-center justify-center shadow-luxe" />
              <CloudUpload className="h-5 w-5 text-secondary absolute inset-0 m-auto" />
            </div>

            <div className="space-y-1 max-w-xs">
              <span className="text-[0.68rem] uppercase tracking-[0.25em] text-secondary font-bold block">
                {uploadPhase === "uploading"
                  ? "1/3 Uploading to CDN"
                  : uploadPhase === "preloading"
                  ? "2/3 Optimizing & Preloading"
                  : "3/3 Ready & Active!"}
              </span>
              <p className="text-xs text-background/90 font-medium">
                {uploadPhase === "uploading"
                  ? "Streaming high-resolution photo to Cloudinary CDN..."
                  : uploadPhase === "preloading"
                  ? "Preloading image assets for instant 1-click live view..."
                  : "Image verified! Syncing preview..."}
              </p>
            </div>

            {/* Shimmering Progress Bar */}
            <div className="w-48 h-1.5 rounded-full bg-white/15 overflow-hidden ring-1 ring-white/20">
              <div
                className="h-full gradient-gold transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          {/* Direct URL / Path input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <LinkIcon className="h-3.5 w-3.5" />
            </div>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste Image URL or click Upload button..."
              className="w-full rounded-xl border border-border bg-card pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary/40 transition"
            />
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            disabled={uploading}
            onClick={(e) => {
              e.target.value = null;
            }}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Upload Button */}
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="btn-luxe gradient-royal text-primary-foreground px-4 py-2 text-xs font-semibold shrink-0 flex items-center justify-center gap-2 rounded-xl shadow-sm hover:opacity-95 transition cursor-pointer"
          >
            {uploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-secondary" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5 text-secondary" />
                <span>Upload Photo</span>
              </>
            )}
          </button>
        </div>

        {/* Drag and Drop Prompt or Image Preview */}
        {value ? (
          <div className="flex items-center justify-between rounded-xl bg-card border border-border/70 p-2.5 shadow-sm">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-ink/5 border border-secondary/40 shadow-inner">
                <img
                  src={value}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/logo.png";
                  }}
                />
              </div>
              <div className="truncate">
                <span className="text-[0.7rem] font-semibold text-ink flex items-center gap-1.5 truncate">
                  <span>Active Image</span>
                  <span className="text-[0.62rem] px-2 py-0.2 rounded-full bg-secondary/15 text-secondary font-bold">
                    Live Ready
                  </span>
                </span>
                <span className="text-[0.62rem] text-muted-foreground font-mono block truncate max-w-xs sm:max-w-sm mt-0.5">
                  {value}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg border border-border text-[0.68rem] text-primary hover:bg-primary/10 transition cursor-pointer"
              >
                Change
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-1 rounded-lg text-destructive hover:bg-destructive/10 transition cursor-pointer"
                title="Remove photo"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer py-3.5 px-4 border border-dashed border-border rounded-xl text-center hover:bg-card/80 transition group"
          >
            <p className="text-[0.72rem] text-muted-foreground group-hover:text-foreground transition">
              <span className="font-semibold text-primary">Click to browse</span> or drag and drop a JPG / PNG / WebP from your device
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-[0.7rem] animate-fade-in">
          {error}
        </div>
      )}
    </div>
  );
}
