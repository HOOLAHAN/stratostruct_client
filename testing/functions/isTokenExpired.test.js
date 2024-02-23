import { isTokenExpired } from '../../src/functions/isTokenExpired';

describe('isTokenExpired', () => {
  it('returns true for an expired token', () => {
    // Mock an expired token
    const payload = { exp: Math.floor(Date.now() / 1000) - 3600 }; // Past expiration
    const expiredToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(JSON.stringify(payload)).toString('base64')}.signature`;
    expect(isTokenExpired(expiredToken)).toBeTruthy();
  });

  it('returns false for a non-expired token', () => {
    // Mock a valid, non-expired token
    const payload = { exp: Math.floor(Date.now() / 1000) + 3600 }; // Future expiration
    const nonExpiredToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(JSON.stringify(payload)).toString('base64')}.signature`;
    expect(isTokenExpired(nonExpiredToken)).toBeFalsy();
  });

  it('handles invalid tokens gracefully', () => {
    const invalidToken = 'not.a.real.token';
    expect(() => isTokenExpired(invalidToken)).toThrow('Invalid token');
  });
  
});
