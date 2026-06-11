import { useEffect, useState } from 'react';
import { ERROR_TOAST_TIMEOUT, subscribeError } from '../../utils/errorBus';

export const ErrorToast = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeError(setMessage);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!message) {
      return;
    }
    const timer = window.setTimeout(() => setMessage(''), ERROR_TOAST_TIMEOUT);
    return () => window.clearTimeout(timer);
  }, [message]);

  if (!message) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 rounded-lg bg-tomato px-5 py-3 text-sm font-medium text-white shadow-soft">
      {message}
    </div>
  );
};
