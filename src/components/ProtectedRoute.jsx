import React, { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { account } from '../config/Appwrite';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    // Prevent multiple auth checks
    if (hasCheckedAuth.current) return;
    
    const checkAuth = async () => {
      try {
        hasCheckedAuth.current = true;
        const userData = await account.get();
        console.log('User authenticated:', userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.log('User not authenticated, redirecting to login');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Prevent unnecessary re-renders
  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
