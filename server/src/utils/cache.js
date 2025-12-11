// src/utils/cache.js

const cacheStore = new Map();

/**
 * Guarda un valor en cache por X milisegundos
 */
export function setCache(key, value, ttlMs) {
  cacheStore.set(key, {
    value,
    expires: Date.now() + ttlMs
  });
}

/**
 * Retorna cache si existe y no expiró
 */
export function getCache(key) {
  const entry = cacheStore.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expires) {
    cacheStore.delete(key);
    return null;
  }

  return entry.value;
}

/**
 * Elimina un cache
 */
export function clearCache(key) {
  cacheStore.delete(key);
}
