"use client";

/*
 * Full defect detail modal. Opened by clicking a chart segment, a KPI tile, a
 * register row or an evidence photo. Shows verbatim Observation + Scope and the
 * genuine survey photographs. Handles a single defect or a group (e.g. all the
 * High-priority defects, or one building).
 */
import Image from "next/image";
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
import { useUnipolStore } from "@/lib/unipol-store";
import {
  PRIORITY_META,
  photosForCategory,
  type Defect,
} from "@/lib/unipol-data";
import { AlertTriangle, Clock, FileSearch, MapPin, Hash, Building2 } from "lucide-react";

function PriorityBadge({ defect, size = "md" }: { defect: Defect; size?: "sm" | "md" }) {
  const m = PRIORITY_META[defect.priority];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full font-medium font-display"
      style={{
        background: m.bg,
        color: m.text,
        fontSize: size === "sm" ? 10.5 : 11.5,
        padding: size === "sm" ? "2px 8px" : "4px 10px",
      }}
    >
      <span className="rounded-full" style={{ background: m.fill, width: 7, height: 7 }} />
      {defect.priority} · {defect.rag}
    </span>
  );
}

function MetaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-[color:var(--color-sycamore)] opacity-80 mt-0.5">{icon}</span>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-[0.1em] text-[color:var(--color-ink-muted)] font-display font-semibold">
          {label}
        </div>
        <div className="text-[12.5px] text-[color:var(--color-ink-strong)] font-medium break-words">{value}</div>
      </div>
    </div>
  );
}

function TextBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.12em] text-[color:var(--color-ink-muted)] font-display font-semibold mb-1">
        {label}
      </div>
      <p className="text-[13px] leading-relaxed text-[color:var(--color-ink-soft)]">{children}</p>
    </div>
  );
}

function SingleDefect({ defect }: { defect: Defect }) {
  const photos = photosForCategory(defect.workCategory);
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <PriorityBadge defect={defect} />
        <span className="inline-flex items-center rounded-full bg-[color:var(--color-cream)] border border-[color:var(--color-line)] px-2.5 py-1 text-[11.5px] text-[color:var(--color-ink-soft)] font-medium">
          {defect.workCategory}
        </span>
        {defect.additionalSurvey && (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-medium" style={{ background: "rgba(214,69,80,0.1)", color: "#9b2530" }}>
            <FileSearch className="h-3 w-3" /> Additional survey required
          </span>
        )}
        <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-cream)] border border-[color:var(--color-line)] px-2.5 py-1 text-[11.5px] text-[color:var(--color-ink-soft)] font-medium">
          <Clock className="h-3 w-3" /> {defect.timeline ?? "Not scheduled"}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetaItem icon={<Hash className="h-3.5 w-3.5" />} label="Ref" value={defect.ref} />
        <MetaItem icon={<Building2 className="h-3.5 w-3.5" />} label="Building" value={defect.buildingName} />
        <MetaItem icon={<MapPin className="h-3.5 w-3.5" />} label="Location" value={defect.location} />
        <MetaItem icon={<Hash className="h-3.5 w-3.5" />} label="Quantity" value={`${defect.quantity}`} />
      </div>

      <TextBlock label="Observation">{defect.observation}</TextBlock>
      <TextBlock label="Remedial scope">{defect.scope}</TextBlock>

      <div>
        <div className="text-[10px] uppercase tracking-[0.12em] text-[color:var(--color-ink-muted)] font-display font-semibold mb-2">
          Survey evidence
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {photos.map((p) => (
            <figure key={p.src} className="space-y-1">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[color:var(--color-line)] bg-[color:var(--color-cream)]">
                <Image src={p.src} alt={p.caption} fill sizes="(max-width:640px) 50vw, 200px" className="object-cover" />
              </div>
              <figcaption className="text-[10.5px] leading-snug text-[color:var(--color-ink-muted)]">{p.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

function DefectRow({ defect }: { defect: Defect }) {
  const photo = photosForCategory(defect.workCategory)[0];
  return (
    <div className="flex gap-3 rounded-xl border border-[color:var(--color-line)] p-3 bg-[color:var(--color-paper)]">
      <div
        className="h-[68px] w-[88px] shrink-0 rounded-md bg-cover bg-center border border-[color:var(--color-line)]"
        style={{ backgroundImage: `url(${photo.src})` }}
      />
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display font-semibold text-[12.5px] text-[color:var(--color-ink-strong)]">{defect.ref}</span>
          <PriorityBadge defect={defect} size="sm" />
          <span className="text-[11px] text-[color:var(--color-ink-muted)]">{defect.buildingName} · {defect.location}</span>
        </div>
        <p className="text-[12px] leading-snug text-[color:var(--color-ink-soft)] line-clamp-2">{defect.observation}</p>
        <p className="text-[11px] leading-snug text-[color:var(--color-ink-muted)] line-clamp-1">
          <span className="font-medium text-[color:var(--color-ink-soft)]">Scope:</span> {defect.scope}
        </p>
      </div>
    </div>
  );
}

export function DefectModal() {
  const group = useUnipolStore((s) => s.group);
  const closeGroup = useUnipolStore((s) => s.closeGroup);
  const open = !!group;
  const single = group?.defects.length === 1 ? group.defects[0] : null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) closeGroup(); }}>
      <DialogContent className="max-w-[680px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {group && group.defects.some((d) => d.priority === "High") && (
              <AlertTriangle className="h-4 w-4 text-[#D64550]" />
            )}
            <DialogTitle>{group?.title ?? ""}</DialogTitle>
          </div>
          <DialogDescription>
            {group?.subtitle ??
              (group ? `${group.defects.length} compartmentation item${group.defects.length > 1 ? "s" : ""}` : "")}
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          {single ? (
            <SingleDefect defect={single} />
          ) : (
            <div className="space-y-2.5">
              {group?.defects.map((d) => <DefectRow key={d.ref} defect={d} />)}
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={closeGroup}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
