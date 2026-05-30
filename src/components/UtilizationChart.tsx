"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { calculateUtilization } from "@/lib/creditEngine";
import { formatCurrency } from "@/lib/format";

export function UtilizationChart({
  balance,
  limit,
}: {
  balance: number;
  limit: number;
}) {
  const available = Math.max(limit - balance, 0);
  const utilization = calculateUtilization(balance, limit);
  const displayUtilization = Math.round(utilization);
  const chartData = [
    { name: "Current balance", value: balance, fill: "#f59e0b" },
    { name: "Available credit", value: available, fill: "#22c55e" },
  ];

  return (
    <div className="relative min-h-[230px]">
      <ResponsiveContainer width="100%" height={230}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={72}
            outerRadius={98}
            paddingAngle={3}
            stroke="none"
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #d7ded6",
              boxShadow: "0 12px 30px rgba(6, 19, 15, 0.12)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-black text-[#06130f]">
          {displayUtilization}%
        </span>
        <span className="mt-1 text-xs font-semibold uppercase text-slate-500">
          utilization
        </span>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1 text-[10px] font-semibold text-slate-600">
        {[
          ["<10", "bg-emerald-500"],
          ["10-29", "bg-lime-500"],
          ["30-49", "bg-amber-400"],
          ["50-74", "bg-orange-500"],
          ["75+", "bg-rose-500"],
        ].map(([label, color]) => (
          <div key={label} className="min-w-0">
            <div className={`h-1.5 rounded-md ${color}`} />
            <div className="mt-1 truncate text-center">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
