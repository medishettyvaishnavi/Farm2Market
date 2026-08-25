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

  const login = async ({ mobile, role = "farmer", password }) => {
    try {
      const res = await api.post("/auth/login", { mobile, password });
      const { token, user } = res.data;
      
      localStorage.setItem("farm2market_token", token);

      const loggedUser = {
        ...initialFarmerProfile,
        id: user.id,
        name: user.name,
        village: user.location,
        mobile: user.phone,
        role: user.role.toLowerCase(),
        isVerified: user.isVerified,
        verificationStatus: user.isVerified ? "verified" : "pending",
      };

      setFarmer(loggedUser);
      setIsAuthenticated(true);
      saveStoredData(STORAGE_KEYS.PROFILE, loggedUser);
      return { success: true, role: loggedUser.role };
    } catch (error) {
      console.warn("API login failed, using local fallback:", error);
      
      // Mock Fallback
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
      const email = `${formData.mobile}@farm2market.in`;
      const regData = {
        name: formData.name,
        email,
        password: formData.password || "123456",
        role: "FARMER",
        phone: formData.mobile,
        location: formData.location || formData.village,
      };
      await api.post("/auth/register", regData);
      return await login({
        mobile: formData.mobile,
        password: formData.password || "123456",
        role: "farmer",
      });
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
      const email = `${formData.mobile}@farm2market.in`;
      const regData = {
        name: formData.name,
        email,
        password: formData.password,
        role: "BUYER",
        phone: formData.mobile,
        location: formData.location,
      };
      await api.post("/auth/register", regData);
      return await login({
        mobile: formData.mobile,
        password: formData.password,
        role: "buyer",
      });
    } catch (error) {
      console.error("Buyer API registration failed:", error);
      // fallback
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
