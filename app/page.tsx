"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Header } from "@/components/header";
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

function PageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabValue) || "overview";

  const [tab, setTab] = useState<TabValue>(
    TAB_VALUES.includes(initialTab) ? initialTab : "overview"
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") !== tab) {
      params.set("tab", tab);
      router.replace(`/?${params.toString()}`, { scroll: false });
    }
  }, [tab, router]);

  const { selectedSectionId, selectSection } = usePortalStore();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"audit" | "edit">("audit");

  const openEditor = (mode: "audit" | "edit") => {
    setEditorMode(mode);
    setEditorOpen(true);
  };

  return (
    <div className="min-h-screen bg-[color:var(--color-cream)] flex flex-col">
      <Header />

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
        <div className="px-7 border-b border-[color:var(--color-line)] bg-[color:var(--color-paper)]">
          <TabsList>
            <TabsTrigger value="overview">
              <LayoutGrid className="h-3.5 w-3.5" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="map">
              <MapIcon className="h-3.5 w-3.5" />
              Campus map
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-3.5 w-3.5" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="assets">
              <Building2 className="h-3.5 w-3.5" />
              Assets
            </TabsTrigger>
            <TabsTrigger value="audits">
              <ClipboardCheck className="h-3.5 w-3.5" />
              Audit log
            </TabsTrigger>
          </TabsList>
        </div>

        <main className="px-7 py-6 flex-1 flex flex-col gap-6 max-w-[1600px] w-full mx-auto">
          <TabsContent value="overview" className="space-y-6 m-0">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-sycamore)] font-display font-semibold mb-1.5">
                  Capital condition · Live
                </div>
                <h1 className="brand-title text-[28px] leading-none">Roof asset overview</h1>
                <p className="text-[12.5px] text-[color:var(--color-ink-muted)] mt-3 max-w-[680px]">
                  Field auditors update RAG and remaining life in the moment; Estates &amp; Facilities
                  see capital exposure refresh immediately across every chart and table.
                </p>
              </div>
              <HeroStats />
            </div>

            <KpiGrid />

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
              <CampusMapClient
                height={560}
                onSectionDoubleClick={() => openEditor("edit")}
              />
              <BuildingDetail onOpenEditor={openEditor} />
            </div>

            <AuditLog compact limit={4} />
          </TabsContent>

          <TabsContent value="map" className="m-0 space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-sycamore)] font-display font-semibold mb-1.5">
                  Live campus map
                </div>
                <h1 className="brand-title text-[24px] leading-none">University of Bradford estate</h1>
                <p className="text-[12.5px] text-[color:var(--color-ink-muted)] mt-2 max-w-[640px]">
                  Hover a section for live details. Click to edit master data or log a new audit.
                  Toggle <strong className="font-display text-[color:var(--color-ink-strong)]">Edit polygons</strong> to
                  drag vertices, trace new sections, or export the full set as JSON.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
              <CampusMapClient
                height={680}
                fullWidth
                onSectionDoubleClick={() => openEditor("edit")}
              />
              <BuildingDetail onOpenEditor={openEditor} />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="m-0">
            <AnalyticsPage />
          </TabsContent>

          <TabsContent value="assets" className="m-0 space-y-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-sycamore)] font-display font-semibold mb-1.5">
                Asset register
              </div>
              <h1 className="brand-title text-[24px] leading-none">All roof sections</h1>
            </div>
            <AssetsTable />
          </TabsContent>

          <TabsContent value="audits" className="m-0 space-y-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-sycamore)] font-display font-semibold mb-1.5">
                Audit trail
              </div>
              <h1 className="brand-title text-[24px] leading-none">Full audit log</h1>
            </div>
            <AuditLog />
          </TabsContent>
        </main>

        <footer className="mt-auto border-t border-[color:var(--color-line)] bg-[color:var(--color-navy)] text-white py-5 px-7">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between text-[11.5px]">
            <div className="flex items-center gap-3 opacity-90">
              <span className="font-display font-semibold">Sycamore Square Group</span>
              <span className="opacity-60">·</span>
              <span className="opacity-80">Capital condition platform</span>
              <span className="opacity-60">·</span>
              <span className="opacity-80">Deployed for University of Bradford</span>
            </div>
            <div className="opacity-70">© {new Date().getFullYear()} Sycamore Square Group Ltd.</div>
          </div>
        </footer>
      </Tabs>

      <SectionEditor
        open={editorOpen}
        onOpenChange={(v) => {
          setEditorOpen(v);
          if (!v) {
            // selectSection is intentionally not cleared so the panel still
            // shows the section after the modal closes
            void selectSection;
          }
        }}
        sectionId={selectedSectionId}
        mode={editorMode}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageInner />
    </Suspense>
  );
}
