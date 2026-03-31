import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CompareRepos = ({user1,user2}) => {

    if (!user1 || !user2) return null;

    const repos1 = user1.repos || [];
    const repos2 = user2.repos || [];
if (!repos1 || repos1.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No repositories found for {user1.profile.username}
      </p>
    );
  }
if (!repos2 || repos2.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No repositories found for {user2.profile.username}
      </p>
    );
  }


  const sortedRepos1 = [...repos1].sort((a, b) => b.stars - a.stars);
  const topRepos1 = sortedRepos1.slice(0, 3);

  const sortedRepos2 = [...repos2].sort((a, b) => b.stars - a.stars);
  const topRepos2 = sortedRepos2.slice(0, 3);

  // 🎨 language color map
  const langColors = {
    JavaScript: "bg-yellow-400 text-black",
    TypeScript: "bg-blue-500 text-white",
    Python: "bg-green-500 text-white",
    EJS: "bg-gray-500 text-white",
  };





  return (
    <div className=" mt-6 border rounded-lg m-4 p-5 ">
      <p className='text-md md:text-lg text-center mb-4 mt-2 font-bold text-orange-300 '>Compare Top Repos</p>
    
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      {/* left  */}

<section > 
<p className='text-md md:text-xl font-bold text-blue-500'>{user1?.profile?.name}</p> 
 {topRepos1.map((repo) => (
        <Card
          key={repo.github_id}
          className="hover:shadow-md hover:scale-[1.02] transition flex flex-col justify-between mt-4 "
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

</section>


{/* right */}

<section >
<p className='text-md md:text-xl font-bold text-pink-500'>{user2?.profile?.name}</p>
 {topRepos2.map((repo) => (
        <Card
          key={repo.github_id}
          className="hover:shadow-md hover:scale-[1.02] transition flex flex-col justify-between mt-4"
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

</section>
 </div>
    </div>
  )
}

export default CompareRepos
