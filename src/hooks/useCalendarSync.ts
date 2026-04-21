import { useState, useCallback } from 'react';
import { syncBirthdaysFromCalendar, requestCalendarPermission } from '../services/googleCalendar';
import { useApp } from '../context/AppContext';

export function useCalendarSync() {
  const { refreshContacts } = useApp();
  const [syncing, setSyncing] = useState(false);
  const [lastResult, setLastResult] = useState<{ added: number; skipped: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sync = useCallback(async () => {
    setSyncing(true);
    setError(null);
    try {
      const result = await syncBirthdaysFromCalendar();
      setLastResult(result);
      await refreshContacts();
    } catch (e: any) {
      setError(e.message ?? 'Erro ao sincronizar calendário');
    } finally {
      setSyncing(false);
    }
  }, [refreshContacts]);

  return { sync, syncing, lastResult, error };
}
