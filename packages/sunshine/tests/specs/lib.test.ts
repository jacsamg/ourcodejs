import { expect } from 'chai';
import { getSunshineGlobalTimezone, sunshineDateTime } from '../../src';
import { setSunshineDefaultZone } from '../../src/lib/sunshine';

const JUAREZ_TIMEZONE = 'America/Ciudad_Juarez';
const DENVER_TIMEZONE = 'America/Denver';

describe('lib', () => {
  describe('setSunshineDefaultZone', () => {
    it('should set custom timezone', () => {
      setSunshineDefaultZone(JUAREZ_TIMEZONE);
      expect(getSunshineGlobalTimezone()).to.equal(JUAREZ_TIMEZONE);
    });

    it('should set fallback timezone', () => {
      setSunshineDefaultZone('zone/invalid', DENVER_TIMEZONE);
      expect(getSunshineGlobalTimezone()).to.equal(DENVER_TIMEZONE);
    });
  });

  describe('getSunshineGlobalTimezone', () => {
    it('should return the default timezone', () => {
      setSunshineDefaultZone(JUAREZ_TIMEZONE);
      expect(getSunshineGlobalTimezone()).to.equal(JUAREZ_TIMEZONE);
    });
  });

  describe('sunshineDateTime', () => {
    it('should return a DateTime object with the specified timezone', () => {
      setSunshineDefaultZone(JUAREZ_TIMEZONE);
      expect(sunshineDateTime().zoneName).to.equal(JUAREZ_TIMEZONE);
    });
  });
});
