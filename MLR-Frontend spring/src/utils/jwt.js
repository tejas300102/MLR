export const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

export const getUserRole = (token) => {
  try {
    const decoded = decodeToken(token);
    return decoded?.role || 
           decoded?.Role || 
           decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
           null;
  } catch (error) {
    return null;
  }
};

export const getUserId = (token) => {
  try {
    const decoded = decodeToken(token);
    return decoded?.sub || decoded?.userId || decoded?.id || null;
  } catch (error) {
    return null;
  }
};