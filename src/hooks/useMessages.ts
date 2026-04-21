import { useState, useCallback } from 'react';
import { generateMessage } from '../services/messageGenerator';
import { insertMessageHistory, getMessageHistoryForContact } from '../services/database';

export function useMessages() {
  const [generating, setGenerating] = useState(false);

  const generate = useCallback(async (
    contactId: number,
    name: string,
    relationship: string
  ): Promise<string> => {
    setGenerating(true);
    try {
      const history = await getMessageHistoryForContact(contactId);
      const lastMessages = history.slice(0, 3).map(h => h.message);
      return generateMessage(name, relationship, lastMessages);
    } finally {
      setGenerating(false);
    }
  }, []);

  const saveMessageToHistory = useCallback(async (contactId: number, message: string): Promise<void> => {
    await insertMessageHistory(contactId, message);
  }, []);

  return { generate, generating, saveMessageToHistory };
}
