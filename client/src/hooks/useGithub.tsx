

import { useState, useEffect } from 'react';

export function useGithub(username) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/github/profile/${username}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError('Failed to fetch');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  return { data, loading, error };
}