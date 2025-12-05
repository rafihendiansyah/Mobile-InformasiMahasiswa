// src/storage.js
// Async storage wrapper: prefer AsyncStorage (works in Expo Managed),
// otherwise try MMKV (native), otherwise fall back to in-memory Map.

let AsyncStorage;
try {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  AsyncStorage = require("@react-native-async-storage/async-storage").default;
} catch (e) {
  AsyncStorage = undefined;
}

let MMKV;
try {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  MMKV = require("react-native-mmkv").MMKV;
} catch (e) {
  MMKV = undefined;
}

const memory = new Map();
// Log which storage backend will be used (helps debugging persistence)
try {
  if (AsyncStorage) console.info("Storage backend: AsyncStorage");
  else if (MMKV) console.info("Storage backend: MMKV");
  else console.info("Storage backend: In-memory (no persistence)");
} catch (e) {
  // ignore logging errors
}

export async function setItem(key, value) {
  const json = JSON.stringify(value);
  if (AsyncStorage) {
    try {
      await AsyncStorage.setItem(key, json);
      return;
    } catch (e) {
      console.warn("AsyncStorage setItem failed:", e);
    }
  }

  if (MMKV) {
    try {
      const store = new MMKV();
      store.set(key, json);
      return;
    } catch (e) {
      console.warn("MMKV set failed:", e);
    }
  }

  memory.set(key, json);
}

export async function getItem(key) {
  if (AsyncStorage) {
    try {
      const json = await AsyncStorage.getItem(key);
      if (!json) return null;
      try {
        return JSON.parse(json);
      } catch (e) {
        return null;
      }
    } catch (e) {
      console.warn("AsyncStorage getItem failed:", e);
    }
  }

  if (MMKV) {
    try {
      const store = new MMKV();
      const json = store.getString(key);
      if (!json) return null;
      try {
        return JSON.parse(json);
      } catch (e) {
        return null;
      }
    } catch (e) {
      console.warn("MMKV get failed:", e);
    }
  }

  const json = memory.has(key) ? memory.get(key) : undefined;
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

export async function removeItem(key) {
  if (AsyncStorage) {
    try {
      await AsyncStorage.removeItem(key);
      return;
    } catch (e) {
      console.warn("AsyncStorage removeItem failed:", e);
    }
  }

  if (MMKV) {
    try {
      const store = new MMKV();
      store.delete(key);
      return;
    } catch (e) {
      console.warn("MMKV delete failed:", e);
    }
  }

  memory.delete(key);
}
