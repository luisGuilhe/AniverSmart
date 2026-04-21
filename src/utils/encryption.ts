import * as Crypto from 'expo-crypto';

const KEY = 'AniverSmart_2024_SecureKey_32chr!';

function toHex(buffer: Uint8Array): string {
  return Array.from(buffer).map(b => b.toString(16).padStart(2, '0')).join('');
}

function xorBytes(data: Uint8Array, key: Uint8Array): Uint8Array {
  return data.map((byte, i) => byte ^ key[i % key.length]);
}

function strToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

function bytesToStr(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

export function encryptPhone(phone: string): string {
  try {
    const dataBytes = strToBytes(phone);
    const keyBytes = strToBytes(KEY);
    const encrypted = xorBytes(dataBytes, keyBytes);
    return toHex(encrypted);
  } catch {
    return phone;
  }
}

export function decryptPhone(encrypted: string): string {
  try {
    const bytes = new Uint8Array(encrypted.match(/.{2}/g)!.map(b => parseInt(b, 16)));
    const keyBytes = strToBytes(KEY);
    const decrypted = xorBytes(bytes, keyBytes);
    return bytesToStr(decrypted);
  } catch {
    return encrypted;
  }
}
