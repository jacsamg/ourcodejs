import { expect } from 'chai';
import { getRandomIntInclusive, padStartWithZeros } from '../../src/number';

describe('number', () => {
  describe('getRandomIntInclusive', () => {
    it('should return a random number between min and max', () => {
      const result = getRandomIntInclusive(1, 10);

      expect(result).to.be.within(1, 10);
    });
  });

  describe('padStartWithZeros', () => {
    it('should return a string with the specified number of pads', () => {
      const result = padStartWithZeros(123, 5);

      expect(result).to.equal('00123');
    });
  });
});