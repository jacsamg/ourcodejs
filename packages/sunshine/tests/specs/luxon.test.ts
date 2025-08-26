import { expect } from 'chai';
import { getLuxonGlobalTimezone, setLuxonGlobalTimezone } from '../../src';

const JUAREZ_TIMEZONE = 'America/Ciudad_Juarez';
const DENVER_TIMEZONE = 'America/Denver';

describe('luxon', () => {
  describe('setLuxonGlobalTimezone', () => {
    it('should set custom timezone', () => {
      const result = setLuxonGlobalTimezone(JUAREZ_TIMEZONE);
      expect(result.name).to.equal(JUAREZ_TIMEZONE);
      expect(getLuxonGlobalTimezone().name).to.equal(JUAREZ_TIMEZONE);
    });

    it('should set fallback timezone when invalid timezone provided', () => {
      const result = setLuxonGlobalTimezone('zone/invalid', DENVER_TIMEZONE);
      expect(result.name).to.equal(DENVER_TIMEZONE);
      expect(getLuxonGlobalTimezone().name).to.equal(DENVER_TIMEZONE);
    });
  });

  describe('getLuxonGlobalTimezone', () => {
    it('should return the current global timezone', () => {
      setLuxonGlobalTimezone(JUAREZ_TIMEZONE);
      const timezone = getLuxonGlobalTimezone();
      expect(timezone.name).to.equal(JUAREZ_TIMEZONE);
    });
  });
});
