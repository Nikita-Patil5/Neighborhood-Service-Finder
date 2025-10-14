// // src/pages/StatusUpdate.jsx
// import React, { useEffect, useState } from 'react';
// import BookingCard from '../components/BookingCard';
// import { userApi } from '../api/userApi'; // Assuming this will fetch user-specific bookings
// import Sidebar from '../components/Sidebar'; // Assuming a user context, so sidebar is useful

// const StatusUpdate = () => {
//   const [userBookings, setUserBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // In a real app, you'd get the current user's ID/token from context/localStorage
//   // For now, we'll fetch all dummy bookings and assume some belong to the current user.
//   // This will need to be refined with actual user authentication.
//   const currentUserId = 'u1'; // Dummy user ID for demonstration

//   useEffect(() => {
//     const fetchUserBookings = async () => {
//       try {
//         setLoading(true);
//         // This should be userApi.getUserBookings(currentUserId) in a real app
//         // For now, let's filter from all bookings (if getAllBookings returns user info)
//         const allBookings = await userApi.getAllBookings(); // This dummy returns list of bookings
//         // Filter bookings that match a dummy customer name for demo purposes
//         const filteredBookings = allBookings.filter(
//             booking => booking.customer === 'Alice Smith' // Match dummy data
//         );
//         setUserBookings(filteredBookings);
//       } catch (err) {
//         setError('Failed to fetch booking statuses.');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserBookings();
//   }, []);

//   return (
//     <div className="dashboard-container"> {/* Reusing dashboard-container for layout consistency */}
//       <Sidebar role="USER" /> {/* Assuming this page is primarily for a USER to check their statuses */}
//       <div className="dashboard-content">
//         <h2>Your Booking Statuses</h2>

//         {loading && <p>Loading your booking updates...</p>}
//         {error && <p className="error-message">{error}</p>}
//         {!loading && userBookings.length === 0 && <p>You have no active bookings to display.</p>}

//         <div className="card-list">
//           {userBookings.map(booking => (
//             <BookingCard key={booking.id} booking={booking} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StatusUpdate;