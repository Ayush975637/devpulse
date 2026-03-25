// ✅ fixed
import { useState } from 'react';
import type {GithubData } from '../types';   // ← import your types

export function useGithub() {
  const [data, setData] = useState<GithubData | null>(null);  // ← typed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/github/profile/${username}`);
      const json = await res.json();
      setData(json);                    // now TS knows shape of data
    } catch (e) {
      setError('Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchProfile };
}