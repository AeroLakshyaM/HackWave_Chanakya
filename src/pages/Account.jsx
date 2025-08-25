import React, { useEffect, useState, useRef } from 'react'
import { account } from '../config/Appwrite'
import { useNavigate } from 'react-router-dom'

const Account = () => {
  const [userinfo, setUserinfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasCheckedAuth = useRef(false);
  const navigate = useNavigate();

  // APPWRITE CONFIGURATION
  useEffect(() => {
    // Prevent multiple auth checks
    if (hasCheckedAuth.current) return;
    
    const getUserData = async () => {
      try {
        hasCheckedAuth.current = true;
        const userData = await account.get();
        setUserinfo(userData);
      } catch (error) {
        console.log('User not authenticated, redirecting to auth');
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div>Account</div>
      {
        userinfo ? (
          <>
            <i>{userinfo.name}</i>
            <br />
            <i>{userinfo.email}</i>
          </>
        ) : (
          <i>User info not available</i>
        )
      }
    </>
  )
}

export default Account;