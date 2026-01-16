"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", views: 200, applications: 80 },
  { name: "Tue", views: 400, applications: 150 },
  { name: "Wed", views: 600, applications: 300 },
  { name: "Thu", views: 500, applications: 280 },
  { name: "Fri", views: 800, applications: 420 },
  { name: "Sat", views: 700, applications: 390 },
  { name: "Sun", views: 900, applications: 500 },
];

export default function ChartCard() {
  const [range, setRange] = useState("30");
  const [mounted, setMounted] = useState(false);

  // Only render chart on client to prevent SSR dimension issues
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Views vs Applications</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Performance over the last {range}{" "}
            {range === "24" ? "hours" : "days"}
          </p>
        </div>

        <div className="flex gap-2">
          {["30", "7", "24"].map((r) => (
            <button
              key={r}
              onClick={() => {
                console.log("Chart range changed:", r);
                setRange(r);
              }}
              className={`px-3 py-1 rounded-md text-sm ${range === r
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-white/5"
                }`}
            >
              {r === "24" ? "24 Hours" : `${r} Days`}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="views" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#2563eb"
                fill="url(#views)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
            Loading chart...
          </div>
        )}
      </div>
    </div>
  );
}
