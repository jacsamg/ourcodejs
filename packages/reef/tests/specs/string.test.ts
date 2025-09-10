import { expect } from 'chai';
import {
  capitalizeWords,
  naturalSort,
  getRandomCharset,
  getConvenientStringFormat,
  getOnlyAlphaNumeric,
  checkEmail,
  toBase64InBrowser,
  fromBase64InBrowser
} from '../../src/lib/string';
import { helloWorldInBase64 } from '../utils/data';

describe('string', () => {
  describe('capitalizeWords', () => {
    it('should capitalize words', () => {
      const result = capitalizeWords('hello world');
      expect(result).to.equal('Hello World');
    });
  });

  describe('naturalSort', () => {
    it('should sort naturally (alphanumeric)', () => {
      const result = ['a', 'c', 'b'].sort(naturalSort);
      expect(result).to.deep.equal(['a', 'b', 'c']);
    });
  });

  describe('getRandomCharset', () => {
    it('should return a random string of the specified size', () => {
      const result = getRandomCharset(10);
      expect(result).to.have.lengthOf(10);
    });
  });

  describe('getConvenientStringFormat', () => {
    it('should trim whitespace, convert to lowercase, remove accents and diacritics', () => {
      const result = getConvenientStringFormat(' ABCáéíóúÑ ');
      expect(result).to.equal('abcaeioun');
    });
  });

  describe('getOnlyAlphaNumeric', () => {
    it('should remove all non-alphanumeric characters', () => {
      const result = getOnlyAlphaNumeric('hello world @#');
      expect(result).to.equal('hello world ');
    });

    it('should remove all non-alphanumeric and whitespace characters', () => {
      const result = getOnlyAlphaNumeric('hello world @#', false, true, true);
      expect(result).to.equal('helloworld');
    });

    it('should remove all non-alphanumeric, hyphen and underscore characters', () => {
      const result = getOnlyAlphaNumeric('_hello-world', true, false, false);
      expect(result).to.equal('helloworld');
    });
  });

  describe('checkEmail', () => {
    it('should return true for valid email', () => {
      const result = checkEmail('test@example.com');
      expect(result).to.be.true;
    });

    it('should return false for invalid email', () => {
      const result = checkEmail('test@example');
      expect(result).to.be.false;
    });
  });

  describe('toBase64InBrowser', () => {
    it('should convert string to base64', () => {
      const result = toBase64InBrowser('hello world');
      expect(result).to.equal(helloWorldInBase64);
    });
  });

  describe('fromBase64InBrowser', () => {
    it('should convert base64 to string', () => {
      const result = fromBase64InBrowser(helloWorldInBase64);
      expect(result).to.equal('hello world');
    });
  });
});
