// src/types.ts

export type Profile = {
  avatar_url: string;
  name: string;
  username: string;
  bio: string;
  followers: number;
}

export type Stats = {
  totalRepos: number;
  totalStars: number;
  mostActiveDay: string;
  topLanguages: { lang: string; count: number }[];
}

export type Repo = {
  github_id: number;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
}

export type GithubData = {
  profile: Profile;
  stats: Stats;
  repos: Repo[];
}