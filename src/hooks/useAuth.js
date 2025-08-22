"use client";

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    setUser(session?.user || null);
  }, [session]);
  
  const logout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const updateUser = async (updatedUserData) => {
    setUser(prev => ({ ...prev, ...updatedUserData }));
    await update({ ...session, user: { ...session?.user, ...updatedUserData } });
  };

  return {
    user,
    loading: status === 'loading',
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };
};