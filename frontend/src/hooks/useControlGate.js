import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchControlStatus } from '../services/control';

const CACHE_KEY = 'animeapp-control-cache';
const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const readCache = () => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn('Tidak bisa membaca cache kontrol', err);
    return null;
  }
};

const writeCache = (payload) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('Tidak bisa menyimpan cache kontrol', err);
  }
};

const useControlGate = () => {
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('');
  const [lastChecked, setLastChecked] = useState(null);
  const refreshId = useRef(0);
  const abortRef = useRef(null);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setStatus('checking');
      const result = await fetchControlStatus(controller.signal);
      const payload = {
        status: result.status,
        message: result.message,
        updatedAt: result.updatedAt,
        checkedAt: new Date().toISOString(),
      };
      writeCache(payload);

      setStatus(result.status);
      setMessage(result.message || (result.status === 'inactive' ? 'Aplikasi telah dinonaktifkan oleh developer.' : ''));
      setLastChecked(payload.updatedAt || payload.checkedAt);
    } catch (err) {
      const cached = readCache();
      if (cached) {
        setStatus(cached.status || 'inactive');
        setMessage(cached.message || 'Aplikasi telah dinonaktifkan sementara.');
        setLastChecked(cached.updatedAt || cached.checkedAt);
      } else {
        setStatus('error');
        setMessage(err?.message || 'Gagal memeriksa status aplikasi.');
      }
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => {
      abortRef.current?.abort();
      clearInterval(interval);
    };
  }, [load]);

  const reload = useCallback(() => {
    refreshId.current += 1; // keep for future extensibility
    load();
  }, [load]);

  return { status, message, lastChecked, reload };
};

export default useControlGate;
