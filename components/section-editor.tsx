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
import { usePortalStore, findSectionById, findBuildingByCode } from "@/lib/store";
import { RAG_COLORS, formatGbpFull } from "@/lib/rag";
import type { RagStatus, RoofType } from "@/lib/types";
import { Camera, ClipboardCheck, Pencil, Wrench } from "lucide-react";
import { toast } from "sonner";

const AREA_OPTIONS = [
  "Main covering",
  "Flashings",
  "Gutters",
  "Drainage outlets",
  "Skylights / rooflights",
  "Parapet wall",
];

const ROOF_TYPES: RoofType[] = [
  "Built-up felt",
  "Single-ply membrane",
  "Standing seam metal",
  "Asphalt",
  "Slate",
  "Concrete tile",
  "EPDM rubber",
  "Green roof",
];

interface SectionEditorProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  sectionId: string | null;
  mode: "audit" | "edit";
}

export function SectionEditor({ open, onOpenChange, sectionId, mode }: SectionEditorProps) {
  const { buildings, submitAudit, updateSection } = usePortalStore();
  const section = findSectionById(buildings, sectionId);
  const building = section ? findBuildingByCode(buildings, section.buildingCode) : null;

  // shared
  const [rag, setRag] = useState<RagStatus>("amber");
  const [life, setLife] = useState<number>(10);
  const [notes, setNotes] = useState<string>("");

  // audit-only
  const [area, setArea] = useState<string>(AREA_OPTIONS[0]);

  // edit-only
  const [areaSqm, setAreaSqm] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);
  const [roofType, setRoofType] = useState<RoofType>("Single-ply membrane");
  const [buildingName, setBuildingName] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && section && building) {
      setArea(AREA_OPTIONS[0]);
      setRag(section.rag);
      setLife(section.lifeRemainingYears);
      setNotes("");
      setAreaSqm(section.areaSqm);
      setCost(section.forecastCostGbp);
      setRoofType(section.roofType);
      setBuildingName(building.name);
    }
  }, [open, section, building]);

  if (!section || !building) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 300));

    if (mode === "audit") {
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
      toast.success(`Audit logged · ${section.id}`, {
        description: ragChanged
          ? `Status updated ${RAG_COLORS[entry.ragBefore].label} → ${RAG_COLORS[entry.ragAfter].label}.`
          : `${RAG_COLORS[entry.ragAfter].label} status confirmed.`,
      });
    } else {
      const result = updateSection({
        sectionId: section.id,
        patch: {
          rag,
          lifeRemainingYears: life,
          areaSqm,
          forecastCostGbp: cost,
          roofType,
          buildingName: buildingName.trim() || building.name,
        },
        changeNote: notes.trim() || undefined,
        auditor: "Alex Bradford",
      });
      setSubmitting(false);
      onOpenChange(false);
      if (result) {
        toast.success(`Section data saved · ${section.id}`, {
          description: "Master data updated and change logged to audit history.",
        });
      } else {
        toast.message("No changes to save");
      }
    }
  };

  const isAudit = mode === "audit";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div
              className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: isAudit ? "var(--color-sycamore-soft)" : "var(--color-eggplant-soft)",
                color: isAudit ? "var(--color-sycamore-strong)" : "var(--color-eggplant)",
              }}
            >
              {isAudit ? <ClipboardCheck className="h-4 w-4" /> : <Wrench className="h-4 w-4" />}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-[15px]">
                {isAudit ? "Log roof audit" : "Edit section data"} ·{" "}
                <span className="font-display font-semibold text-[color:var(--color-sycamore)]">{section.id}</span>
              </DialogTitle>
              <DialogDescription className="mt-1">
                {isAudit
                  ? "Capture site findings. Submitting updates RAG status and forecast inputs in real time."
                  : "Update the master record for this roof section. Changes are logged to the audit trail."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogBody className="space-y-5">
          {/* Section context strip */}
          <div className="flex items-center justify-between rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-cream)] px-4 py-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10.5px] uppercase tracking-[0.14em] font-display font-semibold text-[color:var(--color-ink-muted)]">
                {building.code} — {building.name}
              </span>
              <span className="font-display text-[18px] font-semibold text-[color:var(--color-ink-strong)] leading-none">
                {section.id}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10.5px] uppercase tracking-[0.14em] font-display font-semibold text-[color:var(--color-ink-muted)]">
                Current
              </span>
              <RagBadge rag={section.rag} />
            </div>
          </div>

          {isAudit && (
            <Field label="Equipment / area inspected" eyebrow>
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
          )}

          {/* RAG */}
          <Field label="RAG status" eyebrow>
            <RadioGroup
              value={rag}
              onValueChange={(v) => setRag(v as RagStatus)}
              className="grid-cols-3"
            >
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
            eyebrow
            trailing={
              <span className="font-display text-[14px] font-semibold tabular-nums text-[color:var(--color-ink-strong)]">
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
            <div className="flex justify-between text-[10.5px] text-[color:var(--color-ink-faint)] mt-1.5 font-medium">
              <span>1 yr</span>
              <span>15 yrs</span>
              <span>30 yrs</span>
            </div>
          </Field>

          {!isAudit && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Roof area (m²)" eyebrow>
                  <NumberInput
                    value={areaSqm}
                    onChange={setAreaSqm}
                    min={1}
                    max={5000}
                    step={5}
                    suffix="m²"
                  />
                </Field>
                <Field label="Forecast cost" eyebrow trailing={<span className="text-[11px] text-[color:var(--color-ink-muted)]">{formatGbpFull(cost)}</span>}>
                  <NumberInput
                    value={cost}
                    onChange={setCost}
                    min={0}
                    max={5_000_000}
                    step={1000}
                    prefix="£"
                  />
                </Field>
              </div>

              <Field label="Roof type" eyebrow>
                <Select value={roofType} onValueChange={(v) => setRoofType(v as RoofType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOF_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label={`Building name (${building.code})`} eyebrow>
                <TextInput value={buildingName} onChange={setBuildingName} />
              </Field>
            </>
          )}

          {/* Notes */}
          <Field
            label={isAudit ? "Notes" : "Change note"}
            eyebrow
            optional={!isAudit}
          >
            <Textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                isAudit
                  ? "Observed condition, defects, recommended actions…"
                  : "Reason for change, source document, etc. (optional)"
              }
            />
          </Field>

          {isAudit && (
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-[color:var(--color-line-strong)] bg-[color:var(--color-cream)] px-4 py-3 text-[color:var(--color-ink-muted)]">
              <Camera className="h-4 w-4 shrink-0" />
              <div className="flex-1">
                <div className="text-[12.5px] font-medium text-[color:var(--color-ink-soft)] font-display">
                  Photo upload
                </div>
                <div className="text-[11px]">Demo build — drag &amp; drop not active in preview</div>
              </div>
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-2 mr-auto text-[11.5px] text-[color:var(--color-ink-muted)]">
            {isAudit ? (
              <>
                <ClipboardCheck className="h-3.5 w-3.5" /> Recorded against your auditor profile
              </>
            ) : (
              <>
                <Pencil className="h-3.5 w-3.5" /> Changes appear instantly across the portal
              </>
            )}
          </div>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving…" : isAudit ? "Submit audit" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  eyebrow,
  optional,
  trailing,
  children,
}: {
  label: string;
  eyebrow?: boolean;
  optional?: boolean;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          className={
            eyebrow
              ? "text-[10.5px] uppercase tracking-[0.14em] font-display font-semibold text-[color:var(--color-ink-muted)]"
              : "text-[12.5px] font-medium text-[color:var(--color-ink-strong)]"
          }
        >
          {label}
          {optional && (
            <span className="ml-1.5 text-[10px] text-[color:var(--color-ink-faint)] font-body normal-case tracking-normal">
              (optional)
            </span>
          )}
        </label>
        {trailing}
      </div>
      {children}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="flex items-center rounded-lg border border-[color:var(--color-line-strong)] bg-[color:var(--color-paper)] focus-within:border-[color:var(--color-sycamore)]/50 focus-within:ring-2 focus-within:ring-[color:var(--color-sycamore)]/15 transition-colors h-9 px-3">
      {prefix && <span className="text-[12.5px] text-[color:var(--color-ink-muted)] mr-1">{prefix}</span>}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="flex-1 bg-transparent outline-none text-[13.5px] text-[color:var(--color-ink-strong)] tabular-nums font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      {suffix && <span className="text-[12.5px] text-[color:var(--color-ink-muted)] ml-1">{suffix}</span>}
    </div>
  );
}

function TextInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex w-full rounded-lg border border-[color:var(--color-line-strong)] bg-[color:var(--color-paper)] px-3 h-9 text-[13.5px] text-[color:var(--color-ink-strong)] font-medium focus:outline-none focus:border-[color:var(--color-sycamore)]/50 focus:ring-2 focus:ring-[color:var(--color-sycamore)]/15 transition-colors"
    />
  );
}
