import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ActivityChart = ({ weeklyCommits }) => {
  if (!weeklyCommits) return null;

  const data = weeklyCommits.map((value, index) => ({
    week: `W${index + 1}`,
    commits: value,
  }));

  const allZero = weeklyCommits.every((v) => v === 0);

  return (
    <div className="w-80 md:w-full h-64 md:h-70">

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, left: -25, bottom: 0 }}>
          
          <XAxis
            dataKey="week"
            tick={{ fontSize: 10 }}
            interval={5}   // show every 4th label
          />

          <YAxis />

          <Tooltip
            formatter={(value) => [`${value} commits`, "Commits"]}
            labelFormatter={(label) => `Week: ${label}`}
          />

          <Line
            type="monotone"
            dataKey="commits"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {allZero && (
        <p className="text-center text-sm text-muted-foreground mt-2">
          No public commit activity in last year
        </p>
      )}
    </div>
  );
};

export default ActivityChart;
