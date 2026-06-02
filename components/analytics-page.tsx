"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { usePortalStore, selectAllSections } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from "@/components/ui/card";
import { RAG_COLORS, formatGbp, formatArea } from "@/lib/rag";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import type { RagStatus, RoofType } from "@/lib/types";

const TYPE_COLORS: Record<string, string> = {
  "Built-up felt": "#377587",
  "Single-ply membrane": "#544862",
  "Standing seam metal": "#22B8F0",
  Asphalt: "#A05E3F",
  Slate: "#3F5562",
  "Concrete tile": "#B5A47A",
  "EPDM rubber": "#7B6884",
  "Green roof": "#76A160",
};

const RAG_KEYS: RagStatus[] = ["red", "amber", "green"];

const AXIS_TICK = { fontSize: 11, fill: "#404D55", fontFamily: "var(--font-nunito)" } as const;
const AXIS_LABEL = { fontSize: 11, fill: "#6b7680", fontFamily: "var(--font-nunito)" } as const;

const tooltipStyle = {
  background: "#ffffff",
  border: "0.5px solid rgba(17,32,37,0.15)",
  borderRadius: 10,
  boxShadow: "0 8px 24px rgba(17,32,37,0.12)",
  fontSize: 12,
  fontFamily: "var(--font-nunito)",
  padding: "8px 10px",
} as const;

