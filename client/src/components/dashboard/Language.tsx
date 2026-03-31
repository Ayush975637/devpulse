import React from "react";
import { Progress } from "@/components/ui/progress";

const Language = ({ language }) => {
  if (!language || language.length === 0) {
    return <p className="text-sm text-muted-foreground">No language data available</p>;
  }

  const total = language.reduce((sum, l) => sum + l.count, 0);

  return (
    <div className="space-y-4">
      {language.map((lang, index) => {
        const percent = (lang.count / total) * 100;

        return (
          <div key={index}>
            <div className="flex justify-between mb-1 text-sm">
              <span>{lang.lang}</span>
              <span>{lang.count} repos</span>
            </div>

            <Progress value={percent} indicatorClassName="bg-yellow-400" className="h-2" />

            <div className="text-xs text-muted-foreground mt-1">
              {Math.round(percent)}%
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Language;