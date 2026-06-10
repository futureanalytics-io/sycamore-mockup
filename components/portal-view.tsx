"use client";

/*
 * PortalView — the client-facing roof-asset portal (University of Bradford
 * estate). Previously the "external" env; now rendered inside SycFlow as the
 * client-portal sub-view. Self-contained: owns its own tab state + the section
 * editor modal.
 */
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { KpiGrid, HeroStats } from "@/components/kpi-grid";
import { BuildingDetail } from "@/components/building-detail";
import { SectionEditor } from "@/components/section-editor";
import { AuditLog } from "@/components/audit-log";
import { AssetsTable } from "@/components/assets-table";
import { AnalyticsPage } from "@/components/analytics-page";
import { CampusMapClient } from "@/components/dynamic-map";
import { usePortalStore } from "@/lib/store";
import { LayoutGrid, Map as MapIcon, Building2, ClipboardCheck, BarChart3 } from "lucide-react";

const TAB_VALUES = ["overview", "map", "analytics", "assets", "audits"] as const;
type TabValue = (typeof TAB_VALUES)[number];

export function PortalView() {
  const [tab, setTab] = useState<TabValue>("overview");

  const { selectedSectionId, selectSection } = usePortalStore();
  const hydrate = usePortalStore((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"audit" | "edit">("audit");
  const openEditor = (mode: "audit" | "edit") => {
    setEditorMode(mode);
    setEditorOpen(true);
  };

  return (
    <div className="rounded-2xl border border-[color:var(--color-line)] overflow-hidden surface-raised">
      <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
        <div className="px-3 sm:px-5 border-b border-[color:var(--color-line)] bg-[color:var(--color-paper)]">
          <TabsList className="my-3">
            <TabsTrigger value="overview"><LayoutGrid className="h-3.5 w-3.5" />Overview</TabsTrigger>
            <TabsTrigger value="map"><MapIcon className="h-3.5 w-3.5" />Campus map</TabsTrigger>
            <TabsTrigger value="analytics"><BarChart3 className="h-3.5 w-3.5" />Analytics</TabsTrigger>
            <TabsTrigger value="assets"><Building2 className="h-3.5 w-3.5" />Assets</TabsTrigger>
            <TabsTrigger value="audits"><ClipboardCheck className="h-3.5 w-3.5" />Audit log</TabsTrigger>
          </TabsList>
        </div>

        <div className="p-3 sm:p-5 flex flex-col gap-4 sm:gap-6">
          <TabsContent value="overview" className="space-y-6 m-0">
            <div className="hero-gradient rounded-2xl border border-[color:var(--color-line)] px-4 py-5 sm:px-7 sm:py-6 shadow-[0_1px_3px_rgba(20,36,43,0.05),0_10px_30px_-16px_rgba(20,36,43,0.18)]">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
                <div>
                  <div className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.16em] text-[color:var(--color-sycamore-strong)] font-display font-bold mb-2.5 rounded-full bg-[color:var(--color-paper)]/70 border border-[color:var(--color-sycamore)]/15 px-2.5 py-1">
                    Capital condition · Live
                  </div>
                  <h1 className="brand-title text-[30px] leading-none">Roof asset overview</h1>
                  <p className="text-[13px] text-[color:var(--color-ink-soft)] mt-3 max-w-[680px]">
                    Field auditors update RAG and remaining life in the moment; Estates &amp; Facilities
                    see capital exposure refresh immediately across every chart and table.
                  </p>
                </div>
                <HeroStats />
              </div>
            </div>

            <KpiGrid />

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
              <CampusMapClient height={560} onSectionDoubleClick={() => openEditor("edit")} />
              <BuildingDetail onOpenEditor={openEditor} />
            </div>

            <AuditLog compact limit={4} />
          </TabsContent>

          <TabsContent value="map" className="m-0 space-y-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-sycamore)] font-display font-semibold mb-1.5">Live campus map</div>
              <h1 className="brand-title text-[24px] leading-none">University of Bradford estate</h1>
              <p className="text-[12.5px] text-[color:var(--color-ink-muted)] mt-2 max-w-[640px]">
                Hover a section for live details. Click to edit master data or log a new audit.
              </p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
              <CampusMapClient height={680} fullWidth onSectionDoubleClick={() => openEditor("edit")} />
              <BuildingDetail onOpenEditor={openEditor} />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="m-0"><AnalyticsPage /></TabsContent>

          <TabsContent value="assets" className="m-0 space-y-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-sycamore)] font-display font-semibold mb-1.5">Asset register</div>
              <h1 className="brand-title text-[24px] leading-none">All roof sections</h1>
            </div>
            <AssetsTable />
          </TabsContent>

          <TabsContent value="audits" className="m-0 space-y-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-sycamore)] font-display font-semibold mb-1.5">Audit trail</div>
              <h1 className="brand-title text-[24px] leading-none">Full audit log</h1>
            </div>
            <AuditLog />
          </TabsContent>
        </div>
      </Tabs>

      <SectionEditor
        open={editorOpen}
        onOpenChange={(v) => {
          setEditorOpen(v);
          if (!v) void selectSection;
        }}
        sectionId={selectedSectionId}
        mode={editorMode}
      />
    </div>
  );
}
