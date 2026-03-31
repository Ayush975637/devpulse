// src/types.ts

export type Profile = {
  avatar_url: string;
  name: string;
  username: string;
  bio: string;
  followers: number;
  following: number;
  github_id: number;
  public_repos: number;
}

export type Stats = {
  totalRepos: number;
  totalStars: number;
  mostActiveDay: string;
  topLanguages: { lang: string; count: number }[];
  weeklyCommits: { day: string; count: number }[];
  followers: number;
  devScore: { overall: number; label: string; percentile: number; breakdown: {
    consistency: number;
    impact: number;
    diversity: number;
    activity: number;
    repoScore: number;
    reach: number;
  } };
  totalCommits: number;
}

export type Repo = {
  github_id: number;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  updated_at: string;
  homepage: string | null;
  repos_url: string;
}


 export type Language = { lang: string; count: number }

export type DevScoreBreakdown = {
 consistency: number;
 impact: number;
 diversity: number;
 activity: number;
 repoScore: number;
 reach: number;

}

export type DevScore = {
 overall: number
 , label:string, percentile: number, breakdown: DevScoreBreakdown
}





export type GithubData = {
  profile: Profile;
  stats: Stats;
  repos: Repo[];
  DevScore: DevScore;
  DevScoreBreakdown: DevScoreBreakdown;
  Languages: Language[];
}