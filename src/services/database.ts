import * as SQLite from 'expo-sqlite';
import { encryptPhone, decryptPhone } from '../utils/encryption';

export interface Contact {
  id: number;
  name: string;
  birthDate: string; // YYYY-MM-DD
  relationship: string;
  phone: string; // decrypted
  photoUri?: string;
  fromGoogle: number; // 0 or 1
  createdAt: string;
}

export interface MessageHistory {
  id: number;
  contactId: number;
  message: string;
  sentAt: string;
}

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('aniversmart.db');
    await initDatabase(db);
  }
  return db;
}

async function initDatabase(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      birth_date TEXT NOT NULL,
      relationship TEXT NOT NULL,
      phone_encrypted TEXT NOT NULL,
      photo_uri TEXT,
      from_google INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS message_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      sent_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
    );
  `);
}

function rowToContact(row: any): Contact {
  return {
    id: row.id,
    name: row.name,
    birthDate: row.birth_date,
    relationship: row.relationship,
    phone: decryptPhone(row.phone_encrypted),
    photoUri: row.photo_uri ?? undefined,
    fromGoogle: row.from_google,
    createdAt: row.created_at,
  };
}

export async function getAllContacts(): Promise<Contact[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<any>(
    'SELECT * FROM contacts ORDER BY name ASC'
  );
  return rows.map(rowToContact);
}

export async function getContactById(id: number): Promise<Contact | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<any>(
    'SELECT * FROM contacts WHERE id = ?', [id]
  );
  return row ? rowToContact(row) : null;
}

export async function insertContact(data: Omit<Contact, 'id' | 'createdAt'>): Promise<number> {
  const database = await getDatabase();
  const result = await database.runAsync(
    `INSERT INTO contacts (name, birth_date, relationship, phone_encrypted, photo_uri, from_google)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.name, data.birthDate, data.relationship, encryptPhone(data.phone), data.photoUri ?? null, data.fromGoogle]
  );
  return result.lastInsertRowId;
}

export async function updateContact(id: number, data: Partial<Omit<Contact, 'id' | 'createdAt'>>): Promise<void> {
  const database = await getDatabase();
  const fields: string[] = [];
  const values: any[] = [];

  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.birthDate !== undefined) { fields.push('birth_date = ?'); values.push(data.birthDate); }
  if (data.relationship !== undefined) { fields.push('relationship = ?'); values.push(data.relationship); }
  if (data.phone !== undefined) { fields.push('phone_encrypted = ?'); values.push(encryptPhone(data.phone)); }
  if (data.photoUri !== undefined) { fields.push('photo_uri = ?'); values.push(data.photoUri); }

  if (fields.length === 0) return;
  values.push(id);
  await database.runAsync(`UPDATE contacts SET ${fields.join(', ')} WHERE id = ?`, values);
}

export async function deleteContact(id: number): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM contacts WHERE id = ?', [id]);
}

export async function insertMessageHistory(contactId: number, message: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    'INSERT INTO message_history (contact_id, message) VALUES (?, ?)',
    [contactId, message]
  );
}

export async function getMessageHistoryForContact(contactId: number): Promise<MessageHistory[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<any>(
    'SELECT * FROM message_history WHERE contact_id = ? ORDER BY sent_at DESC LIMIT 20',
    [contactId]
  );
  return rows.map(r => ({
    id: r.id,
    contactId: r.contact_id,
    message: r.message,
    sentAt: r.sent_at,
  }));
}

export async function exportDatabase(): Promise<Contact[]> {
  return getAllContacts();
}

export async function importContacts(contacts: Omit<Contact, 'id' | 'createdAt'>[]): Promise<void> {
  const database = await getDatabase();
  await database.withTransactionAsync(async () => {
    for (const c of contacts) {
      await database.runAsync(
        `INSERT OR REPLACE INTO contacts (name, birth_date, relationship, phone_encrypted, photo_uri, from_google)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [c.name, c.birthDate, c.relationship, encryptPhone(c.phone), c.photoUri ?? null, c.fromGoogle]
      );
    }
  });
}
