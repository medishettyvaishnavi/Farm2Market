import { createContext, useContext, useState, useEffect } from "react";
import { initialFarmerProfile } from "../data/mockFarmerData";
import { loadStoredData, saveStoredData, STORAGE_KEYS } from "../services/storageService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [farmer, setFarmer] = useState(() => {
    return loadStoredData(STORAGE_KEYS.PROFILE, initialFarmerProfile);
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(loadStoredData(STORAGE_KEYS.PROFILE, initialFarmerProfile));
  });

  useEffect(() => {
    if (farmer) {
      saveStoredData(STORAGE_KEYS.PROFILE, farmer);
    }
  }, [farmer]);

  const login = ({ name, location, mobile, role = "farmer", password }) => {
    // In real backend, axios.post('/api/auth/login')
    const loggedUser = {
      ...initialFarmerProfile,
      name: name || initialFarmerProfile.name,
      village: location || initialFarmerProfile.village,
      mobile: mobile || initialFarmerProfile.mobile,
      role: role || "farmer",
    };
    setFarmer(loggedUser);
    setIsAuthenticated(true);
    saveStoredData(STORAGE_KEYS.PROFILE, loggedUser);
    return { success: true, role: loggedUser.role };
  };

  const registerFarmer = (formData) => {
    const newFarmer = {
      ...initialFarmerProfile,
      id: "farmer_" + Date.now(),
      name: formData.name,
      mobile: formData.mobile,
      village: formData.location || formData.village,
      language: formData.language || "te",
      verificationStatus: "pending",
      isVerified: false,
    };
    setFarmer(newFarmer);
    setIsAuthenticated(true);
    saveStoredData(STORAGE_KEYS.PROFILE, newFarmer);
    return { success: true };
  };

  const updateProfile = (updatedFields) => {
    setFarmer((prev) => {
      const updated = { ...prev, ...updatedFields };
      saveStoredData(STORAGE_KEYS.PROFILE, updated);
      return updated;
    });
  };

  const submitVerification = (verificationData) => {
    setFarmer((prev) => {
      const updated = {
        ...prev,
        ...verificationData,
        verificationStatus: "pending",
        isVerified: false,
      };
      saveStoredData(STORAGE_KEYS.PROFILE, updated);
      return updated;
    });
  };

  const logout = () => {
    setFarmer(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
  };

  return (
    <AuthContext.Provider
      value={{
        farmer,
        isAuthenticated,
        login,
        registerFarmer,
        updateProfile,
        submitVerification,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
