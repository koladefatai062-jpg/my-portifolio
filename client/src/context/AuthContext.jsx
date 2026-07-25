import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('rogue_token'));
  const [email, setEmail] = useState(localStorage.getItem('rogue_admin'));

  const login = (newToken, adminEmail) => {
    localStorage.setItem('rogue_token', newToken);
    localStorage.setItem('rogue_admin', adminEmail);
    setToken(newToken);
    setEmail(adminEmail);
  };

  const logout = () => {
    localStorage.removeItem('rogue_token');
    localStorage.removeItem('rogue_admin');
    setToken(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ token, email, isAuth: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
