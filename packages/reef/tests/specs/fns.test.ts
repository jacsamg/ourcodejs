import { expect } from 'chai';
import { isAsyncFn } from '../../src/fns';

describe('fns', () => {
  describe('isAsyncFn', () => {
    it('should return true for async function', () => {
      const fn = async () => { };

      expect(isAsyncFn(fn)).to.be.true;
    });

    it('should return false for sync function', () => {
      const fn = () => { };

      expect(isAsyncFn(fn)).to.be.false;
    });
  });
});