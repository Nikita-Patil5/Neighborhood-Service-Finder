import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ role }) => {
  // Only render sidebar if a role is provided (i.e., user is logged in)
  if (!role) {
    return null;
  }

  return (
    <aside className="sidebar">
      <h3>Dashboard Menu</h3>
      <ul>
        {role === 'USER' && (
          <>
            <li><Link to="/user">My Bookings</Link></li>
            <li><Link to="/user/profile">Profile</Link></li>
            <li><Link to="/user/settings">Settings</Link></li>
          </>
        )}
        {role === 'PROVIDER' && (
          <>
            <li><Link to="/provider">My Services</Link></li>
            <li><Link to="/provider/bookings">Manage Bookings</Link></li>
            <li><Link to="/provider/profile">Profile</Link></li>
          </>
        )}
        {role === 'ADMIN' && (
          <>
            <li><Link to="/admin">Manage Users</Link></li>
            <li><Link to="/admin/services">Manage Services</Link></li>
            <li><Link to="/admin/bookings">View All Bookings</Link></li>
          </>
        )}
        {/* Common links for all logged-in roles can go here */}
      </ul>
    </aside>
  );
};

export default Sidebar;