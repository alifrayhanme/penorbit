import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/lib/utils';

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiRequest(url, options);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options)]);

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url, fetchData]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      // Add cache busting
      const cacheBuster = `?_t=${Date.now()}`;
      const fetchUrl = url.includes('?') ? `${url}&_t=${Date.now()}` : `${url}${cacheBuster}`;
      const result = await apiRequest(fetchUrl, options);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};