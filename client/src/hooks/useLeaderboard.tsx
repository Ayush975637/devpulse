

import { useState, useEffect } from 'react';

export function useLeaderBoard(page) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!page) return;

    const fetchLeaderBoard = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/github/leaderboard/${page}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError('Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderBoard();
  }, [page]);

  return { data, loading, error };
}