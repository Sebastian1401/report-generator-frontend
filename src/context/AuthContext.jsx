import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    console.log(`[AuthContext] Attempting login for user: ${username}`);
    
    // Mock authentication logic for RBAC (Role-Based Access Control)
    if (username === 'admin' && password === 'admin') {
      const userData = { username: 'admin', role: 'admin' };
      setUser(userData);
      console.log('[AuthContext] Login successful. Assigned role:', userData.role);
      return true;
    } 
    
    if (username === 'tech' && password === 'tech') {
      const userData = { username: 'tech', role: 'tech' };
      setUser(userData);
      console.log('[AuthContext] Login successful. Assigned role:', userData.role);
      return true;
    }

    console.warn('[AuthContext] Login failed: Invalid credentials provided.');
    return false;
  };

  const logout = () => {
    console.log(`[AuthContext] User logged out: ${user?.username}`);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);