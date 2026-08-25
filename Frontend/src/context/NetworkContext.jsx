/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { getOfflineQueue, clearOfflineQueue } from "../services/storageService";

export const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState("idle"); // 'idle' | 'syncing' | 'synced'

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Process offline queued items
      const queue = getOfflineQueue();
      if (queue.length > 0) {
        setSyncStatus("syncing");
        setTimeout(() => {
          clearOfflineQueue();
          setSyncStatus("synced");
          setTimeout(() => setSyncStatus("idle"), 3500);
        }, 1200);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus("idle");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // For developer/demonstration testing of low-network / offline mode
  const toggleSimulatedOffline = () => {
    setIsOnline((prev) => !prev);
  };

  return (
    <NetworkContext.Provider
      value={{
        isOnline,
        syncStatus,
        toggleSimulatedOffline,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
};

export default NetworkProvider;
