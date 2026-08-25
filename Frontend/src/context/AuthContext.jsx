/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { initialFarmerProfile } from "../data/mockFarmerData";
import { loadStoredData, saveStoredData, STORAGE_KEYS } from "../services/storageService";
import api from "../services/api";

export const AuthContext = createContext();

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

  const login = async ({ mobile, password, role }) => {
    try {
      const res = await api.post("/auth/login", { 
        mobile, 
        password,
        role: role.toUpperCase(),
      });
      const { token, user } = res.data;
      
      localStorage.setItem("farm2market_token", token);
      localStorage.setItem("token", token);

      const loggedUser = {
        ...initialFarmerProfile,
        id: user.id || user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role.toLowerCase(),
        village: user.location || initialFarmerProfile.village,
        isVerified: user.isVerified || false,
        verificationStatus: user.isVerified ? "verified" : "pending",
        landSize: user.landSize,
        soilType: user.soilType,
        irrigationSource: user.irrigationSource,
      };

      setFarmer(loggedUser);
      setIsAuthenticated(true);
      saveStoredData(STORAGE_KEYS.PROFILE, loggedUser);
      return { success: true, role: loggedUser.role };
    } catch (error) {
      console.warn("API login failed:", error);
      
      // If server responded with a status, it's a validation error, not a connection drop
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || "Invalid mobile number or password",
        };
      }
      
      // Network offline fallback
      const loggedUser = {
        ...initialFarmerProfile,
        name: mobile || initialFarmerProfile.name,
        village: "Khammam Rural",
        mobile: mobile || initialFarmerProfile.mobile,
        role: role.toLowerCase(),
      };
      setFarmer(loggedUser);
      setIsAuthenticated(true);
      saveStoredData(STORAGE_KEYS.PROFILE, loggedUser);
      return { success: true, role: loggedUser.role };
    }
  };

  const registerFarmer = async (formData) => {
    try {
      const response = await api.post("/auth/signup", {
        name: formData.name,
        mobile: formData.mobile,
        password: formData.password || "123456",
        role: "FARMER",
        location: formData.location || formData.village,
        landSize: Number(formData.landSize) || 0,
        soilType: formData.soilType || "",
        irrigationSource: formData.irrigationSource || "",
        preferredLanguage: formData.preferredLanguage || "en",
      });

      const { token, user } = response.data;
      localStorage.setItem("farm2market_token", token);
      localStorage.setItem("token", token);

      const newFarmer = {
        ...initialFarmerProfile,
        id: user.id || user._id,
        name: user.name,
        mobile: user.mobile,
        village: user.location,
        role: user.role.toLowerCase(),
        language: user.preferredLanguage,
        landSize: user.landSize,
        soilType: user.soilType,
        irrigationSource: user.irrigationSource,
        verificationStatus: "pending",
        isVerified: false,
      };

      setFarmer(newFarmer);
      setIsAuthenticated(true);
      saveStoredData(STORAGE_KEYS.PROFILE, newFarmer);

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.warn("API registration failed, using local fallback:", error);
      
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
    }
  };

  const registerBuyer = async (formData) => {
    try {
      const response = await api.post("/auth/signup", {
        name: formData.name,
        mobile: formData.mobile,
        password: formData.password,
        role: "BUYER",
        location: formData.location,
      });

      const { token, user } = response.data;
      localStorage.setItem("farm2market_token", token);
      localStorage.setItem("token", token);
      
      const newBuyer = {
        ...initialFarmerProfile,
        id: user.id || user._id,
        name: user.name,
        mobile: user.mobile,
        village: user.location,
        role: "buyer",
        isVerified: true,
      };

      setFarmer(newBuyer);
      setIsAuthenticated(true);
      saveStoredData(STORAGE_KEYS.PROFILE, newBuyer);
      return { success: true, user };
    } catch (error) {
      console.error("Buyer API registration failed, using fallback:", error);
      return await login({
        mobile: formData.mobile,
        password: formData.password,
        role: "buyer",
      });
    }
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
    localStorage.removeItem("farm2market_token");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        farmer,
        isAuthenticated,
        login,
        registerFarmer,
        registerBuyer,
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

export default AuthProvider;
