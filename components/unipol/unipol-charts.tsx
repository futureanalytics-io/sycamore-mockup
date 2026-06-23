"use client";

/*
 * The five analytics visuals from the Unipol Power BI dashboard, rebuilt with
 * Recharts. Every chart uses a CUSTOM tooltip (DefectHoverCard) so hovering a
 * bar / column / slice surfaces the real survey photos + verbatim observations
 * for that group — not just a number. Clicking a segment opens the full modal.
 */
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent } from "@/components/ui/card";
import { DefectHoverCard } from "@/components/unipol/defect-hovercard";
import { useUnipolStore } from "@/lib/unipol-store";
import {
  PRIORITY_META,
  worksByCategory,
  worksByPriority,
  highRiskByBuilding,
  remedialByBuilding,
  risksByPriorityByBuilding,
  type Defect,
} from "@/lib/unipol-data";
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

const AXIS_TICK = { fontSize: 11, fill: "#404D55", fontFamily: "var(--font-body)" } as const;

interface TipDatum {
  name: string;
  value?: number;
  defects?: Defect[];
}

/* Custom Recharts tooltip → rich hover card with images + observations. */
function ChartTooltip({
  active,
  payload,
  metricLabel,
}: {
  active?: boolean;
  payload?: { payload: TipDatum }[];
  metricLabel?: (d: TipDatum) => string;
}) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  const defects = d.defects ?? [];
  const metric = metricLabel ? metricLabel(d) : d.value != null ? String(d.value) : String(defects.length);
  return <DefectHoverCard title={d.name} defects={defects} metric={metric} />;
}

function groupFrom(entry: unknown): { name: string; defects: Defect[] } | null {
  const e = entry as { name?: string; defects?: Defect[]; payload?: { name?: string; defects?: Defect[] } } | null;
  if (!e) return null;
  const name = e.name ?? e.payload?.name;
  const defects = e.defects ?? e.payload?.defects;
  if (!name || !defects) return null;
  return { name, defects };
}

