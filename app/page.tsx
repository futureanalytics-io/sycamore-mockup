"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Header } from "@/components/header";
import { KpiGrid } from "@/components/kpi-grid";
import { BuildingDetail } from "@/components/building-detail";
import { AuditModal } from "@/components/audit-modal";
import { AuditLog } from "@/components/audit-log";
import { AssetsTable } from "@/components/assets-table";
import { CampusMapClient } from "@/components/dynamic-map";
import { usePortalStore } from "@/lib/store";

const TAB_VALUES = ["overview", "map", "assets", "audits"] as const;
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

  const { selectedSectionId } = usePortalStore();
  const [auditOpen, setAuditOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[color:var(--color-background)] flex flex-col">
      <Header />

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
        <div className="px-6 border-b border-[color:var(--color-border)] bg-white">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="map">Campus map</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="audits">Audit log</TabsTrigger>
          </TabsList>
        </div>

        <main className="px-6 py-5 flex-1 flex flex-col gap-5">
          <TabsContent value="overview" className="space-y-5 m-0">
            <KpiGrid />
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">
              <CampusMapClient height={560} />
              <BuildingDetail onOpenAudit={() => setAuditOpen(true)} />
            </div>
            <AuditLog compact limit={4} />
          </TabsContent>

          <TabsContent value="map" className="m-0 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[14px] font-medium">Campus map — full editor</div>
                <div className="text-[12px] text-[color:var(--color-muted)] mt-0.5">
                  Toggle edit mode to drag vertices, draw new sections, or export the polygon set as JSON.
                </div>
              </div>
            </div>
            <CampusMapClient height={680} fullWidth />
          </TabsContent>

          <TabsContent value="assets" className="m-0">
            <AssetsTable />
          </TabsContent>

          <TabsContent value="audits" className="m-0">
            <AuditLog />
          </TabsContent>
        </main>
      </Tabs>

      <AuditModal
        open={auditOpen}
        onOpenChange={setAuditOpen}
        sectionId={selectedSectionId}
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
