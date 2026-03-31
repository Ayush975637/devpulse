import React from "react";
import { FaGithub } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profilecard = ({ profile }) => {
  if (!profile) return null;

  const name = profile.name || profile.username;
  const initial = profile.username?.[0]?.toUpperCase() || "U";

  return (
    <div className="flex flex-col items-center text-center space-y-4">

      {/* Avatar */}
      <Avatar className="w-20 h-20">
        <AvatarImage src={profile.avatar_url} />
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>

      {/* Name */}
      <h2 className="text-xl font-semibold">
        {name}
      </h2>

      {/* Username */}
      <p className="text-sm text-muted-foreground">
        @{profile.username}
      </p>

      {/* Bio (conditional) */}
      {profile.bio && (
        <p className="text-sm text-muted-foreground max-w-xs">
          {profile.bio}
        </p>
      )}

      {/* Stats Pills */}
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        <Badge variant="secondary">
          {profile.followers} Followers
        </Badge>
        <Badge variant="secondary">
          {profile.following} Following
        </Badge>
        <Badge variant="secondary">
          {profile.public_repos} Repos
        </Badge>
      </div>

      {/* GitHub Link */}
      <a
        href={`https://github.com/${profile.username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-blue-500 hover:underline mt-3"
      >
        <FaGithub />
        <span>View Profile</span>
        <FiExternalLink size={14} />
      </a>
    </div>
  );
};

export default Profilecard;