import { expect } from 'chai';
import { DateTime } from 'luxon';
import {
  DEFAULT_TIMEZONE,
  getOffsetFromISO,
  getTimezoneShortOffset,
  getTimezoneTechieOffset,
  isValidIsoDateWithTimezone,
  timestampIsMs,
  timestampIsSec,
} from '../../src';

describe('utils', () => {
  describe('getTimezoneShortOffset', () => {
    it('should return the short offset format', () => {
      const date = DateTime.fromISO('2022-01-01T00:00:00-06:00');
      if (!date.isValid) throw new Error('Test setup failed');
      const offset = getTimezoneShortOffset(date);
      expect(offset).to.match(/^[+-]\d{2}:\d{2}$/); // Format: +HH:MM or -HH:MM
    });

    it('should return current timezone offset when no date provided', () => {
      const offset = getTimezoneShortOffset();
      expect(offset).to.match(/^[+-]\d{2}:\d{2}$/);
    });
  });

  describe('getTimezoneTechieOffset', () => {
    it('should return the techie offset format', () => {
      const date = DateTime.fromISO('2022-01-01T00:00:00-06:00');
      if (!date.isValid) throw new Error('Test setup failed');
      const offset = getTimezoneTechieOffset(date);
      expect(offset).to.match(/^[+-]\d{4}$/); // Format: +HHMM or -HHMM
    });

    it('should return current timezone techie offset when no date provided', () => {
      const offset = getTimezoneTechieOffset();
      expect(offset).to.match(/^[+-]\d{4}$/);
    });
  });

  describe('isValidIsoDateWithTimezone', () => {
    it('should return true for valid ISO date with timezone offset', () => {
      expect(isValidIsoDateWithTimezone('2022-01-01T00:00:00-06:00')).to.be
        .true;
    });

    it('should return true for valid ISO date with Z timezone', () => {
      expect(isValidIsoDateWithTimezone('2022-01-01T00:00:00Z')).to.be.true;
    });

    it('should return true for valid ISO date with positive offset', () => {
      expect(isValidIsoDateWithTimezone('2022-01-01T00:00:00+05:30')).to.be
        .true;
    });

    it('should return false for ISO date without timezone', () => {
      expect(isValidIsoDateWithTimezone('2022-01-01T00:00:00')).to.be.false;
    });

    it('should return false for invalid ISO date format', () => {
      expect(isValidIsoDateWithTimezone('2022-01-01X00:00:00-06:00')).to.be
        .false;
    });

    it('should return false for completely invalid date string', () => {
      expect(isValidIsoDateWithTimezone('invalid-date')).to.be.false;
    });

    it('should return false for date without T separator', () => {
      expect(isValidIsoDateWithTimezone('2022-01-01 00:00:00-06:00')).to.be
        .false;
    });
  });

  describe('getOffsetFromISO', () => {
    it('should return the offset from ISO string with negative offset', () => {
      expect(getOffsetFromISO('2022-01-01T00:00:00-06:00')).to.equal('-06:00');
    });

    it('should return the offset from ISO string with positive offset', () => {
      expect(getOffsetFromISO('2022-01-01T00:00:00+05:30')).to.equal('+05:30');
    });

    it('should return +00:00 for Z timezone', () => {
      expect(getOffsetFromISO('2022-01-01T00:00:00Z')).to.equal('+00:00');
    });

    it('should return null when no offset found', () => {
      expect(getOffsetFromISO('2022-01-01T00:00:00')).to.be.null;
    });

    it('should return null for invalid format', () => {
      expect(getOffsetFromISO('2022-01-01T00:00:00-0600')).to.be.null;
    });
  });

  describe('timestampIsSec', () => {
    it('should return true for valid second timestamp', () => {
      expect(timestampIsSec(1640995200)).to.be.true; // 2022-01-01T00:00:00Z
    });

    it('should return false for millisecond timestamp', () => {
      expect(timestampIsSec(1640995200000)).to.be.false;
    });

    it('should return false for negative timestamp', () => {
      expect(timestampIsSec(-1)).to.be.false;
    });

    it('should return false for floating point number', () => {
      expect(timestampIsSec(1640995200.5)).to.be.false;
    });

    it('should return false for timestamp too large', () => {
      expect(timestampIsSec(1e10)).to.be.false;
    });

    it('should return false for timestamp too small', () => {
      expect(timestampIsSec(1e8)).to.be.false;
    });

    it('should return true for minimum valid timestamp', () => {
      expect(timestampIsSec(1e9)).to.be.true;
    });

    it('should return true for maximum valid timestamp', () => {
      expect(timestampIsSec(1e10 - 1)).to.be.true;
    });
  });

  describe('timestampIsMs', () => {
    const nowMs = Date.now();

    it('should return true for valid millisecond timestamp', () => {
      expect(timestampIsMs(nowMs)).to.be.true;
    });

    it('should return false for second timestamp', () => {
      const secondTimestamp = 1640995200; // This is clearly in seconds range
      expect(timestampIsMs(secondTimestamp)).to.be.false;
    });

    it('should return false for negative timestamp', () => {
      expect(timestampIsMs(-1)).to.be.false;
    });

    it('should return false for floating point number', () => {
      expect(timestampIsMs(nowMs + 0.5)).to.be.false;
    });

    it('should return false for timestamp too large', () => {
      expect(timestampIsMs(1e13)).to.be.false;
    });

    it('should return false for timestamp too small', () => {
      expect(timestampIsMs(1e11)).to.be.false;
    });

    it('should return true for minimum valid timestamp', () => {
      expect(timestampIsMs(1e12)).to.be.true;
    });

    it('should return true for maximum valid timestamp', () => {
      expect(timestampIsMs(1e13 - 1)).to.be.true;
    });
  });

  describe('DEFAULT_TIMEZONE', () => {
    it('should be a valid timezone string', () => {
      expect(DEFAULT_TIMEZONE).to.be.a('string');
      expect(DEFAULT_TIMEZONE.length).to.be.greaterThan(0);
      // Should match timezone format like "America/New_York" or "UTC"
      expect(DEFAULT_TIMEZONE).to.match(/^[A-Za-z_]+\/[A-Za-z_]+$|^UTC$/);
    });

    it('should be the system default timezone', () => {
      const expected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      expect(DEFAULT_TIMEZONE).to.equal(expected);
    });
  });
});
