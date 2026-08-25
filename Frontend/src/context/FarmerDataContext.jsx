import { createContext, useContext, useState, useEffect } from "react";
import {
  initialCrops,
  initialNearbyBuyers,
  initialOffers,
  initialOrders,
} from "../data/mockFarmerData";
import {
  loadStoredData,
  saveStoredData,
  queueOfflineAction,
  STORAGE_KEYS,
} from "../services/storageService";

const FarmerDataContext = createContext();

export const FarmerDataProvider = ({ children }) => {
  const [crops, setCrops] = useState(() => {
    return loadStoredData(STORAGE_KEYS.CROPS, initialCrops);
  });

  const [offers, setOffers] = useState(() => {
    return loadStoredData(STORAGE_KEYS.OFFERS, initialOffers);
  });

  const [orders, setOrders] = useState(() => {
    return loadStoredData(STORAGE_KEYS.ORDERS, initialOrders);
  });

  const [buyers, setBuyers] = useState(initialNearbyBuyers);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.CROPS, crops);
  }, [crops]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.OFFERS, offers);
  }, [offers]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.ORDERS, orders);
  }, [orders]);

  // Crop Actions
  const addCrop = (cropData) => {
    const newCrop = {
      ...cropData,
      id: "crop_" + Date.now(),
      createdDate: new Date().toISOString().split("T")[0],
      status: "active",
    };

    if (!navigator.onLine) {
      queueOfflineAction({ type: "ADD_CROP", payload: newCrop });
    }

    setCrops((prev) => [newCrop, ...prev]);
    return newCrop;
  };

  const updateCrop = (id, updatedFields) => {
    if (!navigator.onLine) {
      queueOfflineAction({ type: "UPDATE_CROP", payload: { id, ...updatedFields } });
    }

    setCrops((prev) =>
      prev.map((crop) => (crop.id === id ? { ...crop, ...updatedFields } : crop))
    );
  };

  const deleteCrop = (id) => {
    if (!navigator.onLine) {
      queueOfflineAction({ type: "DELETE_CROP", payload: { id } });
    }

    setCrops((prev) => prev.filter((crop) => crop.id !== id));
  };

  // Offer Actions
  const acceptOffer = (offerId) => {
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) return;

    // Update offer status
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: "accepted" } : o))
    );

    // Update crop status
    if (offer.cropId) {
      updateCrop(offer.cropId, { status: "sold" });
    }

    // Create a new order
    const newOrder = {
      id: "ORD-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000),
      cropName: offer.cropName,
      buyerName: offer.buyerName,
      quantity: offer.requestedQuantity,
      unit: offer.unit,
      pricePerUnit: offer.farmerCounterPrice || offer.offeredPricePerUnit,
      totalAmount:
        (offer.farmerCounterPrice || offer.offeredPricePerUnit) *
        offer.requestedQuantity,
      orderDate: new Date().toISOString().split("T")[0],
      status: "confirmed",
      paymentMode: "Direct Bank Transfer (Escrow Secured)",
      transactionId: "TXN_PENDING_" + Date.now(),
      pickupAddress: "Farmer Registered Farm Hub",
    };

    setOrders((prev) => [newOrder, ...prev]);
  };

  const rejectOffer = (offerId) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: "rejected" } : o))
    );
  };

  const counterOffer = (offerId, counterPrice, message) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId
          ? {
              ...o,
              status: "countered",
              farmerCounterPrice: Number(counterPrice),
              counterMessage: message,
            }
          : o
      )
    );
  };

  return (
    <FarmerDataContext.Provider
      value={{
        crops,
        buyers,
        offers,
        orders,
        addCrop,
        updateCrop,
        deleteCrop,
        acceptOffer,
        rejectOffer,
        counterOffer,
      }}
    >
      {children}
    </FarmerDataContext.Provider>
  );
};

export const useFarmerData = () => {
  const context = useContext(FarmerDataContext);
  if (!context) {
    throw new Error("useFarmerData must be used within a FarmerDataProvider");
  }
  return context;
};
