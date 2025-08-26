import { Settings } from 'luxon';

export { DEFAULT_TIMEZONE } from './data/data.js';
export {
  getLuxonGlobalTimezone,
  setLuxonGlobalTimezone,
} from './lib/luxon.js';

export {
  getOffsetFromISO,
  getTimezoneShortOffset,
  getTimezoneTechieOffset,
  isValidIsoDateWithTimezone,
  timestampIsMs,
  timestampIsSec,
} from './lib/utilities.js';

// GLOBAL LUXON SETTINGS
Settings.throwOnInvalid = true;