export function AnalyticsPage() {
  const sections = usePortalStore(useShallow(selectAllSections));
  const buildings = usePortalStore((s) => s.buildings);

  // Area by Roof Fabric (donut) — group by RAG
  const areaByRag = useMemo(() => {
    return RAG_KEYS.map((rag) => ({
      name: RAG_COLORS[rag].label,
      key: rag,
      value: sections.filter((s) => s.rag === rag).reduce((sum, s) => sum + s.areaSqm, 0),
      fill: RAG_COLORS[rag].fill,
    }));
  }, [sections]);

  // Area by Building & Overall Priority (stacked horizontal bar)
  const areaByBuilding = useMemo(() => {
    return [...buildings]
      .map((b) => {
        const r = b.sections.filter((s) => s.rag === "red").reduce((sum, s) => sum + s.areaSqm, 0);
        const a = b.sections.filter((s) => s.rag === "amber").reduce((sum, s) => sum + s.areaSqm, 0);
        const g = b.sections.filter((s) => s.rag === "green").reduce((sum, s) => sum + s.areaSqm, 0);
        return { name: b.code, red: r, amber: a, green: g, total: r + a + g };
      })
      .sort((a, b) => b.total - a.total);
  }, [buildings]);

  // Area by Life Expectancy (stacked column by year buckets × RAG)
  const lifeBuckets = useMemo(() => {
    const buckets = [
      { name: "0–5 yrs", range: [0, 5] as [number, number] },
      { name: "6–10 yrs", range: [6, 10] as [number, number] },
      { name: "11–15 yrs", range: [11, 15] as [number, number] },
      { name: "16–20 yrs", range: [16, 20] as [number, number] },
      { name: "21+ yrs", range: [21, 100] as [number, number] },
    ];
    return buckets.map((b) => {
      const inRange = sections.filter(
        (s) => s.lifeRemainingYears >= b.range[0] && s.lifeRemainingYears <= b.range[1]
      );
      return {
        name: b.name,
        red: inRange.filter((s) => s.rag === "red").reduce((sum, s) => sum + s.areaSqm, 0),
        amber: inRange.filter((s) => s.rag === "amber").reduce((sum, s) => sum + s.areaSqm, 0),
        green: inRange.filter((s) => s.rag === "green").reduce((sum, s) => sum + s.areaSqm, 0),
      };
    });
  }, [sections]);

  // Area by Roof Type (donut)
  const areaByType = useMemo(() => {
    const map = new Map<string, number>();
    sections.forEach((s) => {
      map.set(s.roofType, (map.get(s.roofType) || 0) + s.areaSqm);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value, fill: TYPE_COLORS[name] || "#888" }))
      .sort((a, b) => b.value - a.value);
  }, [sections]);

  // Cost by Roof Type (column)
  const costByType = useMemo(() => {
    const map = new Map<string, number>();
    sections.forEach((s) => {
      map.set(s.roofType, (map.get(s.roofType) || 0) + s.forecastCostGbp);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value, fill: TYPE_COLORS[name] || "#888" }))
      .sort((a, b) => b.value - a.value);
  }, [sections]);

  // Forecast Cost by Roof Name / building (column)
  const costByBuilding = useMemo(() => {
    return [...buildings]
      .map((b) => ({
        name: b.code,
        value: b.sections.reduce((sum, s) => sum + s.forecastCostGbp, 0),
      }))
      .sort((a, b) => b.value - a.value);
  }, [buildings]);

  // Forecasted Costs by Year — spread cost across 1-year, 2-year, etc remaining life buckets
  const forecastedByYear = useMemo(() => {
    const thisYear = new Date().getFullYear();
    const buckets: { name: string; value: number; red: number; amber: number; green: number }[] = [];
    for (let i = 0; i <= 10; i++) {
      buckets.push({
        name: `${thisYear + i}`,
        value: 0,
        red: 0,
        amber: 0,
        green: 0,
      });
    }
    sections.forEach((s) => {
      const idx = Math.min(Math.max(s.lifeRemainingYears, 0), 10);
      buckets[idx].value += s.forecastCostGbp;
      buckets[idx][s.rag] += s.forecastCostGbp;
    });
    return buckets;
  }, [sections]);

  const totalArea = sections.reduce((sum, s) => sum + s.areaSqm, 0);
  const totalCost = sections.reduce((sum, s) => sum + s.forecastCostGbp, 0);

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-sycamore)] font-display font-semibold mb-1">
            Analytics
          </div>
          <h2 className="brand-title text-[24px] leading-[1]">Portfolio overview</h2>
          <p className="text-[12.5px] text-[color:var(--color-ink-muted)] mt-2 max-w-[640px]">
            Live capital and condition analytics across the University of Bradford estate. Every
            chart reflects the current section register and audit log — log a new audit and these
            update immediately.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-4 text-right">
          <Pill label="Total area" value={formatArea(totalArea)} accent="sycamore" />
          <Pill label="Total forecast" value={formatGbp(totalCost)} accent="eggplant" />
        </div>
      </div>

      {/* Row 1: donut + stacked bar (full width) */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-5">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Area by RAG fabric</CardTitle>
              <CardSubtitle>Share of total roof area by condition</CardSubtitle>
            </div>
          </CardHeader>
          <CardContent>
            <RagDonut data={areaByRag} totalArea={totalArea} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Area by building &amp; priority</CardTitle>
              <CardSubtitle>Roof area per building, stacked by RAG</CardSubtitle>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areaByBuilding} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 6 }}>
                  <CartesianGrid stroke="rgba(17,32,37,0.06)" horizontal={false} />
                  <XAxis type="number" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={AXIS_TICK}
                    axisLine={false}
                    tickLine={false}
                    width={50}
                  />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(17,32,37,0.04)" }} />
                  <Bar dataKey="red" stackId="rag" fill={RAG_COLORS.red.fill} />
                  <Bar dataKey="amber" stackId="rag" fill={RAG_COLORS.amber.fill} />
                  <Bar dataKey="green" stackId="rag" fill={RAG_COLORS.green.fill} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: life expectancy + roof type donut */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Area by life expectancy</CardTitle>
              <CardSubtitle>Roof area grouped by remaining lifespan, stacked by RAG</CardSubtitle>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lifeBuckets} margin={{ top: 12, right: 12, bottom: 4, left: 0 }}>
                  <CartesianGrid stroke="rgba(17,32,37,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                  <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(17,32,37,0.04)" }} />
                  <Bar dataKey="red" stackId="rag" fill={RAG_COLORS.red.fill} />
                  <Bar dataKey="amber" stackId="rag" fill={RAG_COLORS.amber.fill} />
                  <Bar dataKey="green" stackId="rag" fill={RAG_COLORS.green.fill} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Area by roof type</CardTitle>
              <CardSubtitle>Share of total area by fabric</CardSubtitle>
            </div>
          </CardHeader>
          <CardContent>
            <TypeDonut data={areaByType} unit="m²" />
          </CardContent>
        </Card>
      </div>

      {/* Row 3: cost by type + cost by building */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Forecast cost by roof type</CardTitle>
              <CardSubtitle>Capital exposure by fabric</CardSubtitle>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costByType} margin={{ top: 12, right: 12, bottom: 4, left: 0 }}>
                  <CartesianGrid stroke="rgba(17,32,37,0.06)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={AXIS_TICK}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={AXIS_TICK}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => (v >= 1_000_000 ? `£${(v / 1_000_000).toFixed(1)}M` : `£${(v / 1000).toFixed(0)}k`)}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: "rgba(17,32,37,0.04)" }}
                    formatter={((v: unknown) => [formatGbp(Number(v)), "Forecast"]) as never}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {costByType.map((d, i) => (
                      <Cell key={i} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Forecast cost by building</CardTitle>
              <CardSubtitle>Total capital exposure per building</CardSubtitle>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costByBuilding} margin={{ top: 12, right: 12, bottom: 4, left: 0 }}>
                  <CartesianGrid stroke="rgba(17,32,37,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={AXIS_TICK}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => (v >= 1_000_000 ? `£${(v / 1_000_000).toFixed(1)}M` : `£${(v / 1000).toFixed(0)}k`)}
                  />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(17,32,37,0.04)" }} formatter={((v: unknown) => [formatGbp(Number(v)), "Forecast"]) as never} />
                  <Bar dataKey="value" fill="#377587" radius={[4, 4, 0, 0]}>
                    <LabelList
                      dataKey="value"
                      position="top"
                      formatter={((v: unknown) => {
                        const n = Number(v);
                        return n >= 1_000_000 ? `£${(n / 1_000_000).toFixed(1)}M` : "";
                      }) as never}
                      style={{
                        fontSize: 10.5,
                        fill: "#404D55",
                        fontFamily: "var(--font-nunito)",
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: forecasted spend timeline (full width) */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Forecasted spend by year</CardTitle>
            <CardSubtitle>Capital due based on remaining lifespan, stacked by RAG band</CardSubtitle>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastedByYear} margin={{ top: 16, right: 12, bottom: 4, left: 0 }}>
                <CartesianGrid stroke="rgba(17,32,37,0.06)" vertical={false} />
                <XAxis dataKey="name" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <YAxis
                  tick={AXIS_TICK}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => (v >= 1_000_000 ? `£${(v / 1_000_000).toFixed(1)}M` : `£${(v / 1000).toFixed(0)}k`)}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(17,32,37,0.04)" }} formatter={((v: unknown) => formatGbp(Number(v))) as never} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-nunito)", color: "#404D55", paddingTop: 8 }}
                />
                <Bar dataKey="red" name="Red" stackId="rag" fill={RAG_COLORS.red.fill} />
                <Bar dataKey="amber" name="Amber" stackId="rag" fill={RAG_COLORS.amber.fill} />
                <Bar dataKey="green" name="Green" stackId="rag" fill={RAG_COLORS.green.fill} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  void AXIS_LABEL; // referenced via theme tokens later if needed
}

