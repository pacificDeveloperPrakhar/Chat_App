import { useSelector } from 'react-redux';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function ProtectedRoute() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const isAllowed = user?.is_verified; // Check if user exists and is verified

  useEffect(() => {
    // If the user is verified, redirect them to the chat
    if (isAllowed) {
      navigate('chat');
    }
  }, [isAllowed, navigate]);

  // If the user is verified, render the outlet, otherwise navigate to login form
  return isAllowed ? <Outlet /> : <Navigate to="/form" />;
}
