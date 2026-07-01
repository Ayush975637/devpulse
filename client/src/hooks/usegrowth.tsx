

import { useState } from 'react';

export function useGrowth() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
    

    const fetchGrowth = async (username) => {
         if (!username) return;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/github/analytics/${username}`);
const json = await res.json();
        
if (!res.ok) {
          throw new Error(json.error || 'Failed to fetch growth');
        }
        
        setData(json);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    
  

  return { data, loading, error,fetchGrowth};
}