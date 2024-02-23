function parseJwt(token) {
  try {
    if (!token || token.split('.').length !== 3) {
      throw new Error('Invalid token');
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload;
    if (typeof window !== 'undefined' && 'atob' in window) {
      jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } else {
      jsonPayload = Buffer.from(base64, 'base64').toString();
    }
    return JSON.parse(jsonPayload);
  } catch (error) {
    throw new Error('Invalid token');
  }
}


// Check if the token is expired
export function isTokenExpired(token) {
  try {
    const { exp } = parseJwt(token);
    const currentTime = Date.now() / 1000;
    return exp < currentTime;
  } catch (error) {
    console.log('Error:', error.message)
    throw error; // Re-throw to ensure it's caught by tests or calling code
  }
}
