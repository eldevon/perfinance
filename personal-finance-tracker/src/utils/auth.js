import bcrypt from 'bcryptjs';

// Mock JWT for local storage (in production, use real JWT)
export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name
  };
  return btoa(JSON.stringify(payload)); // Simple base64 encoding for demo
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token));
  } catch (error) {
    return null;
  }
};

export const isTokenValid = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return false;
  
  // Check if token is expired (24 hours)
  const issuedAt = decoded.iat || 0;
  const now = Math.floor(Date.now() / 1000);
  return (now - issuedAt) < 24 * 60 * 60;
};
