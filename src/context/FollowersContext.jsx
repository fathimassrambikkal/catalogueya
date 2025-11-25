import React, { createContext, useContext, useState, useEffect } from 'react';

const FollowersContext = createContext();

export const useFollowers = () => {
  const context = useContext(FollowersContext);
  if (!context) {
    throw new Error('useFollowers must be used within a FollowersProvider');
  }
  return context;
};

export const FollowersProvider = ({ children }) => {
  const [followers, setFollowers] = useState([]);

  // Load followers from localStorage on mount
  useEffect(() => {
    const savedFollowers = localStorage.getItem('company_followers');
    if (savedFollowers) {
      setFollowers(JSON.parse(savedFollowers));
    }
  }, []);

  // Save to localStorage whenever followers changes
  useEffect(() => {
    localStorage.setItem('company_followers', JSON.stringify(followers));
  }, [followers]);

  const addFollower = (customer) => {
    setFollowers(prev => {
      const isAlreadyFollowing = prev.some(f => f.id === customer.id);
      if (!isAlreadyFollowing) {
        return [...prev, { 
          id: customer.id,
          name: customer.name,
          email: customer.email,
          avatar: customer.avatar,
          followedAt: new Date().toISOString()
        }];
      }
      return prev;
    });
  };

  const removeFollower = (customerId) => {
    setFollowers(prev => prev.filter(f => f.id !== customerId));
  };

  const getFollowersCount = () => followers.length;

  // Simulate adding followers (you'll call this from CompanyPage)
  const simulateCustomerFollow = (companyId, customerData) => {
    // In real app, this would be handled by backend
    // For demo, we'll add mock followers
    if (companyId === "current-company-id") { // Replace with actual company ID
      addFollower(customerData);
    }
  };

  return (
    <FollowersContext.Provider value={{
      followers,
      addFollower,
      removeFollower,
      getFollowersCount,
      simulateCustomerFollow
    }}>
      {children}
    </FollowersContext.Provider>
  );
};