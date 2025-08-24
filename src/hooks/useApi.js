import { useState } from 'react';
import { apiRequest } from '@/lib/utils';

export const useApi = () => {
  const [loading, setLoading] = useState(false);

  const request = async (url, options = {}) => {
    setLoading(true);
    try {
      const result = await apiRequest(url, options);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const get = (url) => request(url);
  const post = (url, data) => request(url, { method: 'POST', body: JSON.stringify(data) });
  const put = (url, data) => request(url, { method: 'PUT', body: JSON.stringify(data) });
  const patch = (url, data) => request(url, { method: 'PATCH', body: JSON.stringify(data) });
  const del = (url, data) => request(url, { method: 'DELETE', body: JSON.stringify(data) });

  return { request, get, post, put, patch, del, loading };
};