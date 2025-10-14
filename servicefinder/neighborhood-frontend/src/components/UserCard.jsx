import React from 'react';

const UserCard = ({ user }) => {
  return (
    <div className="card user-card">
      <h3>{user.name}</h3>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      {/* Add more user details as needed */}
    </div>
  );
};

export default UserCard;