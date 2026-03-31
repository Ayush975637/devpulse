
import { useState, useEffect } from "react";


export function useCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async (username) => {
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/github/profile/${username}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError("Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchProfile };
}