import { browser } from '$app/environment';
import type { CipherGCM, DecipherGCM } from 'crypto';

const ALGORITHM = 'AES-GCM'; // Browser algo for client side
const NODE_ALGORITHM = 'aes-256-gcm'; // Node algo for server side
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const ENCODING = 'hex';

function browserRandomBytes(size: number): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(size));
}

async function browserGetKey(password: string, salt: Uint8Array): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const key = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    KEY_LENGTH * 8
  );
  return new Uint8Array(key);
}

async function browserEncrypt(data: string, password: string): Promise<string> {
  const salt = browserRandomBytes(SALT_LENGTH);
  const iv = browserRandomBytes(IV_LENGTH);
  const key = await browserGetKey(password, salt);

  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const cryptoKey = await window.crypto.subtle.importKey('raw', key, { name: ALGORITHM }, false, [
    'encrypt'
  ]);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: ALGORITHM, iv: iv },
    cryptoKey,
    dataBuffer
  );
  const encryptedArray = new Uint8Array(encrypted);
  const result = new Uint8Array(salt.length + iv.length + encryptedArray.length);
  result.set(salt, 0);
  result.set(iv, salt.length);
  result.set(encryptedArray, salt.length + iv.length);
  return arrayBufferToHex(result);
}

async function browserDecrypt(encryptedData: string, password: string): Promise<string> {
  const buffer = hexToUint8Array(encryptedData);
  const salt = buffer.slice(0, SALT_LENGTH);
  const iv = buffer.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const data = buffer.slice(SALT_LENGTH + IV_LENGTH, -TAG_LENGTH);
  const tag = buffer.slice(-TAG_LENGTH);
  const key = await browserGetKey(password, salt);

  const cryptoKey = await window.crypto.subtle.importKey('raw', key, { name: ALGORITHM }, false, [
    'decrypt'
  ]);
  const decrypted = await window.crypto.subtle.decrypt(
    { name: ALGORITHM, iv: iv },
    cryptoKey,
    concatenateUint8Arrays([data, tag])
  );
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

// this is the helper function for hex mapping
function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToUint8Array(hex: string): Uint8Array {
  return new Uint8Array(hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
}

function concatenateUint8Arrays(arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((acc, value) => acc + value.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const array of arrays) {
    result.set(array, offset);
    offset += array.length;
  }
  return result;
}

export async function encrypt(data: string, password: string): Promise<string> {
  if (browser) {
    return browserEncrypt(data, password);
  } else {
    const nodeCrypto = await import('crypto');
    const salt = nodeCrypto.randomBytes(SALT_LENGTH);
    const iv = nodeCrypto.randomBytes(IV_LENGTH);
    const key = nodeCrypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, 'sha256');
    const cipher = nodeCrypto.createCipheriv(NODE_ALGORITHM, key, iv) as CipherGCM;
    const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    const result = Buffer.concat([salt, iv, encrypted, tag]);
    return result.toString(ENCODING);
  }
}

export async function decrypt(encryptedData: string, password: string): Promise<string> {
  if (browser) {
    return browserDecrypt(encryptedData, password);
  } else {
    const nodeCrypto = await import('crypto');
    const buffer = Buffer.from(encryptedData, ENCODING);
    const salt = buffer.subarray(0, SALT_LENGTH);
    const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const data = buffer.subarray(SALT_LENGTH + IV_LENGTH, -TAG_LENGTH);
    const tag = buffer.subarray(-TAG_LENGTH);
    const key = nodeCrypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, 'sha256');
    const decipher = nodeCrypto.createDecipheriv(NODE_ALGORITHM, key, iv) as DecipherGCM;
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return decrypted.toString('utf8');
  }
}
