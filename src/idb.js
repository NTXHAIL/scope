const DB_NAME = "hailspec";
const DB_VERSION = 1;

let dbPromise = null;

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("scopes")) db.createObjectStore("scopes", { keyPath: "id" });
      if (!db.objectStoreNames.contains("meta")) db.createObjectStore("meta");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      dbPromise = null;
      reject(request.error);
    };
  });
  return dbPromise;
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadScopes() {
  const db = await openDb();
  const rows = await requestToPromise(db.transaction("scopes", "readonly").objectStore("scopes").getAll());
  return Array.isArray(rows) ? rows : [];
}

export async function saveScope(scope) {
  const db = await openDb();
  await requestToPromise(db.transaction("scopes", "readwrite").objectStore("scopes").put(scope));
}

export async function deleteScope(id) {
  const db = await openDb();
  await requestToPromise(db.transaction("scopes", "readwrite").objectStore("scopes").delete(id));
}

export async function readMeta(key) {
  const db = await openDb();
  return requestToPromise(db.transaction("meta", "readonly").objectStore("meta").get(key));
}

export async function saveMeta(key, value) {
  const db = await openDb();
  await requestToPromise(db.transaction("meta", "readwrite").objectStore("meta").put(value, key));
}

export function closeDatabase() {
  const pending = dbPromise;
  dbPromise = null;
  if (!pending) return Promise.resolve();
  return pending.then((db) => { db.close(); }).catch(() => {});
}

if (typeof window !== "undefined") window.__hailspecCloseDb = closeDatabase;
