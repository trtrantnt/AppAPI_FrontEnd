/**
 * Creates authorization headers for API requests with JWT token
 * @returns {Object} Headers object with Authorization if token exists
 */
export default function authHeader() {
  const token = localStorage.getItem('token');
  
  if (token) {
    // Basic validation - check if token has JWT format (header.payload.signature)
    if (token.split('.').length !== 3) {
      console.error('Invalid token format detected');
      // Clear invalid token to prevent repeated failed requests
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {};
    }
    
    try {
      // Check if token is expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      
      if (Date.now() >= expiry) {
        console.warn('Token has expired');
        // We could trigger a refresh token flow here
        // but for now just return empty headers
        return {};
      }
      
      // Token seems valid, return the Authorization header
      return { 'Authorization': `Bearer ${token}` };
    } catch (error) {
      console.error('Error processing token:', error);
      return {};
    }
  } else {
    return {};
  }
}

/**
 * Helper function to check if current token is valid
 * Can be used by other services to pre-check auth status
 * @returns {boolean} True if token exists and is valid
 */
export function hasValidToken() {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() < payload.exp * 1000;
  } catch {
    return false;
  }
}
