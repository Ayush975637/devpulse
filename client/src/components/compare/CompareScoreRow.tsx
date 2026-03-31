import { Progress } from "@/components/ui/progress";
import React from "react";

const CompareScoreRow = ({ user1, user2 }) => {
    if(!user1?.stats?.devScore || !user2?.stats?.devScore) {
        return <div className="text-center text-red-500 mt-10">DevScore data not available for one or both users.</div>;
    }
  const breakdown1 = user1?.stats?.devScore?.breakdown || {};
  const breakdown2 = user2?.stats?.devScore?.breakdown || {};

  const getColor = (winner, side) => {
    if (winner === "equal") return "bg-gray-400";

    if (winner === "user1") {
      return side === "user1" ? "bg-yellow-400" : "bg-red-400";
    }

    if (winner === "user2") {
      return side === "user2" ? "bg-yellow-400" : "bg-red-400";
    }
  };

  return (

 <div className="border rounded-lg m-4 p-5">
<p className='text-md md:text-lg text-center mb-4 font-bold text-orange-300 '>Compare Score</p>
    {/* headers — outside the grid, full width */}
    <div className="grid grid-cols-2 gap-8 mb-4">

      
      <p className="text-md md:text-lg font-semibold text-center text-blue-600">
        {user1?.profile?.name || user1?.profile?.username}
      </p>
      <p className="text-md md:text-lg font-semibold text-center text-pink-400">
        {user2?.profile?.name || user2?.profile?.username}
      </p>
    </div>





    <div className="grid grid-cols-2 gap-8  ">
      
      {Object.keys(breakdown1).map((key) => {
        const v1 = breakdown1[key] || 0;
        const v2 = breakdown2[key] || 0;
        const u1=user1?.profile?.name||user1?.profile?.username;
        const u2=user1?.profile?.name||user1?.profile?.username;

        let winner = "equal";
        if (v1 > v2) winner = "user1";
        else if (v2 > v1) winner = "user2";

        return (
          <React.Fragment key={key}>
         
            {/* LEFT USER */}
            <div>
        
              <div className="flex justify-between text-sm mb-1 capitalize">
                <span>{key}</span>
                <span>{v1}</span>
              
              </div>
              <Progress
                value={v1}
                indicatorClassName={`h-3 ${getColor(winner, "user1")}`}
              />
            </div>

            {/* RIGHT USER */}
    
            <div>
         
              <div className="flex justify-between text-sm mb-1 capitalize">
                <span>{key}</span>
                <span>{v2}</span>
              </div>
              <Progress
                value={v2}
                indicatorClassName={`h-3 ${getColor(winner, "user2")}`}
              />
            </div>

          </React.Fragment>
        );
      })}
    </div>
    </div>
  );
};

export default CompareScoreRow;