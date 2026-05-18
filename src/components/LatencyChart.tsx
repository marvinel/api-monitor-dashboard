"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Check {
  id: string;
  status: number;
  latency: number;
  isUp: boolean;
  checkedAt: string;
}

interface LatencyChartProps {
  checks: Check[];
}

export default function LatencyChart({ checks }: LatencyChartProps) {
  // Reverse so oldest is on the left, newest on the right
  const data = [...checks].reverse().map((check) => ({
    time: new Date(check.checkedAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    latency: check.latency,
    isUp: check.isUp,
  }));

  return (
    <div className="h-full w-full min-h-[10rem] min-w-[1px]">
      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
        <LineChart data={data}>
          <XAxis
            dataKey="time"
            stroke="#6b7280"
            fontSize={11}
            tickLine={false}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={11}
            tickLine={false}
            unit="ms"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#fff",
            }}
            labelStyle={{ color: "#9ca3af" }}
          />
          <Line
            type="monotone"
            dataKey="latency"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#3b82f6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
