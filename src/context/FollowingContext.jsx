import React, { createContext, useContext, useState, useEffect } from 'react';

const FollowingContext = createContext();

export const useFollowing = () => {
  const context = useContext(FollowingContext);
  if (!context) {
    throw new Error('useFollowing must be used within a FollowingProvider');
  }
  return context;
};

export const FollowingProvider = ({ children }) => {
  const [following, setFollowing] = useState([]);

  // Load following from localStorage on mount
  useEffect(() => {
    const savedFollowing = localStorage.getItem('user_following');
    if (savedFollowing) {
      setFollowing(JSON.parse(savedFollowing));
    }
  }, []);

  // Save to localStorage whenever following changes
  useEffect(() => {
    localStorage.setItem('user_following', JSON.stringify(following));
  }, [following]);

  const toggleFollow = (company) => {
    setFollowing(prev => {
      const isAlreadyFollowing = prev.some(f => f.id === company.id);
      if (isAlreadyFollowing) {
        return prev.filter(f => f.id !== company.id);
      } else {
        return [...prev, { 
          id: company.id,
          name: company.name,
          logo: company.logo,
          title: company.title,
          rating: company.rating,
          phone: company.phone,
          location: company.location,
          followedAt: new Date().toISOString()
        }];
      }
    });
  };

  const isFollowing = (companyId) => {
    return following.some(f => f.id === companyId);
  };

  const getFollowingCount = () => following.length;

  return (
    <FollowingContext.Provider value={{
      following,
      toggleFollow,
      isFollowing,
      getFollowingCount
    }}>
      {children}
    </FollowingContext.Provider>
  );
};