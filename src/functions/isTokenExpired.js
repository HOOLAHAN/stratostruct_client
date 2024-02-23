function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      throw new Error('Invalid token'); // Token doesn't have the correct structure
    }
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString();
    return JSON.parse(jsonPayload);
  } catch (error) {
    // Catch parsing errors and throw a new error indicating the token is invalid
    throw new Error('Invalid token');
  }
}

// Check if the token is expired
export function isTokenExpired(token) {
  const { exp } = parseJwt(token);
  const currentTime = Date.now() / 1000; // Convert to seconds
  return exp < currentTime;
}
