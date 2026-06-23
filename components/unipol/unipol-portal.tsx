"use client";

/*
 * Unipol fire-compartmentation portal — a faithful web replica of the Unipol
 * Power BI dashboard plus survey-derived value modules. Self-contained: owns
 * tab state, reads slicer filters from the Unipol store, and renders the modal.
 * Sycamore Square is the delivery brand (chrome); Unipol is the client.
 */
import { useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UnipolSlicers } from "@/components/unipol/unipol-slicers";
import { UnipolKpis } from "@/components/unipol/unipol-kpis";
import { UnipolCharts } from "@/components/unipol/unipol-charts";
import { DefectTable } from "@/components/unipol/defect-table";
import { UnipolEvidence } from "@/components/unipol/unipol-evidence";
import { UnipolRemedial } from "@/components/unipol/unipol-remedial";
import { DefectModal } from "@/components/unipol/defect-modal";
import { useUnipolStore } from "@/lib/unipol-store";
import { DEFECTS, applyFilters, computeKpis } from "@/lib/unipol-data";
import { BarChart3, Table2, Images, ClipboardList } from "lucide-react";

export function UnipolPortal() {
  const filters = useUnipolStore((s) => s.filters);
  const defects = useMemo(() => applyFilters(DEFECTS, filters), [filters]);
  const kpis = useMemo(() => computeKpis(defects), [defects]);

  return (
    <div className="space-y-5">
      <UnipolSlicers />

      <div className="rounded-2xl border border-[color:var(--color-line)] overflow-hidden surface-raised">
        <Tabs defaultValue="dashboard">
          <div className="px-3 sm:px-5 border-b border-[color:var(--color-line)] bg-[color:var(--color-paper)]">
            <TabsList className="my-3">
              <TabsTrigger value="dashboard"><BarChart3 className="h-3.5 w-3.5" />Dashboard</TabsTrigger>
              <TabsTrigger value="register"><Table2 className="h-3.5 w-3.5" />Defect register</TabsTrigger>
              <TabsTrigger value="evidence"><Images className="h-3.5 w-3.5" />Evidence</TabsTrigger>
              <TabsTrigger value="remedial"><ClipboardList className="h-3.5 w-3.5" />Remedial plan</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-3 sm:p-5">
            <TabsContent value="dashboard" className="m-0 space-y-5">
              <div className="hero-gradient rounded-2xl border border-[color:var(--color-line)] px-4 py-5 sm:px-7 sm:py-6 shadow-[var(--shadow-sm)]">
                <div className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.16em] text-[color:var(--color-sycamore-strong)] font-display font-bold mb-2.5 rounded-full bg-[color:var(--color-paper)]/70 border border-[color:var(--color-sycamore)]/15 px-2.5 py-1">
                  Fire compartmentation · Remedial works
                </div>
                <h1 className="brand-title text-[28px] leading-none">Compartmentation survey overview</h1>
                <p className="text-[13px] text-[color:var(--color-ink-soft)] mt-3 max-w-[720px]">
                  Live view of the fire-compartmentation survey across Unipol&apos;s Woodhouse, Leeds portfolio.
                  Hover any chart for the underlying observations and site photos; use the slicers to cross-filter
                  every view.
                </p>
              </div>

              <UnipolKpis kpis={kpis} defects={defects} />
              <UnipolCharts defects={defects} />
            </TabsContent>

            <TabsContent value="register" className="m-0 space-y-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-sycamore)] font-display font-semibold mb-1.5">Defect register</div>
                <h2 className="brand-title text-[22px] leading-none">Every surveyed item</h2>
              </div>
              <DefectTable defects={defects} />
            </TabsContent>

            <TabsContent value="evidence" className="m-0">
              <UnipolEvidence defects={defects} />
            </TabsContent>

            <TabsContent value="remedial" className="m-0">
              <UnipolRemedial defects={defects} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <DefectModal />
    </div>
  );
}
