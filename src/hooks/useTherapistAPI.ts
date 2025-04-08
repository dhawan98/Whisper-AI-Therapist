// src/hooks/useTherapistAPI.ts
import { useCallback, useState } from 'react';

interface TherapistResponse {
  response: string;
  emotion: string;
  memory_tag: string;
}

const useTherapistAPI = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getTherapistResponse = useCallback(async (userInput: string): Promise<TherapistResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      // Replace 'http://localhost:8000' with your backend URL if different.
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: userInput }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch therapist response.');
      }
      
      const data: TherapistResponse = await res.json();
      return data;
      
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getTherapistResponse, loading, error };
};

export default useTherapistAPI;
