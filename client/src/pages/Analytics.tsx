

// import Navbar from "@/components/ui/navbar";
// import { useState } from "react";

// import {
//   InputGroup,
//   InputGroupAddon,
//   InputGroupButton,
//   InputGroupInput,
// } from "@/components/ui/input-group";

// import { Spinner } from "@/components/ui/spinner";
// import { useGrowth } from "@/hooks/usegrowth";

// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   LineChart,
//   Line,
//   RadarChart,
//   Radar,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   XAxis,
//   YAxis,
// } from "recharts";
// import { MoveDownRight, MoveUpRight } from "lucide-react";



// const cardStyle =
//   "rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm";

// const Analytics = () => {
//   const [input, setInput] = useState("");

//   const { data, loading, error, fetchGrowth } = useGrowth();

//   const handleSearch = async () => {
//     if (!input.trim()) return;
//     await fetchGrowth(input.trim());
//   };









//   const chartData =
//     data?.growth?.map((item) => ({
//       date: new Date(item.snapshotDate).toLocaleDateString(),

//       overall: item.overallScore,

//       stars: item.totalStars,
//       forks: item.totalForks,
//       watchers: item.totalWatches,
//       followers: item.followers,
//       repos: item.totalRepos,

//       commits: item.totalCommits,
//       contributions: item.totalContributionsYear,
//       streak: item.currentStreakDays,

//       consistency: item.consistencyScore,
//       impact: item.impactScore,
//       activity: item.activityScore,
//       reach: item.reachScore,
//       repository: item.repositoryScore,
//       diversity: item.diversityScore,
//     })) || [];

//   const latest =
//     chartData.length > 0
//       ? chartData[chartData.length - 1]
//       : null;

  









//   const radarData = latest
//     ? [
//         {
//           subject: "Consistency",
//           value: latest.consistency,
//         },
//         {
//           subject: "Impact",
//           value: latest.impact,
//         },
//         {
//           subject: "Activity",
//           value: latest.activity,
//         },
//         {
//           subject: "Reach",
//           value: latest.reach,
//         },
//         {
//           subject: "Repository",
//           value: latest.repository,
//         },
//         {
//           subject: "Diversity",
//           value: latest.diversity,
//         },
//       ]
//     : [];

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="max-w-7xl mx-auto px-6 py-10">

//         <div className="text-center space-y-2">

//           <h1 className="text-4xl font-bold">
//             Growth Analytics 📈
//           </h1>

//           <p className="text-muted-foreground">
//             Analyze GitHub growth using historical snapshots.
//           </p>

//         </div>

//         <div className="max-w-xl mx-auto mt-10">

//           <InputGroup>

//             <InputGroupInput
//               placeholder="Enter GitHub Username..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) =>
//                 e.key === "Enter" && handleSearch()
//               }
//             />

//             <InputGroupAddon align="inline-end">

//               {loading ? (
//                 <Spinner />
//               ) : (
//                 <InputGroupButton
//                   onClick={handleSearch}
//                 >
//                   Search
//                 </InputGroupButton>
//               )}

//             </InputGroupAddon>

//           </InputGroup>

//           {error && (
//             <p className="text-red-500 text-center mt-3">
//               {error}
//             </p>
//           )}

//         </div>

//         {chartData.length > 0 && (
//         <div>

//             {/* SUMMARY CARDS */}

//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mt-12">

//               <div className={cardStyle}>
//                 <p className="text-sm text-muted-foreground">
//                   DevScore
//                 </p>
//                 <h2 className="text-3xl font-bold mt-2">
//                   {latest.overall.toFixed(0)}
//                 </h2>
//               </div>

//               <div className={cardStyle}>
//                 <p className="text-sm text-muted-foreground">
//                   Stars
//                 </p>
//                 <h2 className="text-3xl font-bold mt-2">
//                   {latest.stars}
//                 </h2>
//               </div>

//               <div className={cardStyle}>
//                 <p className="text-sm text-muted-foreground">
//                   Followers
//                 </p>
//                 <h2 className="text-3xl font-bold mt-2">
//                   {latest.followers}
//                 </h2>
//               </div>

