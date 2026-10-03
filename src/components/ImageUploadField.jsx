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

    // Enforce 2 Megabytes limit
    const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setError(`Selected photograph is ${sizeMb} MB. Maximum allowed file size is 2 MB. Please choose an image under 2 MB.`);
      return;
    }

    setUploading(true);
    setProgressPercent(5);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      // Smooth simulated progress ticker up to ~85%
      const progressTimer = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev < 40) return prev + 6;
          if (prev < 75) return prev + 4;
          if (prev < 88) return prev + 1;
          return prev;
        });
      }, 150);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressTimer);

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setProgressPercent(92);

        // Preload in-browser memory so image renders immediately
        await new Promise((resolve) => {
          const img = new Image();
          img.src = data.url;
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          setTimeout(() => resolve(true), 2500);
        });

        setProgressPercent(100);
        onChange(data.url);
        setError("");

        // Reset after clear 100% celebration
        setTimeout(() => {
          setUploading(false);
          setProgressPercent(0);
        }, 900);
      } else {
        setUploading(false);
        setProgressPercent(0);
        setError(data.error || "Image upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploading(false);
      setProgressPercent(0);
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

  // Luxury non-technical status labels
  const getStatusText = (pct) => {
    if (pct >= 100) return "Photograph Ready & Active!";
    if (pct >= 85) return "Finalizing & Optimizing...";
    if (pct >= 35) return "Uploading Photograph...";
    return "Preparing Photograph...";
  };

  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-[#2B2138] flex items-center gap-1.5">
          <span>{label}</span>
          <span className="text-[0.62rem] text-[#7E7688] font-normal px-2 py-0.5 rounded-full bg-[#F4F1F7] border border-[#E8E2EE]">
            Max 2 MB
          </span>
        </label>
        {value && !uploading && (
          <span className="text-[0.68rem] text-emerald-700 flex items-center gap-1 font-semibold animate-fade-in bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Photo Active &amp; Ready
          </span>
        )}
      </div>

      {description && <p className="text-[0.68rem] text-[#7E7688]">{description}</p>}

      {/* Upload Zone & Input */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-2xl border transition-all ${
          dragActive
            ? "border-[#C2A438] bg-[#FDFCF7] shadow-md ring-2 ring-[#C2A438]/30"
            : "border-[#E8E2EE] bg-[#FCFBFE] hover:border-[#6A439E]/40"
        } ${uploading ? "min-h-[110px]" : ""} p-3.5 space-y-3 overflow-hidden`}
      >
        {/* Full Container Light Luxury Loading HUD with 0 to 100 Progress */}
        {uploading && (
          <div className="absolute inset-0 z-20 bg-[#FCFBFE]/98 backdrop-blur-md flex flex-col items-center justify-center p-3 text-center text-[#2B2138] animate-fade-in gap-2.5 border border-[#E8E2EE]">
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#C2A438] via-[#E4CA72] to-[#6A439E]" />
            
            <div className="flex items-center justify-center gap-3 w-full max-w-sm px-2">
              {progressPercent >= 100 ? (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#C2A438] to-[#E4CA72] flex items-center justify-center shadow-md animate-scale-up shrink-0 text-[#2B2138]">
                  <CheckCircle2 className="h-5 w-5 text-[#2B2138]" />
                </div>
              ) : (
                <div className="upload-icon-badge">
                  <CloudUpload className="h-5 w-5 text-[#C2A438]" />
                </div>
              )}

              <div className="text-left flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#2B2138] truncate">
                    {getStatusText(progressPercent)}
                  </span>
                  <span className="upload-percentage-luxury shrink-0">
                    {progressPercent}%
                  </span>
                </div>
                <p className="text-[0.68rem] text-[#7E7688] font-normal truncate">
                  {progressPercent >= 100
                    ? "Verified & ready to display live"
                    : "Optimizing & uploading image..."}
                </p>
              </div>
            </div>

            {/* Light Luxury Shimmering Progress Bar */}
            <div className="w-full max-w-sm progress-track-luxury">
              <div
                className="progress-fill-luxury"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          {/* Direct URL / Path input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7E7688]">
              <LinkIcon className="h-3.5 w-3.5" />
            </div>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste Image URL or click Upload button..."
              className="w-full rounded-xl border border-[#E8E2EE] bg-white pl-9 pr-3 py-2 text-xs text-[#2B2138] placeholder:text-[#7E7688]/60 focus:border-[#6A439E] focus:outline-none focus:ring-2 focus:ring-[#6A439E]/15 transition"
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
            className="btn-modal-primary px-4 py-2 text-xs font-semibold shrink-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            {uploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#C2A438]" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5 text-[#E4CA72]" />
                <span>Upload Photo</span>
              </>
            )}
          </button>
        </div>

        {/* Drag and Drop Prompt or Image Preview */}
        {value ? (
          <div className="flex items-center justify-between rounded-xl bg-white border border-[#E8E2EE] p-2.5 shadow-sm">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-[#FAF8FC] border border-[#C2A438]/40 shadow-inner">
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
                <span className="text-[0.7rem] font-semibold text-[#2B2138] flex items-center gap-1.5 truncate">
                  <span>Active Image</span>
                  <span className="text-[0.62rem] px-2 py-0.2 rounded-full bg-[#C2A438]/15 text-[#8C7118] font-bold border border-[#C2A438]/25">
                    Live Ready
                  </span>
                </span>
                <span className="text-[0.62rem] text-[#7E7688] font-mono block truncate max-w-xs sm:max-w-sm mt-0.5">
                  {value}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg border border-[#E8E2EE] text-[0.68rem] text-[#6A439E] font-semibold hover:bg-[#6A439E]/10 transition cursor-pointer"
              >
                Change
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                title="Remove photo"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer py-3.5 px-4 border border-dashed border-[#D6CDE2] rounded-xl text-center bg-[#FAF8FC]/60 hover:bg-[#F5F1FA] transition group"
          >
            <p className="text-[0.72rem] text-[#7E7688] group-hover:text-[#2B2138] transition">
              <span className="font-semibold text-[#6A439E]">Click to browse</span> or drag and drop JPG / PNG / WebP (up to 2 MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[0.7rem] animate-fade-in font-medium">
          {error}
        </div>
      )}
    </div>
  );
}
