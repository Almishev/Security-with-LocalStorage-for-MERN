
export const setToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  

  export const removeToken = () => {
    localStorage.removeItem('token');
  };
  
  
  export const isAuthenticated = () => {
    return !!getToken();
  };

  
export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.role || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

  export const isAdmin = () => {
    return getUserRole() === 'admin';
  };