//               <div className={cardStyle}>
//                 <p className="text-sm text-muted-foreground">
//                   Repositories
//                 </p>
//                 <h2 className="text-3xl font-bold mt-2">
//                   {latest.repos}
//                 </h2>
//               </div>

//               <div className={cardStyle}>
//                 <p className="text-sm text-muted-foreground">
//                   Commits
//                 </p>
//                 <h2 className="text-3xl font-bold mt-2">
//                   {latest.commits}
//                 </h2>
//               </div>

//               <div className={cardStyle}>
//                 <p className="text-sm text-muted-foreground">
//                   Current Streak
//                 </p>
//                 <h2 className="text-3xl font-bold mt-2">
//                   {latest.streak}
//                 </h2>
//               </div>

//             </div>

            


//                           {/* Overall DevScore */}

//               <section className={cardStyle}>
//                 <h2 className="text-2xl font-semibold mb-6">
//                   Overall DevScore 📈
//                 </h2>

//                 <ResponsiveContainer width="100%" height={400}>
//                   <AreaChart data={chartData}>
//                     <defs>
//                       <linearGradient id="overallGradient" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
//                         <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
//                       </linearGradient>
//                     </defs>

//                     <CartesianGrid strokeDasharray="3 3" />

//                     <XAxis dataKey="date" />

//                     <YAxis />

//                     <Tooltip />

//                     <Area
//                       type="monotone"
//                       dataKey="overall"
//                       stroke="#3b82f6"
//                       fill="url(#overallGradient)"
//                       strokeWidth={3}
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </section>

//               {/* GitHub Statistics */}

//               <section className={cardStyle}>
//                 <h2 className="text-2xl font-semibold mb-6">
//                   GitHub Growth 📊
//                 </h2>

//                 <ResponsiveContainer width="100%" height={420}>
//                   <LineChart data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" />

//                     <XAxis dataKey="date" />

//                     <YAxis />

//                     <Tooltip />

//                     <Legend />

//                     <Line
//                       type="monotone"
//                       dataKey="stars"
//                       stroke="#facc15"
//                       strokeWidth={2}
//                     />

//                     <Line
//                       type="monotone"
//                       dataKey="followers"
//                       stroke="#22c55e"
//                       strokeWidth={2}
//                     />

//                     <Line
//                       type="monotone"
//                       dataKey="repos"
//                       stroke="#3b82f6"
//                       strokeWidth={2}
//                     />

//                     <Line
//                       type="monotone"
//                       dataKey="forks"
//                       stroke="#ef4444"
//                       strokeWidth={2}
//                     />

//                     <Line
//                       type="monotone"
//                       dataKey="watchers"
//                       stroke="#a855f7"
//                       strokeWidth={2}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </section>

//               {/* Two charts */}

//               <div className="grid lg:grid-cols-2 gap-8">

//                 {/* Contribution History */}

//                 <section className={cardStyle}>
//                   <h2 className="text-2xl font-semibold mb-6">
//                     Contribution History 🔥
//                   </h2>

//                   <ResponsiveContainer width="100%" height={350}>
//                     <AreaChart data={chartData}>
//                       <defs>
//                         <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
//                           <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
//                         </linearGradient>
//                       </defs>

//                       <CartesianGrid strokeDasharray="3 3" />

//                       <XAxis dataKey="date" />

//                       <YAxis />

//                       <Tooltip />

//                       <Area
//                         type="monotone"
//                         dataKey="commits"
//                         stroke="#10b981"
//                         fill="url(#commitGradient)"
//                         strokeWidth={3}
//                       />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </section>

//                 {/* Radar */}

//                 <section className={cardStyle}>
//                   <h2 className="text-2xl font-semibold mb-6">
//                     CodeVex Score Breakdown ⭐
//                   </h2>

//                   <ResponsiveContainer width="100%" height={350}>
//                     <RadarChart data={radarData}>
//                       <PolarGrid />

//                       <PolarAngleAxis dataKey="subject" />

