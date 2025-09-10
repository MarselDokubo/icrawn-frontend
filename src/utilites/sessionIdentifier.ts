// Safe helper for browser APIs
const safeGet = <T>(fn: () => T, fallback: T): T => {
  try {
    const value = fn();
    return value ?? fallback;
  } catch {
    return fallback;
  }
};

// Safe localStorage wrapper (incognito/Safari private mode)
const safeStorage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return (window as any).__memoryStore?.[key] ?? null;
    }
  },
  set: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      if (!(window as any).__memoryStore) (window as any).__memoryStore = {};
      (window as any).__memoryStore[key] = value;
    }
  }
};

// Hash function (FNV-like) for fingerprinting
const hashString = (str: string): string => {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  let hexHash = (hash >>> 0).toString(16);
  while (hexHash.length < 12) hexHash = "0" + hexHash;
  return hexHash.slice(0, 12);
};

// Canvas fingerprint (safe)
const getCanvasFingerprint = (): string => {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "unsupported";
    ctx.font = "16px Arial";
    ctx.fillText("Session ID", 2, 15);
    return canvas.toDataURL();
  } catch {
    return "unsupported";
  }
};

// Fallback random ID
const generateRandomId = (): string =>
  crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 12);

// Main function
export const getSessionIdentifier = (): string => {
  // Return existing session if stored
  const stored = safeStorage.get("session_identifier");
  if (stored) return stored;

  try {
    const fingerprint = {
      userAgent: safeGet(() => navigator.userAgent, "unknown"),
      screenResolution: safeGet(() => `${screen.width}x${screen.height}`, "0x0"),
      colorDepth: safeGet(() => screen.colorDepth, 0),
      timezoneOffset: safeGet(() => new Date().getTimezoneOffset(), 0),
      language: safeGet(() => navigator.language, "unknown"),
      platform: safeGet(() => navigator.platform, "unknown"),
      canvas: safeGet(() => getCanvasFingerprint(), "unsupported"),
      hardwareConcurrency: safeGet(() => navigator.hardwareConcurrency, "unknown"),
      deviceMemory: safeGet(() => (navigator as any).deviceMemory, "unknown"),
      maxTouchPoints: safeGet(() => navigator.maxTouchPoints, 0),
      vendor: safeGet(() => navigator.vendor, "unknown")
    };

    const hashed = hashString(JSON.stringify(fingerprint));
    safeStorage.set("session_identifier", hashed);
    return hashed;
  } catch {
    const random = generateRandomId();
    safeStorage.set("session_identifier", random);
    return random;
  }
};
