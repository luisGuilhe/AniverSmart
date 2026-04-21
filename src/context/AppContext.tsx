import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAllContacts, Contact } from '../services/database';

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
  }, [refreshContacts]);

  return (
    <AppContext.Provider value={{ contacts, loadingContacts, refreshContacts }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
