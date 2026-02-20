import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  saveToLocalStorage, 
  loadFromLocalStorage, 
  clearLocalStorage 
} from '../utils/storage';
import { hashPassword, verifyPassword, generateToken } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const storedUser = loadFromLocalStorage('user');
    const token = loadFromLocalStorage('token');
    
    if (storedUser && token) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const users = loadFromLocalStorage('users') || [];
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);
      
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        theme: 'light'
      };

      // Save user
      users.push(newUser);
      saveToLocalStorage('users', users);

      // Auto login after registration
      const token = generateToken(newUser);
      saveToLocalStorage('token', token);
      saveToLocalStorage('user', newUser);
      setUser(newUser);

      toast.success('Registration successful!');
      navigate('/');
      
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const users = loadFromLocalStorage('users') || [];
      const user = users.find(u => u.email === email);
      
      if (!user) {
        throw new Error('User not found');
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        throw new Error('Invalid password');
      }

      const token = generateToken(user);
      saveToLocalStorage('token', token);
      saveToLocalStorage('user', user);
      setUser(user);

      toast.success('Login successful!');
      navigate('/');
      
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    clearLocalStorage();
    setUser(null);
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const updateProfile = (updates) => {
    try {
      const users = loadFromLocalStorage('users') || [];
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, ...updates } : u
      );
      
      const updatedUser = { ...user, ...updates };
      
      saveToLocalStorage('users', updatedUsers);
      saveToLocalStorage('user', updatedUser);
      setUser(updatedUser);

      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      toast.error('Failed to update profile');
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