//                       <PolarRadiusAxis
//                         domain={[0, 100]}
//                       />

//                       <Radar
//                         dataKey="value"
//                         stroke="#6366f1"
//                         fill="#6366f1"
//                         fillOpacity={0.55}
//                       />

//                       <Tooltip />
//                     </RadarChart>
//                   </ResponsiveContainer>
//                 </section>

//               </div>

//               {/* Growth Trends */}

//               <section className={cardStyle}>
//                 <h2 className="text-2xl font-semibold mb-6">
//                   CodeVex Metrics Growth 📊
//                 </h2>

//                 <ResponsiveContainer width="100%" height={420}>
//                   <LineChart data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" />

//                     <XAxis dataKey="date" />

//                     <YAxis domain={[0, 100]} />

//                     <Tooltip />

//                     <Legend />

//                     <Line dataKey="consistency" stroke="#22c55e" />

//                     <Line dataKey="impact" stroke="#ef4444" />

//                     <Line dataKey="activity" stroke="#3b82f6" />

//                     <Line dataKey="reach" stroke="#eab308" />

//                     <Line dataKey="repository" stroke="#8b5cf6" />

//                     <Line dataKey="diversity" stroke="#ec4899" />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </section>


// </div>
//            )}
        

//         {!loading && chartData.length === 0 && !error && (
//           <div className="mt-20">

//             <div className="max-w-2xl mx-auto rounded-xl border border-dashed border-zinc-700 p-12 text-center">

//               <h2 className="text-3xl font-bold mb-3">
//                 📈 Analytics Dashboard
//               </h2>

//               <p className="text-muted-foreground text-lg">
//                 Search for a GitHub username to view historical growth,
//                 DevScore trends, repository statistics, contribution history,
//                 and CodeVex analytics.
//               </p>

//             </div>

//           </div>
//                )}
//       </div>
//     </div>
//   );
// };

// export default Analytics;



import Navbar from "@/components/ui/navbar";
import { useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

import { Spinner } from "@/components/ui/spinner";
import { useGrowth } from "@/hooks/usegrowth";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
} from "recharts";
import { MoveDownRight, MoveUpRight } from "lucide-react";

const cardStyle =
  "rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5 shadow-sm";

// Recharts tick font sizes scale down on mobile via a shared prop object.
const axisTick = { fontSize: 11 };

