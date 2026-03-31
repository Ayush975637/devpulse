

import { useState, useEffect } from 'react';

export function useCompare({ username1, username2 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username1||!username2) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const res1 = await fetch(`/api/github/profile/${username1}`);
        const res2 = await fetch(`/api/github/profile/${username2}`);
        const json1 = await res1.json();
        const json2 = await res2.json();

        setData({ user1: json1, user2: json2 });

      } catch (e) {
        setError('Failed to fetch');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username1, username2]);

  return { data, loading, error };
}