import { useState, useEffect } from 'react';

export const useMessage = (duration = 3000) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  const showMessage = (msg) => setMessage(msg);
  const showSuccess = (msg) => setMessage(msg.includes('success') ? msg : `${msg} successfully`);
  const showError = (msg) => setMessage(msg);

  return {
    message,
    setMessage,
    showMessage,
    showSuccess,
    showError,
    loading,
    setLoading
  };
};