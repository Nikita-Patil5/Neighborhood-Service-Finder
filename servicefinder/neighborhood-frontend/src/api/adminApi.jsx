import axiosInstance from "./axiosConfig";

// ========================
// Admin APIs
// ========================

// --- User Management ---
export const getAllUsers = async () => {
  try {
    const res = await axiosInstance.get("/users");
    return res.data || [];
  } catch (err) {
    if (err.response?.status === 403) {
      console.error("Access denied: You are not authorized to access users.");
      return [];
    }
    console.error("Error fetching users:", err);
    return [];
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await axiosInstance.delete(`/users/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting user:", err);
    throw err;
  }
};

// --- Provider Management ---
export const getAllProviders = async () => {
  try {
    const res = await axiosInstance.get("/users/providers"); // fixed leading slash
    return res.data || [];
  } catch (err) {
    if (err.response?.status === 403) {
      console.error("Access denied: You are not authorized to access providers.");
      return [];
    }
    console.error("Error fetching providers:", err);
    return [];
  }
};

// Using /users/{id} DELETE endpoint for providers as well
export const deleteProvider = async (id) => {
  try {
    const res = await axiosInstance.delete(`/users/providers/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting provider:", err);
    throw err;
  }
};

// --- Service Management ---
export const getAllServices = async () => {
  try {
    const res = await axiosInstance.get("/services");
    return res.data || [];
  } catch (err) {
    if (err.response?.status === 403) {
      console.error("Access denied: You are not authorized to access services.");
      return [];
    }
    console.error("Error fetching services:", err);
    return [];
  }
};

export const deleteService = async (id) => {
  try {
    const res = await axiosInstance.delete(`/services/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting service:", err);
    throw err;
  }
};

// --- Booking Management ---
export const getAllBookings = async () => {
  try {
    const res = await axiosInstance.get("/bookings");
    return res.data || [];
  } catch (err) {
    if (err.response?.status === 403) {
      console.error("Access denied: You are not authorized to access bookings.");
      return [];
    }
    console.error("Error fetching bookings:", err);
    return [];
  }
};

export const updateBookingStatusAdmin = async (id, status) => {
  try {
    const res = await axiosInstance.put(`/bookings/${id}/status`, null, {
      params: { status },
    });
    return res.data;
  } catch (err) {
    console.error("Error updating booking status:", err);
    throw err;
  }
};

export const deleteBooking = async (id) => {
  try {
    const res = await axiosInstance.delete(`/bookings/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting booking:", err);
    throw err;
  }
};

// ========================
// Admin Review APIs
// ========================

// Get all reviews
export const getAllReviews = async () => {
  try {
    const res = await axiosInstance.get("/reviews/all");
    return res.data || [];
  } catch (err) {
    console.error("Error fetching all reviews:", err);
    return [];
  }
};

// Delete a review (admin)
export const deleteReview = async (id) => {
  try {
    const res = await axiosInstance.delete(`/reviews/admin/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting review as admin:", err);
    throw err;
  }
};




// import axiosInstance from "./axiosConfig";

// // ========================
// // Admin APIs
// // ========================

// // --- User Management ---
// export const getAllUsers = async () => {
//   try {
//     const res = await axiosInstance.get("/users");
//     return res.data || [];
//   } catch (err) {
//     if (err.response?.status === 403) {
//       console.error("Access denied: You are not authorized to access users.");
//       return [];
//     }
//     console.error("Error fetching users:", err);
//     return [];
//   }
// };

// export const deleteUser = async (id) => {
//   try {
//     const res = await axiosInstance.delete(`/users/${id}`);
//     return res.data;
//   } catch (err) {
//     console.error("Error deleting user:", err);
//     throw err;
//   }
// };

// // --- Provider Management ---
// export const getAllProviders = async () => {
//   try {
//     const res = await axiosInstance.get("users/providers");
//     return res.data || [];
//   } catch (err) {
//     if (err.response?.status === 403) {
//       console.error("Access denied: You are not authorized to access providers.");
//       return [];
//     }
//     console.error("Error fetching providers:", err);
//     return [];
//   }
// };

// export const deleteProvider = async (id) => {
//   try {
//     const res = await axiosInstance.delete(`/providers/${id}`);
//     return res.data;
//   } catch (err) {
//     console.error("Error deleting provider:", err);
//     throw err;
//   }
// };

// // --- Service Management ---
// export const getAllServices = async () => {
//   try {
//     const res = await axiosInstance.get("/services");
//     return res.data || [];
//   } catch (err) {
//     if (err.response?.status === 403) {
//       console.error("Access denied: You are not authorized to access services.");
//       return [];
//     }
//     console.error("Error fetching services:", err);
//     return [];
//   }
// };

// export const deleteService = async (id) => {
//   try {
//     const res = await axiosInstance.delete(`/services/${id}`);
//     return res.data;
//   } catch (err) {
//     console.error("Error deleting service:", err);
//     throw err;
//   }
// };

// // --- Booking Management ---
// export const getAllBookings = async () => {
//   try {
//     const res = await axiosInstance.get("/bookings");
//     return res.data || [];
//   } catch (err) {
//     if (err.response?.status === 403) {
//       console.error("Access denied: You are not authorized to access bookings.");
//       return [];
//     }
//     console.error("Error fetching bookings:", err);
//     return [];
//   }
// };

// export const updateBookingStatusAdmin = async (id, status) => {
//   try {
//     const res = await axiosInstance.put(`/bookings/${id}/status`, null, { params: { status } });
//     return res.data;
//   } catch (err) {
//     console.error("Error updating booking status:", err);
//     throw err;
//   }
// };

// export const deleteBooking = async (id) => {
//   try {
//     const res = await axiosInstance.delete(`/bookings/${id}`);
//     return res.data;
//   } catch (err) {
//     console.error("Error deleting booking:", err);
//     throw err;
//   }
// };


