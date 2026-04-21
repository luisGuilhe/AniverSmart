import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import { getAllContacts, Contact } from '../services/database';
import {
  checkAndNotifyBirthdays,
  scheduleDailyCheck,
  registerBackgroundTask,
} from '../services/notifications';

interface AppContextValue {
  contacts: Contact[];
  loadingContacts: boolean;
  refreshContacts: () => Promise<void>;
}

const AppContext = createContext<AppContextValue>({
  contacts: [],
  loadingContacts: true,
  refreshContacts: async () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);

  const refreshContacts = useCallback(async () => {
    setLoadingContacts(true);
    try {
      const data = await getAllContacts();
      setContacts(data);
    } finally {
      setLoadingContacts(false);
    }
  }, []);

  useEffect(() => {
    refreshContacts();
    scheduleDailyCheck();
    registerBackgroundTask();
    checkAndNotifyBirthdays();
  }, []);

  // Re-verifica aniversários quando o app volta ao primeiro plano
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') checkAndNotifyBirthdays();
    });
    return () => sub.remove();
  }, []);

  return (
    <AppContext.Provider value={{ contacts, loadingContacts, refreshContacts }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