const Analytics = () => {
  const [input, setInput] = useState("");

  const { data, loading, error, fetchGrowth } = useGrowth();

  const handleSearch = async () => {
    if (!input.trim()) return;
    await fetchGrowth(input.trim());
  };

  const chartData =
    data?.growth?.map((item) => ({
      date: new Date(item.snapshotDate).toLocaleDateString(),

      overall: item.overallScore,

      stars: item.totalStars,
      forks: item.totalForks,
      watchers: item.totalWatches,
      followers: item.followers,
      repos: item.totalRepos,

      commits: item.totalCommits,
      contributions: item.totalContributionsYear,
      streak: item.currentStreakDays,

      consistency: item.consistencyScore,
      impact: item.impactScore,
      activity: item.activityScore,
      reach: item.reachScore,
      repository: item.repositoryScore,
      diversity: item.diversityScore,
    })) || [];

  const latest =
    chartData.length > 0 ? chartData[chartData.length - 1] : null;

  const radarData = latest
    ? [
        { subject: "Consistency", value: latest.consistency },
        { subject: "Impact", value: latest.impact },
        { subject: "Activity", value: latest.activity },
        { subject: "Reach", value: latest.reach },
        { subject: "Repository", value: latest.repository },
        { subject: "Diversity", value: latest.diversity },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Growth Analytics 📈
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base px-2">
            Analyze GitHub growth using historical snapshots.
          </p>
        </div>

        <div className="w-full max-w-xl mx-auto mt-6 sm:mt-10 px-2 sm:px-0">
          <InputGroup>
            <InputGroupInput
              placeholder="Enter GitHub Username..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />

            <InputGroupAddon align="inline-end">
              {loading ? (
                <Spinner />
              ) : (
                <InputGroupButton onClick={handleSearch}>
                  Search
                </InputGroupButton>
              )}
            </InputGroupAddon>
          </InputGroup>

          {error && (
            <p className="text-red-500 text-center mt-3 text-sm sm:text-base">
              {error}
            </p>
          )}
        </div>

        {chartData.length > 0 && (
          <div className="space-y-6 sm:space-y-8 mt-8 sm:mt-12">
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5">
              <div className={cardStyle}>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  DevScore
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2">
                  {latest.overall.toFixed(0)}
                </h2>
              </div>

              <div className={cardStyle}>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Stars
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2">
                  {latest.stars}
                </h2>
              </div>

              <div className={cardStyle}>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Followers
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2">
                  {latest.followers}
                </h2>
              </div>

              <div className={cardStyle}>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Repositories
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2">
                  {latest.repos}
                </h2>
              </div>

              <div className={cardStyle}>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Commits
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2">
                  {latest.commits}
                </h2>
              </div>

              <div className={cardStyle}>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Current Streak
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2">
                  {latest.streak}
                </h2>
              </div>
            </div>

            {/* Overall DevScore */}
            <section className={cardStyle}>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6">
                Overall DevScore 📈
              </h2>

              <div className="h-[260px] sm:h-[340px] md:h-[400px] -ml-4 sm:ml-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="overallGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={axisTick} />
                    <YAxis tick={axisTick} width={32} />
                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="overall"
                      stroke="#3b82f6"
                      fill="url(#overallGradient)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* GitHub Statistics */}
            <section className={cardStyle}>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6">
                GitHub Growth 📊
              </h2>

              <div className="h-[280px] sm:h-[360px] md:h-[420px] -ml-4 sm:ml-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={axisTick} />
                    <YAxis tick={axisTick} width={32} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />

                    <Line type="monotone" dataKey="stars" stroke="#facc15" strokeWidth={2} />
                    <Line type="monotone" dataKey="followers" stroke="#22c55e" strokeWidth={2} />
                    <Line type="monotone" dataKey="repos" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="forks" stroke="#ef4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="watchers" stroke="#a855f7" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Two charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Contribution History */}
              <section className={cardStyle}>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6">
                  Contribution History 🔥
                </h2>

                <div className="h-[240px] sm:h-[300px] md:h-[350px] -ml-4 sm:ml-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="commitGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={axisTick} />
                      <YAxis tick={axisTick} width={32} />
                      <Tooltip />

                      <Area
                        type="monotone"
                        dataKey="commits"
                        stroke="#10b981"
                        fill="url(#commitGradient)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Radar */}
              <section className={cardStyle}>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6">
                  CodeVex Score Breakdown ⭐
                </h2>

                <div className="h-[240px] sm:h-[300px] md:h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={axisTick} />
                      <PolarRadiusAxis domain={[0, 100]} tick={axisTick} />

                      <Radar
                        dataKey="value"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.55}
                      />

                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>

            {/* Growth Trends */}
            <section className={cardStyle}>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6">
                CodeVex Metrics Growth 📊
              </h2>

              <div className="h-[280px] sm:h-[360px] md:h-[420px] -ml-4 sm:ml-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={axisTick} />
                    <YAxis domain={[0, 100]} tick={axisTick} width={32} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />

                    <Line dataKey="consistency" stroke="#22c55e" />
                    <Line dataKey="impact" stroke="#ef4444" />
                    <Line dataKey="activity" stroke="#3b82f6" />
                    <Line dataKey="reach" stroke="#eab308" />
                    <Line dataKey="repository" stroke="#8b5cf6" />
                    <Line dataKey="diversity" stroke="#ec4899" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        )}

        {!loading && chartData.length === 0 && !error && (
          <div className="mt-12 sm:mt-20 px-2">
            <div className="max-w-2xl mx-auto rounded-xl border border-dashed border-zinc-700 p-6 sm:p-12 text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">
                📈 Analytics Dashboard
              </h2>

              <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
                Search for a GitHub username to view historical growth,
                DevScore trends, repository statistics, contribution history,
                and CodeVex analytics.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;