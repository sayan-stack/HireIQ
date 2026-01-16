"use client";

import { useState, useMemo, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useTheme } from "@/contexts/ThemeContext";

/* ---------------- Mock Analytics Data ---------------- */

const DATA_30_DAYS = [
  { name: "Day 1", views: 120, applications: 40 },
  { name: "Day 5", views: 300, applications: 90 },
  { name: "Day 10", views: 520, applications: 180 },
  { name: "Day 15", views: 480, applications: 210 },
  { name: "Day 20", views: 650, applications: 260 },
  { name: "Day 25", views: 720, applications: 300 },
  { name: "Day 30", views: 900, applications: 420 },
];

const DATA_7_DAYS = [
  { name: "Mon", views: 300, applications: 110 },
  { name: "Tue", views: 420, applications: 160 },
  { name: "Wed", views: 380, applications: 150 },
  { name: "Thu", views: 520, applications: 220 },
  { name: "Fri", views: 610, applications: 260 },
  { name: "Sat", views: 570, applications: 240 },
  { name: "Sun", views: 690, applications: 300 },
];

const DATA_24_HOURS = [
  { name: "1h", views: 40, applications: 10 },
  { name: "6h", views: 120, applications: 35 },
  { name: "12h", views: 240, applications: 90 },
  { name: "18h", views: 380, applications: 150 },
  { name: "24h", views: 520, applications: 210 },
];

export default function ChartCard() {
  const [range, setRange] = useState<"30" | "7" | "24">("30");
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);

  // Only render chart on client to prevent SSR dimension issues
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---------------- Data Switch ---------------- */
  const chartData = useMemo(() => {
    if (range === "7") return DATA_7_DAYS;
    if (range === "24") return DATA_24_HOURS;
    return DATA_30_DAYS;
  }, [range]);

  return (
    <div className="xl:col-span-2 rounded-xl p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <h3 className="text-[var(--text-primary)] font-semibold">Views vs Applications</h3>
          <p className="text-[var(--text-tertiary)] text-sm">
            Performance over the last {range}{" "}
            {range === "24" ? "hours" : "days"}
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex gap-2">
          {["30", "7", "24"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r as "30" | "7" | "24")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${range === r
                ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-sm"
                : "text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)]"
                }`}
            >
              {r === "24" ? "24 Hours" : `${r} Days`}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="appsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1f2937" : "#e2e8f0"} />
              <XAxis dataKey="name" stroke={isDark ? "#64748b" : "#94a3b8"} />
              <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#0f172a" : "#ffffff",
                  border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  color: isDark ? "#f1f5f9" : "#1e293b",
                }}
              />

              {/* Views */}
              <Area
                type="monotone"
                dataKey="views"
                stroke="#06b6d4"
                fill="url(#viewsGradient)"
                strokeWidth={2}
              />

              {/* Applications */}
              <Area
                type="monotone"
                dataKey="applications"
                stroke="#22c55e"
                fill="url(#appsGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)]">
            Loading chart...
          </div>
        )}
      </div>
    </div>
  );
}
