import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import {
  getAllContacts, Contact,
  getNotificationHistory, NotificationRecord,
  markNotificationRead as dbMarkRead,
  markAllNotificationsRead as dbMarkAllRead,
  migrateLegacyEncryption,
} from '../services/database';
import {
  checkAndNotifyBirthdays,
  scheduleDailyCheck,
  registerBackgroundTask,
} from '../services/notifications';
import { initEncryption } from '../utils/encryption';

interface AppContextValue {
  contacts: Contact[];
  loadingContacts: boolean;
  refreshContacts: () => Promise<void>;
  notificationHistory: NotificationRecord[];
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  markNotificationRead: (id: number) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
}

const AppContext = createContext<AppContextValue>({
  contacts: [],
  loadingContacts: true,
  refreshContacts: async () => {},
  notificationHistory: [],
  unreadCount: 0,
  refreshNotifications: async () => {},
  markNotificationRead: async () => {},
  markAllNotificationsRead: async () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [notificationHistory, setNotificationHistory] = useState<NotificationRecord[]>([]);

  const refreshContacts = useCallback(async () => {
    setLoadingContacts(true);
    try {
      const timeout = new Promise<Contact[]>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 10000)
      );
      const data = await Promise.race([getAllContacts(), timeout]);
      setContacts(data);
    } catch {
      // mantém contatos anteriores em caso de timeout ou erro de DB
    } finally {
      setLoadingContacts(false);
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    const history = await getNotificationHistory();
    setNotificationHistory(history);
  }, []);

  const markNotificationRead = useCallback(async (id: number) => {
    await dbMarkRead(id);
    setNotificationHistory(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    await dbMarkAllRead();
    setNotificationHistory(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const unreadCount = notificationHistory.filter(n => !n.isRead).length;

  useEffect(() => {
    const init = async () => {
      try {
        await initEncryption();
        await migrateLegacyEncryption();
      } catch {
        // Falha silenciosa — decryptPhone lida com chave ausente retornando ''
      }
      await refreshContacts();
      await refreshNotifications();
      scheduleDailyCheck();
      registerBackgroundTask();
      try {
        await checkAndNotifyBirthdays();
      } catch {
        // Não-crítico
      }
      await refreshNotifications();
    };
    init();
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', async (state) => {
      if (state === 'active') {
        await checkAndNotifyBirthdays();
        await refreshNotifications();
      }
    });
    return () => sub.remove();
  }, [refreshNotifications]);

  return (
    <AppContext.Provider value={{
      contacts, loadingContacts, refreshContacts,
      notificationHistory, unreadCount,
      refreshNotifications, markNotificationRead, markAllNotificationsRead,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
