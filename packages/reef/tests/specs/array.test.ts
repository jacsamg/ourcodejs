import { expect } from 'chai';
import {
  removeIndexFromArray,
  shuffleArray,
  reverseFilter
} from '../../src/lib/array';

describe('array', () => {
  describe('removeIndexFromArray', () => {
    it('Should remove item from array by index', () => {
      const array = [1, 2, 3, 4, 5];
      const result = removeIndexFromArray(array, 2);

      expect(result).to.deep.equal([1, 2, 4, 5]);
    });
  });

  describe('shuffleArray', () => {
    it('Should shuffle array and return reference to the same array', () => {
      const array = [1, 2, 3, 4, 5];
      const result = shuffleArray(array);

      expect(array).to.deep.equal(result);
      expect(result).to.not.deep.equal([1, 2, 3, 4, 5]);
    });
  });

  describe('reverseFilter', () => {
    it('Should reverse filter array', () => {
      const isEven = (value: number) => value % 2 === 0;
      const result = reverseFilter([1, 2, 3, 4, 5], isEven);

      expect(result).to.deep.equal([4, 2]);
    });
  });
});
