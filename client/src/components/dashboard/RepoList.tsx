import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RepoList = ({ repos }) => {
  if (!repos || repos.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No repositories found
      </p>
    );
  }

  const sortedRepos = [...repos].sort((a, b) => b.stars - a.stars);
  const topRepos = sortedRepos.slice(0, 6);

  // 🎨 language color map
  const langColors = {
    JavaScript: "bg-yellow-400 text-black",
    TypeScript: "bg-blue-500 text-white",
    Python: "bg-green-500 text-white",
    EJS: "bg-gray-500 text-white",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {topRepos.map((repo) => (
        <Card
          key={repo.github_id}
          className="hover:shadow-md hover:scale-[1.02] transition flex flex-col justify-between"
        >
          {/* Header */}
          <CardHeader>
            <CardTitle className="truncate">
              <a
                href={repo.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {repo.name}
              </a>
            </CardTitle>

            <CardDescription className="line-clamp-2">
              {repo.description || "No description"}
            </CardDescription>
          </CardHeader>

          {/* Content */}
          <CardContent className="space-y-3 text-sm">

            {/* Language Badge */}
            {repo.language && (
              <Badge
                className={`w-fit ${
                  langColors[repo.language] || "bg-gray-400 text-white"
                }`}
              >
                {repo.language}
              </Badge>
            )}

            {/* Stats Badges */}
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">⭐ {repo.stars}</Badge>
              <Badge variant="secondary">🍴 {repo.forks}</Badge>
            </div>

            {/* Updated */}
            <div className="text-xs text-muted-foreground">
              Updated{" "}
              {new Date(repo.updated_at).toLocaleDateString()}
            </div>

            {/* Links */}
            <div className="flex gap-3 mt-2">
              <a
                href={repo.repo_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge variant="outline" className="cursor-pointer">
                  GitHub
                </Badge>
              </a>

              {repo.homepage && (
                <a
                  href={repo.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Badge className="bg-green-500 text-white cursor-pointer">
                    Live
                  </Badge>
                </a>
              )}
            </div>

          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RepoList;