import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import CryptoJS from 'crypto-js';

const STORE_KEY = 'aniversmart_enc_key_v1';

// Chave legada usada apenas para migração de dados existentes (XOR, obsoleto).
const LEGACY_KEY = 'AniverSmart_2024_SecureKey_32chr!';

let cachedKey: string | null = null;

function legacyEncrypt(phone: string): string {
  const dataBytes = new TextEncoder().encode(phone);
  const keyBytes = new TextEncoder().encode(LEGACY_KEY);
  const encrypted = dataBytes.map((byte, i) => byte ^ keyBytes[i % keyBytes.length]);
  return Array.from(encrypted).map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Deve ser chamado uma única vez no boot do app, antes de qualquer acesso ao DB. */
export async function initEncryption(): Promise<void> {
  let key = await SecureStore.getItemAsync(STORE_KEY);
  if (!key) {
    const bytes = await Crypto.getRandomBytesAsync(32);
    key = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    await SecureStore.setItemAsync(STORE_KEY, key);
  }
  cachedKey = key;
}

/** Detecta dados criptografados com o esquema legado (XOR → hex). */
export function isLegacyEncrypted(s: string): boolean {
  return (
    typeof s === 'string' &&
    s.length > 0 &&
    s.length % 2 === 0 &&
    /^[0-9a-f]+$/.test(s)
  );
}

function legacyDecrypt(hex: string): string {
  try {
    const bytes = new Uint8Array(hex.match(/.{2}/g)!.map(b => parseInt(b, 16)));
    const keyBytes = new TextEncoder().encode(LEGACY_KEY);
    const decrypted = bytes.map((byte, i) => byte ^ keyBytes[i % keyBytes.length]);
    return new TextDecoder().decode(decrypted);
  } catch {
    return '';
  }
}

export function encryptPhone(phone: string): string {
  if (!cachedKey) return legacyEncrypt(phone);
  return CryptoJS.AES.encrypt(phone, cachedKey).toString();
}

export function decryptPhone(encrypted: string): string {
  if (!encrypted || typeof encrypted !== 'string') return '';
  try {
    if (isLegacyEncrypted(encrypted)) return legacyDecrypt(encrypted);
    if (!cachedKey) return '';
    const bytes = CryptoJS.AES.decrypt(encrypted, cachedKey);
    return bytes.toString(CryptoJS.enc.Utf8) || '';
  } catch {
    return '';
  }
}
