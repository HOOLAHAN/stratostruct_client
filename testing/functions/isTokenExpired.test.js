import { isTokenExpired } from '../../src/functions/isTokenExpired';

// Helper function to create a base64 encoded string compatible with both Node.js and browser
function base64Encode(obj) {
  const encodedJson = JSON.stringify(obj);
  if (typeof window !== 'undefined' && 'btoa' in window) {
    return btoa(encodedJson).replace(/=+$/, ''); // Browser environment
  } else {
    return Buffer.from(encodedJson).toString('base64').replace(/=+$/, ''); // Node.js environment
  }
}

describe('isTokenExpired', () => {
  it('returns true for an expired token', () => {
    const header = base64Encode({ alg: "HS256", typ: "JWT" });
    const payload = base64Encode({ exp: Math.floor(Date.now() / 1000) - 3600 }); // Expired one hour ago
    const expiredToken = `${header}.${payload}.signature`;

    expect(isTokenExpired(expiredToken)).toBeTruthy();
  });

  it('returns false for a non-expired token', () => {
    const header = base64Encode({ alg: "HS256", typ: "JWT" });
    const payload = base64Encode({ exp: Math.floor(Date.now() / 1000) + 3600 }); // Expires in one hour
    const nonExpiredToken = `${header}.${payload}.signature`;

    expect(isTokenExpired(nonExpiredToken)).toBeFalsy();
  });

  it('handles invalid tokens gracefully', () => {
    const invalidToken = 'not.a.real.token';
    expect(() => isTokenExpired(invalidToken)).toThrow('Invalid token');
  });
    
});
