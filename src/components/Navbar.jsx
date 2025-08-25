import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { account } from '../config/Appwrite';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    // Prevent multiple auth checks
    if (hasCheckedAuth.current) return;
    
    const checkAuth = async () => {
      try {
        hasCheckedAuth.current = true;
        const userData = await account.get();
        setIsAuthenticated(true);
        setUserInfo(userData);
      } catch (error) {
        // Only log once to avoid spam
        if (!hasCheckedAuth.current) {
          console.log('User not authenticated in Navbar');
        }
        setIsAuthenticated(false);
        setUserInfo(null);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSessions();
      setIsAuthenticated(false);
      setUserInfo(null);
      navigate('/auth');
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  return (
    <nav className="w-full px-6 py-3 flex justify-between items-center border-b-2 border-dashed border-black">
      <h1 className="text-2xl font-semibold">
        <Link to="/dashboard" className="no-underline text-black">Chanakya AI</Link>
      </h1>

      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <>
            <span className="text-sm text-gray-600">
              Welcome, {userInfo?.name || 'User'}
            </span>
            <Link
              to="/userprofile"
              className="px-4 py-2 bg-gray-100 text-black rounded hover:bg-gray-200 no-underline"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            className="px-4 py-2 bg-black text-white rounded hover:opacity-90 no-underline"
          >
            Get Started
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar