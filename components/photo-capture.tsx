"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, ImagePlus, Info } from "lucide-react";
import { toast } from "sonner";

/**
 * Roof photo capture / upload — DEMO PLACEHOLDER.
 *
 * This is a preview build, so nothing is actually captured, uploaded or
 * stored. The controls below show the client exactly where field photos for
 * each roof section will live; tapping any of them surfaces a short note that
 * the real capture/upload pipeline is wired up in production.
 *
 * `variant`:
 *   - "audit"  → "Add site photos" framing (attach new field photos)
 *   - "edit"   → "Roof photo" framing (replace the section's reference image)
 */
export function PhotoCapture({
  sectionId,
  variant = "audit",
}: {
  sectionId: string;
  variant?: "audit" | "edit";
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const isEdit = variant === "edit";

  const notifyDemo = (action: string) =>
    toast.message(`${action} — demo only`, {
      description: `Photo capture & upload for ${sectionId} is enabled in the production build.`,
      icon: <Info className="h-4 w-4" />,
    });

  return (
    <div className="space-y-2.5">
      {/* The file inputs are intentionally inert in the demo: selecting a file
          just surfaces the demo note rather than processing/storing it. */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          e.preventDefault();
          if (fileRef.current) fileRef.current.value = "";
          notifyDemo("Upload");
        }}
      />
      {/* capture="environment" opens the rear camera directly on mobile
          devices; on desktop browsers it falls back to a file picker. */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          e.preventDefault();
          if (cameraRef.current) cameraRef.current.value = "";
          notifyDemo("Take photo");
        }}
      />

      {/* Drop-zone style placeholder */}
      <div
        className="group relative flex flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-[color:var(--color-line-strong)] bg-[color:var(--color-cream)] px-4 py-6 text-center transition-colors hover:border-[color:var(--color-sycamore)]/45 hover:bg-[color:var(--color-sycamore-tint)]/50"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          notifyDemo("Upload");
        }}
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[var(--shadow-brand)]"
          style={{ backgroundImage: "var(--gradient-brand-vivid)" }}
        >
          {isEdit ? <ImagePlus className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
        </div>

        <div>
          <div className="font-display text-[13px] font-bold text-[color:var(--color-ink-strong)]">
            {isEdit ? "Update roof photo" : "Add site photos"}
          </div>
          <p className="mt-0.5 text-[11.5px] text-[color:var(--color-ink-muted)] leading-snug max-w-[280px]">
            {isEdit
              ? "Replace the reference image for this section — take a new photo on site or upload one from your device."
              : "Capture the roof on site or upload images from your device. Drag & drop works too."}
          </p>
        </div>

        <div className="flex w-full items-center justify-center gap-2">
          {/* Opens the device camera on mobile via the capture input. */}
          <Button size="sm" className="flex-1 sm:flex-none" onClick={() => cameraRef.current?.click()}>
            <Camera className="h-3 w-3" /> {isEdit ? "Take new" : "Take photo"}
          </Button>
          <Button size="sm" variant="outline" className="flex-1 sm:flex-none" onClick={() => fileRef.current?.click()}>
            <Upload className="h-3 w-3" /> Upload
          </Button>
        </div>
      </div>

      {/* Unmistakable demo marker */}
      <div className="flex items-center gap-1.5 text-[10.5px] text-[color:var(--color-ink-faint)]">
        <Info className="h-3 w-3 shrink-0" />
        <span>
          Demo placeholder — live photo capture &amp; upload is enabled in the production build.
        </span>
      </div>
    </div>
  );
}
