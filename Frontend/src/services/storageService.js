// Storage & Offline Sync Service

const STORAGE_KEYS = {
  CROPS: "farm2market_farmer_crops",
  PROFILE: "farm2market_farmer_profile",
  OFFERS: "farm2market_farmer_offers",
  ORDERS: "farm2market_farmer_orders",
  OFFLINE_QUEUE: "farm2market_offline_actions",
};

export const loadStoredData = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error loading stored data for key ${key}:`, e);
    return fallback;
  }
};

export const saveStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving data for key ${key}:`, e);
  }
};

export const queueOfflineAction = (action) => {
  const currentQueue = loadStoredData(STORAGE_KEYS.OFFLINE_QUEUE, []);
  currentQueue.push({
    ...action,
    timestamp: new Date().toISOString(),
    id: "action_" + Date.now(),
  });
  saveStoredData(STORAGE_KEYS.OFFLINE_QUEUE, currentQueue);
};

export const getOfflineQueue = () => {
  return loadStoredData(STORAGE_KEYS.OFFLINE_QUEUE, []);
};

export const clearOfflineQueue = () => {
  saveStoredData(STORAGE_KEYS.OFFLINE_QUEUE, []);
};

export { STORAGE_KEYS };
