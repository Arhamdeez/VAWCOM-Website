'use client';

import { useCallback, useState } from 'react';

export function useVoiceCall() {
  const [phone, setPhone] = useState('');
  const [calling, setCalling] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const startCall = useCallback(async () => {
    if (!phone.trim()) {
      setStatus({ type: 'error', message: 'Please enter a phone number' });
      return;
    }
    setCalling(true);
    setStatus({ type: null, message: '' });
    try {
      const res = await fetch('/api/vapi/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({
          type: 'success',
          message: data.message || 'Call initiated! You should receive a call shortly.',
        });
        setPhone('');
      } else {
        setStatus({
          type: 'error',
          message:
            data.error ||
            data.message ||
            (typeof data.details === 'string' ? data.details : 'Failed to initiate call.'),
        });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message:
          err instanceof Error
            ? `Network error: ${err.message}`
            : 'Network error. Please try again.',
      });
    } finally {
      setCalling(false);
    }
  }, [phone]);

  return { phone, setPhone, calling, status, setStatus, startCall };
}
