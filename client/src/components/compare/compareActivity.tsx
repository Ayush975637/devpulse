
import React from 'react'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const CompareActivity = ({weeklyCommits1, weeklyCommits2,name1,name2}) => {
    if (!weeklyCommits1 || !weeklyCommits2) return null;
    const data1 = weeklyCommits1.map((value, index) => ({
    week: `W${index + 1}`,
    commits: value,
  }));
  const data2 = weeklyCommits2.map((value, index) => ({
    week: `W${index + 1}`,
    commits: value,
  }));
  const allZero1 = weeklyCommits1.every((v) => v === 0);
    const allZero2 = weeklyCommits2.every((v) => v === 0);
  return (

    <div className="mt-6 border rounded-lg m-4 p-5">
      <p className='text-md md:text-lg text-center mb-3 mt-4 font-bold text-orange-300 '>Compare Activity</p>
    
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      {/* left */}
      <section >
        <p className='text-md md:text-xl font-bold text-green-500'>{name1}</p> 
<div className="w-full h-64">

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data1} margin={{ top: 4, right: 8, left: -25, bottom: 0 }}>
          
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
            stroke="#3bf641"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {allZero1 && (
        <p className="text-center text-sm text-muted-foreground mt-2">
          No public commit activity in last year
        </p>
      )}
    </div>


      </section>


      {/* right */}
      <section >
        <p className='text-md md:text-xl font-bold text-pink-500'>{name2}</p> 
<div className="w-full h-64">

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data2} margin={{ top: 4, right: 8, left: -25, bottom: 0 }}>
          
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
            stroke="#db20ac"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {allZero2 && (
        <p className="text-center text-sm text-muted-foreground mt-2">
          No public commit activity in last year
        </p>
      )}
    </div>

      </section>
    </div>
    </div>
  )
}

export default CompareActivity
