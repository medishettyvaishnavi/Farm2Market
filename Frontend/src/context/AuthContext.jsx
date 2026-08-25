/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { initialFarmerProfile } from "../data/mockFarmerData";
import { loadStoredData, saveStoredData, STORAGE_KEYS } from "../services/storageService";
import axios from "axios";

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
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          mobile,
          password,
          role,
        }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);

      const loggedUser = {
        ...initialFarmerProfile,
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        role: user.role.toLowerCase(),
        village: user.location || initialFarmerProfile.village,
      };

      setFarmer(loggedUser);
      setIsAuthenticated(true);

      saveStoredData(STORAGE_KEYS.PROFILE, loggedUser);

      return {
        success: true,
        role: loggedUser.role,
      };
    } catch (error) {
      console.error("Login failed:", error);

      return {
        success: false,
        message:
          error.response?.data?.message || "Invalid mobile number or password",
      };
    }
  };

const registerFarmer = async (formData) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/signup",
      {
        name: formData.name,
        mobile: formData.mobile,
        password: formData.password,
        role: formData.role,

        location: formData.location,
        landSize: formData.landSize,
        soilType: formData.soilType,
        irrigationSource: formData.irrigationSource,
        preferredLanguage: formData.preferredLanguage,
      }
    );

    const { token, user } = response.data;

    localStorage.setItem("token", token);

    const newFarmer = {
      ...initialFarmerProfile,
      id: user.id,
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
    console.error("Registration failed:", error);

    return {
      success: false,
      message:
        error.response?.data?.message || "Registration failed",
    };
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

export default AuthProvider;
