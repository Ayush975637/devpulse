// import React from 'react'

// const CompareGap = ({user1,user2}) => {
// if(!user1||!user2) return null;
// const winner=()=>{

// return user1.stats.devScore.overall>user2.stats.devScore.overall?user1:user2;

// }
// const loser=()=>{

// return user1.stats.devScore.overall<user2.stats.devScore.overall?user1:user2;
// }
// const gap=Math.abs(user1.stats.devScore.overall-user2.stats.devScore.overall);


//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4 p-5">Gap Analysis</h2>
//       <p>The overall gap between {winner()?.profile?.name } and {loser()?.profile?.name || "User 2"} is {gap}.</p>
//        {/* consistency */}
//          <p className='mt-4'>Consistency Gap: {Math.abs(user1.stats.devScore.breakdown.consistency - user2.stats.devScore.breakdown.consistency)>20 ? Math.abs(user1.stats.devScore.breakdown.consistency - user2.stats.devScore.breakdown.consistency) : null} so {loser()?.profile?.name || "User 2"} have to work on their consistency.</p>
// {/* Impact */}

// <p className='mt-4'>Impact Gap: {Math.abs(user1.stats.devScore.breakdown.impact - user2.stats.devScore.breakdown.impact)>20 ? Math.abs(user1.stats.devScore.breakdown.impact - user2.stats.devScore.breakdown.impact) : null} so {loser()?.profile?.name || "User 2"} have build higher impact projects.</p>




// {/* Diversity */}
// <p className='mt-4'>Diversity Gap: {Math.abs(user1.stats.devScore.breakdown.diversity - user2.stats.devScore.breakdown.diversity)>20 ? Math.abs(user1.stats.devScore.breakdown.diversity - user2.stats.devScore.breakdown.diversity) : null} so {loser()?.profile?.name || "User 2"} should try contributing to different languages and domains.</p>

// {/* Activity */}
// <p className='mt-4'>Activity Gap: {Math.abs(user1.stats.devScore.breakdown.activity - user2.stats.devScore.breakdown.activity)>20 ? Math.abs(user1.stats.devScore.breakdown.activity - user2.stats.devScore.breakdown.activity) : null} so {loser()?.profile?.name || "User 2"} have to be more active.</p>

// {/* RepoScore */}
// <p className='mt-4'>Repo Score Gap: {Math.abs(user1.stats.devScore.breakdown.repoScore - user2.stats.devScore.breakdown.repoScore)>20 ? Math.abs(user1.stats.devScore.breakdown.repoScore - user2.stats.devScore.breakdown.repoScore) : null} so {loser()?.profile?.name || "User 2"} should try building more high quality repos.</p>
// {/* Reach */}
//        <p className='mt-4'>Reach Gap: {Math.abs(user1.stats.devScore.breakdown.reach - user2.stats.devScore.breakdown.reach)>20 ? Math.abs(user1.stats.devScore.breakdown.reach - user2.stats.devScore.breakdown.reach) : null} so {loser()?.profile?.name || "User 2"} should try to increase their followers and engagement.</p>







//     </div>
//   )
// }

// export default CompareGap
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CompareGap = ({ user1, user2 }) => {
  if (!user1 || !user2) return null;

  const u1 = user1.stats.devScore;
  const u2 = user2.stats.devScore;

  const winner =
    u1.overall > u2.overall ? user1 : user2;

  const loser =
    u1.overall < u2.overall ? user1 : user2;

  const gap = Math.abs(u1.overall - u2.overall);

  const breakdownKeys = [
    { key: "consistency", msg: "needs to improve consistency" },
    { key: "impact", msg: "should build higher impact projects" },
    { key: "diversity", msg: "should explore more languages & domains" },
    { key: "activity", msg: "needs to be more active" },
    { key: "repoScore", msg: "should build higher quality repositories" },
    { key: "reach", msg: "should increase followers & engagement" },
  ];

  return (
    <Card className="p-6 m-3 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold">Gap Analysis</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Difference between developers
        </p>
      </div>

      {/* Overall */}
      <CardContent className="bg-muted rounded-lg p-4 text-center">
        <p className="text-lg">
          <span className="font-semibold">{winner?.profile?.name}</span>
          {" "}leads by{" "}
          <span className="font-bold text-primary">{gap}</span> points
        </p>

        <Badge className="mt-2 bg-green-500/10 text-green-500">
          Winner
        </Badge>
      </CardContent>

      {/* Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {breakdownKeys.map(({ key, msg }) => {
          const diff = Math.abs(u1.breakdown[key] - u2.breakdown[key]);

          if (diff < 20) return null; // skip small gaps

          return (
            <Card
              key={key}
              className="p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="capitalize font-medium">{key}</p>
                <Badge variant="outline" className="text-red-500 font-bold text-lg">{diff}</Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                <span className="font-medium">
                  {loser?.profile?.name}
                </span>{" "}
                {msg}
              </p>
            </Card>
          );
        })}
      </div>

    </Card>
  );
};

export default CompareGap;