
import React from "react";
import { FaCrown, FaFire, FaRocket, FaLeaf, FaSeedling } from "react-icons/fa";
import { Progress } from "@/components/ui/progress";

const badgeConfig = {
  Elite: { color: "text-yellow-400", icon: <FaCrown /> },
  Pro: { color: "text-purple-400", icon: <FaFire /> },
  "Rising Dev": { color: "text-blue-400", icon: <FaRocket /> },
  Intermediate: { color: "text-green-400", icon: <FaLeaf /> },
  Beginner: { color: "text-gray-400", icon: <FaSeedling /> },
};

const DevScore = ({ devScore }) => {
  if (!devScore) return null;

  const badge = badgeConfig[devScore.label] || badgeConfig["Beginner"];

  return (
    <div className="space-y-6">

      {/* Score */}
      <div className="text-center">
        <p className="text-5xl font-bold">{devScore.overall}/1000</p>

        <div className={`flex justify-center items-center gap-2 mt-2 ${badge.color}`}>
          {badge.icon}
          <span className="font-semibold">{devScore.label}</span>
        </div>

        <p className="text-sm text-muted-foreground mt-2">
          Top {devScore.percentile}% of developers
        </p>
      </div>

      {/* Breakdown */}
      <div className="space-y-4">
        {Object.entries(devScore?.breakdown).map(([key, value]) => (


          <div key={key}>
            
            {/* Label + value */}
            <div className="flex justify-between text-sm mb-1 capitalize">
              <span>{key}</span>
              <span>{value as number}</span>
            </div>

            {/* Progress bar */}
            <Progress value={value as number} indicatorClassName="bg-red-500" className="h-2 md:h-4 " />
          </div>

           ))}
      </div>

    </div>
  );
};

export default DevScore;