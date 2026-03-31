import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const formatNumber = (num) => {
  if (num === 0) return "0";
  if (!num) return "-";

  if (num < 1000) return num;
  if (num < 1000000) return (num / 1000).toFixed(1) + "k";
  return (num / 1000000).toFixed(1) + "M";
};

const StatsRow = ({ stats }) => {
  if (!stats) return null;

  const data = [
    {
      label: "Stars",
      value: formatNumber(stats.totalStars),
    },
    {
      label: "Commits",
      value: formatNumber(stats.totalCommits),
    },
    {
      label: "Forks",
      value: formatNumber(stats.totalForks),
    },
    {
      label: "Most Active Day",
      value:
        stats.mostActiveDay === "N/A"
          ? "Not enough data"
          : stats.mostActiveDay,
    },

    {
        label:"Most Active Month",
        value: stats?.mostActiveMonth,

    },
    {
        label:"Current Streak",
        value:stats?.currentStreakDays
    },{
         label:"Longest Streak",
        value:stats?.longestStreakDays
    },{
        label:"Total contribution Year",
        value:stats?.totalContributionsYear
    },{
        label:"Total active days",
        value:stats?.activeDaysCount
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {data.map((item, index) => (
        <Card
          key={index}
          className="text-center p-4 hover:shadow-md transition"
        >
          <CardHeader className="p-0">
            <CardTitle className="text-2xl font-bold">
              {item.value}
            </CardTitle>
            <CardDescription className="text-sm">
              {item.label}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default StatsRow;