"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { RagBadge } from "@/components/ui/badge";
import { RadioGroup, RagRadioItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePortalStore, findSectionById } from "@/lib/store";
import { RAG_COLORS } from "@/lib/rag";
import type { RagStatus } from "@/lib/types";
import { Camera } from "lucide-react";
import { toast } from "sonner";

const AREA_OPTIONS = [
  "Main covering",
  "Flashings",
  "Gutters",
  "Drainage outlets",
  "Skylights / rooflights",
  "Parapet wall",
];

interface AuditModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  sectionId: string | null;
}

export function AuditModal({ open, onOpenChange, sectionId }: AuditModalProps) {
  const { buildings, submitAudit } = usePortalStore();
  const section = findSectionById(buildings, sectionId);

  const [area, setArea] = useState<string>(AREA_OPTIONS[0]);
  const [rag, setRag] = useState<RagStatus>("amber");
  const [life, setLife] = useState<number>(10);
  const [notes, setNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && section) {
      setArea(AREA_OPTIONS[0]);
      setRag(section.rag);
      setLife(section.lifeRemainingYears);
      setNotes("");
    }
  }, [open, section]);

  if (!section) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 300));
    const entry = submitAudit({
      sectionId: section.id,
      ragAfter: rag,
      lifeRemainingYears: life,
      notes: notes.trim() || "Routine inspection — no further notes.",
      area,
      auditor: "Alex Bradford",
    });
    setSubmitting(false);
    onOpenChange(false);

    const ragChanged = entry.ragBefore !== entry.ragAfter;
    toast.success(`Audit logged for ${section.id}`, {
      description: ragChanged
        ? `Status updated ${RAG_COLORS[entry.ragBefore].label} → ${RAG_COLORS[entry.ragAfter].label}.`
        : `${RAG_COLORS[entry.ragAfter].label} status confirmed.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log roof audit — {section.id}</DialogTitle>
          <DialogDescription>
            Capture site findings. Submitting updates RAG status and forecast inputs in real time.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4">
          {/* Section context */}
          <div className="flex items-center justify-between rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-background)] px-3 py-2">
            <div className="flex flex-col">
              <span className="text-[12px] text-[color:var(--color-muted)]">Section</span>
              <span className="text-[13px] font-medium">{section.id}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[11px] text-[color:var(--color-muted)] mb-0.5">Current</span>
              <RagBadge rag={section.rag} size="sm" />
            </div>
          </div>

          {/* Area inspected */}
          <Field label="Equipment / area inspected">
            <Select value={area} onValueChange={setArea}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AREA_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* RAG */}
          <Field label="Updated RAG status">
            <RadioGroup value={rag} onValueChange={(v) => setRag(v as RagStatus)} className="grid-cols-3">
              <RagRadioItem
                value="red"
                swatch={RAG_COLORS.red.fill}
                swatchStroke={RAG_COLORS.red.stroke}
                label="Red"
              />
              <RagRadioItem
                value="amber"
                swatch={RAG_COLORS.amber.fill}
                swatchStroke={RAG_COLORS.amber.stroke}
                label="Amber"
              />
              <RagRadioItem
                value="green"
                swatch={RAG_COLORS.green.fill}
                swatchStroke={RAG_COLORS.green.stroke}
                label="Green"
              />
            </RadioGroup>
          </Field>

          {/* Life remaining */}
          <Field
            label="Life remaining"
            trailing={
              <span className="text-[12px] tabular-nums text-[color:var(--color-foreground)]">
                {life} {life === 1 ? "year" : "years"}
              </span>
            }
          >
            <Slider
              value={[life]}
              onValueChange={(v) => setLife(v[0])}
              min={1}
              max={30}
              step={1}
            />
            <div className="flex justify-between text-[10px] text-[color:var(--color-faint)] mt-1">
              <span>1 yr</span>
              <span>15 yrs</span>
              <span>30 yrs</span>
            </div>
          </Field>

          {/* Notes */}
          <Field label="Notes">
            <Textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observed condition, defects, recommended actions…"
            />
          </Field>

          {/* Photos */}
          <div className="flex items-center gap-2.5 rounded-md border border-dashed border-[color:var(--color-border-strong)] bg-[color:var(--color-background)]/50 px-3 py-2.5 opacity-70">
            <Camera className="h-4 w-4 text-[color:var(--color-muted)]" />
            <div className="flex-1">
              <div className="text-[12px] text-[color:var(--color-foreground)]">Photo upload</div>
              <div className="text-[11px] text-[color:var(--color-muted)]">Demo build — drag &amp; drop not active</div>
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting…" : "Submit audit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  trailing,
  children,
}: {
  label: string;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-medium text-[color:var(--color-muted)] uppercase tracking-wide">
          {label}
        </label>
        {trailing}
      </div>
      {children}
    </div>
  );
}
