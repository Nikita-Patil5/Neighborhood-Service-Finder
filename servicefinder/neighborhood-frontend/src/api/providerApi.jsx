
import axiosInstance from "./axiosConfig";

// ========================
// Provider APIs
// ========================

// Get services for logged-in provider
export const getMyServices = async () => {
  try {
    const res = await axiosInstance.get("/services/my-services");
    return res.data;
  } catch (err) {
    console.error("Error fetching provider services:", err);
    return [];
  }
};

// Create a new service
export const createService = async (serviceData) => {
  try {
    const res = await axiosInstance.post("/services", serviceData);
    return res.data;
  } catch (err) {
    console.error("Error creating service:", err);
    throw err;
  }
};

// Update existing service
export const updateService = async (id, serviceData) => {
  try {
    const res = await axiosInstance.put(`/services/${id}`, serviceData);
    return res.data;
  } catch (err) {
    console.error("Error updating service:", err);
    throw err;
  }
};

// Delete service
export const deleteService = async (id) => {
  try {
    await axiosInstance.delete(`/services/${id}`);
  } catch (err) {
    console.error("Error deleting service:", err);
    throw err;
  }
};

// Get bookings assigned to provider
export const getMyBookings = async () => {
  try {
    const res = await axiosInstance.get("/bookings/my-bookings");
    return res.data;
  } catch (err) {
    console.error("Error fetching provider bookings:", err);
    return [];
  }
};

// Update booking status (CONFIRMED/CANCELLED)
export const updateBookingStatus = async (id, status) => {
  try {
    const res = await axiosInstance.put(`/bookings/${id}/status`, null, { params: { status } });
    return res.data;
  } catch (err) {
    console.error("Error updating booking status:", err);
    throw err;
  }
};

// ========================
// Review Management (Provider)
// ========================

// Provider fetches reviews for their service (read-only)
export const getReviewsForService = async (serviceId) => {
  try {
    const res = await axiosInstance.get(`/reviews/service/${serviceId}`);
    return res.data || [];
  } catch (err) {
    console.error("Error fetching service reviews:", err);
    return [];
  }
};
