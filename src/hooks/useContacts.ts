import { useState, useCallback } from 'react';
import {
  Contact,
  insertContact,
  updateContact,
  deleteContact,
  getContactById,
} from '../services/database';
import { useApp } from '../context/AppContext';

export function useContacts() {
  const { contacts, loadingContacts, refreshContacts } = useApp();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addContact = useCallback(async (data: Omit<Contact, 'id' | 'createdAt'>): Promise<number> => {
    setSaving(true);
    setError(null);
    try {
      const id = await insertContact(data);
      await refreshContacts();
      return id;
    } catch (e: any) {
      setError(e.message ?? 'Erro ao salvar contato');
      throw e;
    } finally {
      setSaving(false);
    }
  }, [refreshContacts]);

  const editContact = useCallback(async (id: number, data: Partial<Omit<Contact, 'id' | 'createdAt'>>): Promise<void> => {
    setSaving(true);
    setError(null);
    try {
      await updateContact(id, data);
      await refreshContacts();
    } catch (e: any) {
      setError(e.message ?? 'Erro ao atualizar contato');
      throw e;
    } finally {
      setSaving(false);
    }
  }, [refreshContacts]);

  const removeContact = useCallback(async (id: number): Promise<void> => {
    setSaving(true);
    setError(null);
    try {
      await deleteContact(id);
      await refreshContacts();
    } catch (e: any) {
      setError(e.message ?? 'Erro ao remover contato');
      throw e;
    } finally {
      setSaving(false);
    }
  }, [refreshContacts]);

  return {
    contacts,
    loading: loadingContacts,
    saving,
    error,
    addContact,
    editContact,
    removeContact,
    refresh: refreshContacts,
  };
}
