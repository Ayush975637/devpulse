import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { FaGithub, FaFire, FaRocket } from "react-icons/fa";
import { FaCrown, FaLeaf, FaSeedling } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";

const badgeConfig = {
  Elite: { color: "text-yellow-400", icon: <FaCrown /> },
  Pro: { color: "text-purple-400", icon: <FaFire /> },
  "Rising Dev": { color: "text-blue-400", icon: <FaRocket /> },
  Intermediate: { color: "text-green-400", icon: <FaLeaf /> },
  Beginner: { color: "text-gray-400", icon: <FaSeedling /> },
};

const CompareHeader = ({ user1, user2 }) => {
  if (!user1 || !user2) return null;

  const score1 = user1?.stats?.devScore?.overall ?? 0;
  const score2 = user2?.stats?.devScore?.overall ?? 0;

  const winner =
    score1 > score2 ? user1 : score2 > score1 ? user2 : null;

  const getColor = (user) => {
    if (!winner) return "text-muted-foreground";
    return winner.profile.username === user.profile.username
      ? "text-yellow-400"
      : "text-red-400";
  };

  const badge1 =
    badgeConfig[user1?.stats?.devScore?.label] || badgeConfig["Beginner"];
  const badge2 =
    badgeConfig[user2?.stats?.devScore?.label] || badgeConfig["Beginner"];

  const UserCard = ({ user, badge, isWinner }) => (
    <Card className="flex-1 shadow-sm">
      <CardContent className="p-4 flex flex-col items-center text-center space-y-3">

        {/* Avatar */}
        <img
          src={user.profile.avatar_url}
          alt="avatar"
          className={`w-16 h-16 rounded-full border-2 ${
            isWinner ? "border-yellow-400" : "border-border"
          }`}
        />

        {/* Name */}
        <h2 className="font-semibold text-lg">
          {user?.profile?.name || user?.profile?.username}
        </h2>

        {/* Username */}
        <p className="text-sm text-muted-foreground">
          @{user?.profile?.username}
        </p>

        {/* DevScore */}
        <div className={`text-3xl font-bold ${getColor(user)}`}>
          {isWinner && "🏆 "}
          {!isWinner && winner && "🥈 "}
          {user?.stats?.devScore?.overall}
        </div>

        {/* Badge */}
        <div className={`flex items-center gap-2 ${badge.color}`}>
          {badge.icon}
          <span className="text-sm font-medium">
            {user?.stats?.devScore?.label}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm w-full mt-2">
          <div>👥 {user?.profile?.followers}</div>
          <div>📦 {user?.profile?.public_repos}</div>
          <div>⭐ {user?.stats?.totalStars}</div>
          <div>⚡ {user?.stats?.totalCommits}</div>
        </div>

        {/* GitHub link */}
        <a
          href={`https://github.com/${user?.profile?.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-blue-500 hover:underline text-sm mt-2"
        >
          <FaGithub />
          <span>Profile</span>
          <FiExternalLink size={12} />
        </a>

        {/* Winner / Loser badge */}
        {winner && (
          <Badge
            className={`mt-2 ${
              isWinner
                ? "bg-yellow-500 text-black"
                : "bg-red-500 text-white"
            }`}
          >
            {isWinner ? "Winner 🏆" : "Runner-up"}
          </Badge>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-6 px-4 max-w-5xl mx-auto">
      
      <UserCard
        user={user1}
        badge={badge1}
        isWinner={winner?.profile?.username === user1?.profile?.username}
      />

      {/* VS */}
      <div className="flex items-center justify-center text-muted-foreground font-semibold">
        VS
      </div>

      <UserCard
        user={user2}
        badge={badge2}
        isWinner={winner?.profile?.username === user2?.profile?.username}
      />
    </div>
  );
};

export default CompareHeader;