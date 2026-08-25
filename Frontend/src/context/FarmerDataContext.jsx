/* eslint-disable react-refresh/only-export-components */
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
import api from "../services/api";

export const FarmerDataContext = createContext();

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

  // Fetch live backend data when online and authenticated
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const token = localStorage.getItem("farm2market_token");
        if (!token) return;

        const [cropsRes, offersRes, ordersRes] = await Promise.all([
          api.get("/crops?farmerOnly=true"),
          api.get("/offers/farmer"),
          api.get("/orders/farmer"),
        ]);

        if (cropsRes.data.success) {
          setCrops(cropsRes.data.crops);
        }
        if (offersRes.data.success) {
          // Normalize offer fields for frontend compatibility
          const normalizedOffers = offersRes.data.offers.map(o => ({
            id: o._id,
            cropId: o.crop?._id,
            cropName: o.crop?.name || "Crop listing",
            buyerId: o.buyer?._id,
            buyerName: o.buyerName || o.buyer?.name || "Buyer",
            buyerRating: o.buyerRating || 4.8,
            requestedQuantity: o.requestedQuantity,
            unit: o.unit,
            offeredPricePerUnit: o.offeredPricePerUnit,
            totalAmount: o.totalAmount,
            offerDate: new Date(o.createdAt).toLocaleString(),
            status: o.status,
            farmerCounterPrice: o.farmerCounterPrice,
            notes: o.notes,
          }));
          setOffers(normalizedOffers);
        }
        if (ordersRes.data.success) {
          // Normalize order fields for frontend compatibility
          const normalizedOrders = ordersRes.data.orders.map(o => ({
            id: o.orderStatus === "ORDER_CREATED" || o.orderStatus === "CONFIRMED" ? o.transactionId : o.id || o._id,
            cropName: o.cropName || o.crop?.name,
            buyerName: o.buyerName,
            quantity: o.quantity,
            unit: o.unit,
            pricePerUnit: o.pricePerUnit,
            totalAmount: o.totalAmount,
            transportCost: o.transportCost,
            estimatedNetEarnings: o.estimatedNetEarnings,
            orderDate: o.orderDate,
            status: o.orderStatus.toLowerCase() === "order_created" || o.orderStatus.toLowerCase() === "confirmed" ? "confirmed" : o.orderStatus.toLowerCase() === "paid" ? "paid" : o.orderStatus.toLowerCase(),
            paymentStatus: o.paymentStatus,
            paymentMode: o.paymentMode,
            transactionId: o.transactionId,
            pickupAddress: o.pickupLocation,
            deliveryAddress: o.deliveryLocation,
            distance: o.distance,
            expectedDeliveryDate: o.expectedDeliveryDate,
          }));
          setOrders(normalizedOrders);
        }
      } catch (err) {
        console.warn("Could not sync with live backend database, running offline/mock mode:", err);
      }
    };

    fetchBackendData();
  }, []);

  // Crop Actions
  const addCrop = async (cropData) => {
    try {
      const res = await api.post("/crops", {
        name: cropData.name,
        variety: cropData.variety || "Bt-Cotton Super 32",
        category: cropData.category || "Cash Crop",
        quantity: Number(cropData.quantity),
        unit: cropData.unit || "Quintals",
        expectedPrice: Number(cropData.expectedPrice),
        mandiPrice: Number(cropData.expectedPrice) - 150,
        harvestDate: cropData.harvestDate || new Date().toISOString().split("T")[0],
        grade: cropData.grade || "Grade A (Premium)",
        location: cropData.location || "Khammam Mandi",
        description: cropData.description || "",
        photos: cropData.photos || [
          "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=500&auto=format&fit=crop&q=60",
        ],
      });

      if (res.data.success) {
        setCrops((prev) => [res.data.crop, ...prev]);
        return res.data.crop;
      }
    } catch (error) {
      console.warn("Backend addCrop failed, fall back to offline storage:", error);
    }

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

  const updateCrop = async (id, updatedFields) => {
    try {
      const res = await api.put(`/crops/${id}`, updatedFields);
      if (res.data.success) {
        setCrops((prev) =>
          prev.map((c) => (c._id === id || c.id === id ? res.data.crop : c))
        );
        return;
      }
    } catch (error) {
      console.warn("Backend updateCrop failed:", error);
    }

    if (!navigator.onLine) {
      queueOfflineAction({ type: "UPDATE_CROP", payload: { id, ...updatedFields } });
    }

    setCrops((prev) =>
      prev.map((crop) => (crop.id === id || crop._id === id ? { ...crop, ...updatedFields } : crop))
    );
  };

  const deleteCrop = async (id) => {
    try {
      const res = await api.delete(`/crops/${id}`);
      if (res.data.success) {
        setCrops((prev) => prev.filter((crop) => crop.id !== id && crop._id !== id));
        return;
      }
    } catch (error) {
      console.warn("Backend deleteCrop failed:", error);
    }

    if (!navigator.onLine) {
      queueOfflineAction({ type: "DELETE_CROP", payload: { id } });
    }

    setCrops((prev) => prev.filter((crop) => crop.id !== id && crop._id !== id));
  };

  // Offer Actions
  const acceptOffer = async (offerId) => {
    try {
      const res = await api.post(`/offers/${offerId}/accept`);
      if (res.data.success) {
        setOffers((prev) =>
          prev.map((o) => (o.id === offerId || o._id === offerId ? { ...o, status: "accepted" } : o))
        );

        // Fetch refreshed crop and order list
        const [cropsRes, ordersRes] = await Promise.all([
          api.get("/crops?farmerOnly=true"),
          api.get("/orders/farmer"),
        ]);
        if (cropsRes.data.success) setCrops(cropsRes.data.crops);
        if (ordersRes.data.success) {
          const normalizedOrders = ordersRes.data.orders.map(o => ({
            id: o.orderStatus === "ORDER_CREATED" || o.orderStatus === "CONFIRMED" ? o.transactionId : o.id || o._id,
            cropName: o.cropName || o.crop?.name,
            buyerName: o.buyerName,
            quantity: o.quantity,
            unit: o.unit,
            pricePerUnit: o.pricePerUnit,
            totalAmount: o.totalAmount,
            transportCost: o.transportCost,
            estimatedNetEarnings: o.estimatedNetEarnings,
            orderDate: o.orderDate,
            status: o.orderStatus.toLowerCase() === "order_created" || o.orderStatus.toLowerCase() === "confirmed" ? "confirmed" : o.orderStatus.toLowerCase() === "paid" ? "paid" : o.orderStatus.toLowerCase(),
            paymentStatus: o.paymentStatus,
            paymentMode: o.paymentMode,
            transactionId: o.transactionId,
            pickupAddress: o.pickupLocation,
            deliveryAddress: o.deliveryLocation,
            distance: o.distance,
            expectedDeliveryDate: o.expectedDeliveryDate,
          }));
          setOrders(normalizedOrders);
        }
        return;
      }
    } catch (error) {
      console.warn("Backend acceptOffer failed, fall back locally:", error);
    }

    const offer = offers.find((o) => o.id === offerId || o._id === offerId);
    if (!offer) return;

    setOffers((prev) =>
      prev.map((o) => (o.id === offerId || o._id === offerId ? { ...o, status: "accepted" } : o))
    );

    if (offer.cropId) {
      updateCrop(offer.cropId, { status: "sold" });
    }

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

  const rejectOffer = async (offerId) => {
    try {
      await api.post(`/offers/${offerId}/reject`);
    } catch (error) {
      console.warn("Backend rejectOffer failed:", error);
    }
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId || o._id === offerId ? { ...o, status: "rejected" } : o))
    );
  };

  const counterOffer = async (offerId, counterPrice, message) => {
    try {
      await api.post(`/offers/${offerId}/counter`, { counterPrice: Number(counterPrice) });
    } catch (error) {
      console.warn("Backend counterOffer failed:", error);
    }
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId || o._id === offerId
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
        setOrders,
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

export default FarmerDataProvider;
