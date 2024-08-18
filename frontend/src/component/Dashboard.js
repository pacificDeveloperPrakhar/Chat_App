import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const Dashboard = () => {
  const user=useSelector(state=>state.user.user)

  // You can also fetch the user data dynamically here
  useEffect(() => {
    // Mock fetching user data from backend
    
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">User Dashboard</h2>
        <div className="space-y-4">
          {/* Profile Image or First Letter */}
          <div className="flex justify-center">
            {user.profileUrl ? (
              <img
                src={user.profileUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="text-center">
            <p className="text-xl font-semibold">{user.username}</p>
            <p className="text-gray-600">{user.email}</p>
            <p
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                user.is_verified ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
              }`}
            >
              {user.is_verified ? "Verified" : "Not Verified"}
            </p>
            <p className="mt-2 text-gray-600">
              Status:{" "}
              <span
                className={`${
                  user.userStatus === "inactive"
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {user.userStatus}
              </span>
            </p>
            <p className="mt-2 text-gray-600">
              Created at: {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              Updated at: {new Date(user.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
