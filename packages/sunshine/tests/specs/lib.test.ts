import { expect } from 'chai';
import {
  SunshineDateTime,
  getGlobalTimezone,
  luxonDateTime,
  setGlobalTimezone
} from '../../src/lib';
import { DENVER_TIMEZONE, JUAREZ_TIMEZONE } from '../../src/data';

describe('lib', () => {
  describe('setGlobalTimezone', () => {
    it('should set custom timezone', () => {
      setGlobalTimezone(JUAREZ_TIMEZONE);
      expect(getGlobalTimezone().name).to.equal(JUAREZ_TIMEZONE);
    });

    it('should set fallback timezone', () => {
      setGlobalTimezone('zone/invalid', DENVER_TIMEZONE);
      expect(getGlobalTimezone().name).to.equal(DENVER_TIMEZONE);
    });
  });

  describe('getGlobalTimezone', () => {
    it('should return the default timezone', () => {
      setGlobalTimezone(JUAREZ_TIMEZONE);
      expect(getGlobalTimezone().name).to.equal(JUAREZ_TIMEZONE);
    });
  });

  describe('luxonDateTime', () => {
    it('should return the DateTime instance', () => {
      const DateTime = luxonDateTime();
      const date = DateTime.now().day;
      const nowDay = new Date().getDate();

      expect(date).to.be.a('number');
      expect(date).to.equal(nowDay);
    });
  });

  describe('SunshineDateTime', () => {
    it('should return a DateTime object with the specified timezone', () => {
      setGlobalTimezone(JUAREZ_TIMEZONE);
      expect(SunshineDateTime().zoneName).to.equal(JUAREZ_TIMEZONE);
    });
  });
});