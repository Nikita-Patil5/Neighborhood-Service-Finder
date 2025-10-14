
import axios from './axiosConfig'; 

// Function to get the auth token from localStorage
const getToken = () => localStorage.getItem("token");

// --- Services ---
export const getAllServices = async () => {
  const token = getToken();
  const response = await axios.get("/services");
  return response.data;
};

// --- Bookings ---
export const getMyBookings = async () => {
  const token = getToken();
  const response = await axios.get("/bookings/my", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createBooking = async (bookingData) => {
  const token = getToken();
  const response = await axios.post("/bookings", bookingData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const token = getToken();
  const response = await axios.put(`/bookings/${bookingId}/cancel`, {}, { // Empty body for PUT
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserReviews = async () => {
  const token = getToken();
  const response = await axios.get("/reviews/my", { // Corresponds to GET /api/reviews/my
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Updated: Add a new review
export const addReview = async (reviewData) => {
  const token = getToken();
  const response = await axios.post("/reviews", reviewData, { // Corresponds to POST /api/reviews
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const updateReview = async (reviewId, reviewData) => {
  const token = getToken();

  // Only send fields backend expects
  const dataToSend = {
    rating: reviewData.rating,
    comment: reviewData.comment,
  };

  const response = await axios.put(`/reviews/${reviewId}`, dataToSend, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};



// Updated: Delete a review
export const deleteReview = async (reviewId) => {
  const token = getToken();
  const response = await axios.delete(`/reviews/${reviewId}`, { 
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const getReviewsForService = async (serviceId) => {
  const token = getToken(); 
  const response = await axios.get(`/reviews/service/${serviceId}`, {
    headers: { Authorization: `Bearer ${token}` }, 
  });
  return response.data;
};






