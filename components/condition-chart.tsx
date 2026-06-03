"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from "recharts";
import type { Building } from "@/lib/types";

interface ConditionChartProps {
  building: Building;
}

export function ConditionChart({ building }: ConditionChartProps) {
  const red = building.sections.filter((s) => s.rag === "red").length;
  const amber = building.sections.filter((s) => s.rag === "amber").length;
  const green = building.sections.filter((s) => s.rag === "green").length;

  const data = [
    { name: "Red", count: red, fill: "#E24B4A" },
    { name: "Amber", count: amber, fill: "#EF9F27" },
    { name: "Green", count: green, fill: "#97C459" },
  ];

  const max = Math.max(red, amber, green, 1);

  return (
    <div className="h-[110px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 30, bottom: 4, left: 0 }}
          barCategoryGap={6}
        >
          <XAxis type="number" domain={[0, max]} hide />
          <YAxis
            type="category"
            dataKey="name"
            width={52}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#6b6b66", fontFamily: "var(--font-body)" }}
          />
          <Bar dataKey="count" radius={[2, 2, 2, 2]} maxBarSize={16}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.fill} />
            ))}
            <LabelList
              dataKey="count"
              position="right"
              style={{ fontSize: 11, fill: "#1a1a1a", fontFamily: "var(--font-body)" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
