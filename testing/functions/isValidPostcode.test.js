import { isValidPostcode } from '../../src/functions/isValidPostcode';

describe('Postcode validation', () => {
  test('Validates correct postcode format', () => {
    expect(isValidPostcode('GIR 0AA')).toBeTruthy();
    expect(isValidPostcode('EC1A 1BB')).toBeTruthy();
  });

  test('Validates if postcode has no space or if letters are lower case', () => {
    expect(isValidPostcode('EC1A1BB')).toBeTruthy();
    expect(isValidPostcode('ec1a1bb')).toBeTruthy();
  });

  test('Returns false for incorrect postcode format', () => {
    expect(isValidPostcode('12345')).toBeFalsy();
    expect(isValidPostcode('ABCDE')).toBeFalsy();
  });

  test('Handles edge cases and unusual inputs', () => {
    expect(isValidPostcode('')).toBeFalsy();
    expect(isValidPostcode(' ')).toBeFalsy();
  });

});
