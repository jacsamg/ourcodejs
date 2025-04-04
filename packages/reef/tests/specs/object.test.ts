import { expect } from 'chai';
import { objectDeepAssign } from '../../src/object';

describe('object', () => {
  describe('objectDeepAssign', () => {
    it('should assign properties from source to target', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      const result = objectDeepAssign(target, source);

      expect(result).to.deep.equal({ a: 1, b: 3, c: 4 });
    });
  });
});