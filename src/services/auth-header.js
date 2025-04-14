/**
 * Creates authorization headers for API requests with JWT token
 * @returns {Object} Headers object with Authorization if token exists
 */
export default function authHeader() {
  const token = localStorage.getItem('token');
  
  if (token) {
    return { Authorization: 'Bearer ' + token };
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