function Pill({ label, value, accent }: { label: string; value: string; accent: "sycamore" | "eggplant" }) {
  const palette =
    accent === "sycamore"
      ? { bg: "var(--color-sycamore-soft)", color: "var(--color-sycamore-strong)" }
      : { bg: "var(--color-eggplant-soft)", color: "var(--color-eggplant)" };
  return (
    <div
      className="rounded-xl px-3.5 py-2 text-left"
      style={{ background: palette.bg }}
    >
      <div className="text-[10px] uppercase tracking-[0.14em] font-display font-semibold" style={{ color: palette.color }}>
        {label}
      </div>
      <div className="font-display text-[18px] font-semibold tabular-nums" style={{ color: palette.color }}>
        {value}
      </div>
    </div>
  );
}

function RagDonut({
  data,
  totalArea,
}: {
  data: { name: string; key: RagStatus; value: number; fill: string }[];
  totalArea: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-[180px] w-[180px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.fill} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={((v: unknown) => formatArea(Number(v))) as never} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="font-display text-[20px] font-semibold tabular-nums leading-none">
            {formatArea(totalArea)}
          </div>
          <div className="text-[10.5px] uppercase tracking-[0.12em] text-[color:var(--color-ink-muted)] mt-1 font-display font-semibold">
            Total area
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-2 min-w-0">
        {data.map((d) => (
          <div key={d.name} className="flex items-center justify-between gap-2 text-[12.5px]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: d.fill }} />
              <span className="text-[color:var(--color-ink-strong)] font-medium">{d.name}</span>
            </div>
            <div className="text-right">
              <div className="tabular-nums font-display font-semibold text-[color:var(--color-ink-strong)]">
                {formatArea(d.value)}
              </div>
              <div className="text-[10.5px] text-[color:var(--color-ink-muted)]">
                {totalArea > 0 ? Math.round((d.value / totalArea) * 100) : 0}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypeDonut({ data, unit }: { data: { name: string; value: number; fill: string }[]; unit: string }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <div className="space-y-3">
      <div className="h-[170px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.fill} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={((v: unknown) => formatArea(Number(v))) as never} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-1.5">
        {data.slice(0, 6).map((d) => (
          <div key={d.name} className="flex items-center justify-between gap-2 text-[11.5px]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-2 w-2 rounded-sm shrink-0" style={{ background: d.fill }} />
              <span className="text-[color:var(--color-ink-soft)] truncate">{d.name}</span>
            </div>
            <div className="tabular-nums text-[color:var(--color-ink-strong)] font-medium">
              {total > 0 ? Math.round((d.value / total) * 100) : 0}%
            </div>
          </div>
        ))}
      </div>
      <div className="text-[10.5px] text-[color:var(--color-ink-faint)] mt-2 pt-2 border-t border-[color:var(--color-line)] uppercase tracking-[0.1em] font-display font-semibold">
        Unit · {unit}
      </div>
    </div>
  );
}