export function UnipolCharts({ defects }: { defects: Defect[] }) {
  const openGroup = useUnipolStore((s) => s.openGroup);
  const byCategory = worksByCategory(defects);
  const byPriority = worksByPriority(defects);
  const highByBuilding = highRiskByBuilding(defects);
  const remedial = remedialByBuilding(defects);
  const stacked = risksByPriorityByBuilding(defects);

  const onSegmentClick = (entry: unknown) => {
    const g = groupFrom(entry);
    if (g && g.defects.length) openGroup({ title: g.name, defects: g.defects });
  };

  const cursor = { fill: "rgba(17,32,37,0.04)" } as const;
  const tipWrapper = { zIndex: 50, outline: "none" } as const;

  return (
    <div className="space-y-5">
      {/* Row 1 — works by category (qty) + works by priority (donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Total works by scope</CardTitle>
              <CardSubtitle>Quantity of remedial items by work category — hover for evidence</CardSubtitle>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byCategory} layout="vertical" margin={{ top: 4, right: 28, bottom: 4, left: 6 }}>
                  <CartesianGrid stroke="rgba(17,32,37,0.06)" horizontal={false} />
                  <XAxis type="number" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={AXIS_TICK} axisLine={false} tickLine={false} width={92} />
                  <Tooltip
                    content={<ChartTooltip metricLabel={(d) => `${d.value} units`} />}
                    cursor={cursor}
                    wrapperStyle={tipWrapper}
                  />
                  <Bar dataKey="value" radius={[0, 5, 5, 0]} cursor="pointer" onClick={onSegmentClick}>
                    {byCategory.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                    <LabelList
                      dataKey="value"
                      position="right"
                      style={{ fontSize: 11.5, fill: "#404D55", fontFamily: "var(--font-body)", fontWeight: 600 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Works by priority</CardTitle>
              <CardSubtitle>Count of defects by risk band</CardSubtitle>
            </div>
          </CardHeader>
          <CardContent>
            <PriorityDonut defects={defects} data={byPriority} onSlice={onSegmentClick} />
          </CardContent>
        </Card>
      </div>

      {/* Row 2 — high-risk by building + remedial works by building */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>High-risk works by building</CardTitle>
              <CardSubtitle>Count of high-priority defects</CardSubtitle>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={highByBuilding} margin={{ top: 16, right: 12, bottom: 4, left: 0 }}>
                  <CartesianGrid stroke="rgba(17,32,37,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                  <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} cursor={cursor} wrapperStyle={tipWrapper} />
                  <Bar dataKey="value" fill={PRIORITY_META.High.fill} radius={[5, 5, 0, 0]} cursor="pointer" onClick={onSegmentClick}>
                    <LabelList dataKey="value" position="top" style={{ fontSize: 12, fill: "#404D55", fontFamily: "var(--font-body)", fontWeight: 600 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Total remedial works by building</CardTitle>
              <CardSubtitle>Count of defects per building</CardSubtitle>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={remedial} margin={{ top: 16, right: 12, bottom: 4, left: 0 }}>
                  <CartesianGrid stroke="rgba(17,32,37,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                  <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} cursor={cursor} wrapperStyle={tipWrapper} />
                  <Bar dataKey="value" fill="#437496" radius={[5, 5, 0, 0]} cursor="pointer" onClick={onSegmentClick}>
                    <LabelList dataKey="value" position="top" style={{ fontSize: 12, fill: "#404D55", fontFamily: "var(--font-body)", fontWeight: 600 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3 — risks by priority × building (stacked, full width) */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Number of risks by priority</CardTitle>
            <CardSubtitle>Defects per building, stacked by risk band — hover for evidence</CardSubtitle>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stacked} margin={{ top: 16, right: 12, bottom: 4, left: 0 }}>
                <CartesianGrid stroke="rgba(17,32,37,0.06)" vertical={false} />
                <XAxis dataKey="name" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  content={<ChartTooltip metricLabel={(d) => `${(d.defects ?? []).length} defects`} />}
                  cursor={cursor}
                  wrapperStyle={tipWrapper}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-body)", color: "#404D55", paddingTop: 8 }} />
                <Bar dataKey="High" stackId="p" fill={PRIORITY_META.High.fill} cursor="pointer" onClick={onSegmentClick} />
                <Bar dataKey="Medium" stackId="p" fill={PRIORITY_META.Medium.fill} cursor="pointer" onClick={onSegmentClick} />
                <Bar dataKey="Low" stackId="p" fill={PRIORITY_META.Low.fill} radius={[5, 5, 0, 0]} cursor="pointer" onClick={onSegmentClick} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PriorityDonut({
  defects,
  data,
  onSlice,
}: {
  defects: Defect[];
  data: { name: string; value: number; fill: string; defects: Defect[] }[];
  onSlice: (entry: unknown) => void;
}) {
  const total = defects.length;
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-[180px] w-[180px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={2} stroke="none" cursor="pointer" onClick={onSlice}>
              {data.map((d) => (
                <Cell key={d.name} fill={d.fill} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip metricLabel={(d) => `${d.value} defects`} />} wrapperStyle={{ zIndex: 50 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="font-display text-[24px] font-bold tabular-nums leading-none">{total}</div>
          <div className="text-[10px] uppercase tracking-[0.12em] text-[color:var(--color-ink-muted)] mt-1 font-display font-semibold">Defects</div>
        </div>
      </div>
      <div className="flex-1 space-y-2 min-w-0">
        {data.map((d) => (
          <button
            key={d.name}
            type="button"
            onClick={() => onSlice(d)}
            className="w-full flex items-center justify-between gap-2 text-[12.5px] rounded-md px-1.5 py-1 hover:bg-[color:var(--color-cream)] transition-colors"
          >
            <span className="flex items-center gap-2 min-w-0">
              <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: d.fill }} />
              <span className="text-[color:var(--color-ink-strong)] font-medium">{d.name}</span>
            </span>
            <span className="tabular-nums font-display font-semibold text-[color:var(--color-ink-strong)]">{d.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
