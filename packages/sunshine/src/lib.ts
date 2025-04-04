import { DateTime, IANAZone, Settings, Zone } from 'luxon';
import { Valid } from 'luxon/src/_util.js';
import { SunshineFalsyDateType, ShunshineValidDateType } from './types.js';
import { timestampIsMs, timestampIsSec } from './utils.js';
import { DEFAULT_TIMEZONE } from './data.js';

Settings.throwOnInvalid = true;

export function setGlobalTimezone(primary: string, fallback = DEFAULT_TIMEZONE) {
  Settings.defaultZone = IANAZone.isValidZone(primary) ? primary : fallback;
}

export function getGlobalTimezone(): Zone<true | false> {
  return Settings.defaultZone;
}

export function luxonDateTime(): typeof DateTime {
  return DateTime;
}

export function sunshineDateTime(date?: SunshineFalsyDateType | ShunshineValidDateType): DateTime<Valid> {
  if (!date) return DateTime.now();  // With 'Settings.defaultZone' zone
  if (date instanceof DateTime) return <DateTime<Valid>>date.setZone(Settings.defaultZone);
  if (date instanceof Date) return <DateTime<Valid>>DateTime.fromJSDate(date); // With 'Settings.defaultZone' zone

  if (typeof date === 'string') {
    return <DateTime<Valid>>DateTime.fromISO(date, { zone: Settings.defaultZone });
  }

  if (typeof date === 'number') {
    if (timestampIsMs(date)) return <DateTime<Valid>>DateTime.fromMillis(date, { zone: Settings.defaultZone });
    if (timestampIsSec(date)) return DateTime.fromSeconds(date, { zone: Settings.defaultZone });
  }

  throw new Error('Invalid date type');
}