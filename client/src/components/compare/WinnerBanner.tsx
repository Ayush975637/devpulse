import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaTrophy } from "react-icons/fa";

const WinnerBanner = ({ user1, user2 }) => {
  if (!user1 || !user2) return null;

  const score1 = user1?.stats?.devScore?.overall ?? 0;
  const score2 = user2?.stats?.devScore?.overall ?? 0;

  let winner = null;
  let text = "";

  if (score1 > score2) {
    winner = user1;
    text = `${user1.profile.username} wins`;
  } else if (score2 > score1) {
    winner = user2;
    text = `${user2.profile.username} wins`;
  } else {
    text = "It's a tie!";
  }

  return (
    <Card className="mx-4 mt-4 shadow-md border m-10">
      <CardContent className="flex flex-col md:flex-row items-center justify-around gap-4 p-6">

        {/* Left: Text */}
        <div className="text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 justify-center md:justify-start">
            <FaTrophy className="text-yellow-400" />
            {text}
          </h2>

          {winner && (
            <p className="text-muted-foreground mt-1">
              Score:{" "}
              <span className="font-semibold text-foreground">
                {winner.stats.devScore.overall}
              </span>
            </p>
          )}

          {!winner && (
            <p className="text-muted-foreground mt-1">
              Both scored {score1}
            </p>
          )}
        </div>

        {/* Right: Users */}
        <div className="flex items-center gap-6">

          {/* User 1 */}
          <div className="flex flex-col items-center">
            <img
              src={user1?.profile?.avatar_url}
              alt="u1"
              className="w-14 h-14 rounded-full border"
            />
            <p className="text-sm mt-1">@{user1?.profile?.username}</p>

            {score1 > score2 && (
              <Badge className="mt-1 bg-yellow-500">Winner</Badge>
            )}
            {
                score1 === score2 && (
                    <Badge className="mt-1 bg-green-400">Tie</Badge>
                )
            }
            {score1<score2&&(
                <Badge className="mt-1 bg-red-500">Loser</Badge>
            )}

          </div>

          <span className="text-muted-foreground font-semibold">VS</span>

          {/* User 2 */}
          <div className="flex flex-col items-center">
            <img
              src={user2?.profile?.avatar_url}
              alt="u2"
              className="w-14 h-14 rounded-full border"
            />
            <p className="text-sm mt-1">@{user2?.profile?.username}</p>

            {score2 > score1 && (
              <Badge className="mt-1 bg-yellow-500">Winner</Badge>
            )}
            {
                score1 === score2 && (
                    <Badge className="mt-1 bg-green-500">Tie</Badge>
                )
            }
            {score1>score2&&(
                <Badge className="mt-1 bg-red-500">Loser</Badge>
            )}
           
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

export default WinnerBanner;