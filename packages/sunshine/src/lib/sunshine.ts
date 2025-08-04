import { DateTime, IANAZone } from 'luxon';
import type { Valid } from 'luxon/src/_util.js';
import { DEFAULT_TIMEZONE } from '../data/data.js';
import type {
  ShunshineValidDateType,
  SunshineFalsyDateType,
} from '../types/types.js';
import { timestampIsMs, timestampIsSec } from './utilities.js';

let SUNSHINE_DEFAULT_ZONE = DEFAULT_TIMEZONE;

export function setSunshineDefaultZone(
  primary: string,
  fallback = SUNSHINE_DEFAULT_ZONE,
): void {
  SUNSHINE_DEFAULT_ZONE = IANAZone.isValidZone(primary) ? primary : fallback;
}

export function getSunshineGlobalTimezone(): string {
  return SUNSHINE_DEFAULT_ZONE;
}

export function sunshineDateTime(
  date?: SunshineFalsyDateType | ShunshineValidDateType,
  zone: string = SUNSHINE_DEFAULT_ZONE,
): DateTime<Valid> {
  if (!date) {
    return DateTime.now().setZone(zone) as DateTime<Valid>;
  }

  if (date instanceof DateTime) {
    return <DateTime<Valid>>date.setZone(zone);
  }

  if (date instanceof Date) {
    return DateTime.fromJSDate(date, {
      zone: zone,
    }) as DateTime<Valid>;
  }

  if (typeof date === 'string') {
    return <DateTime<Valid>>DateTime.fromISO(date, { zone });
  }

  if (typeof date === 'number') {
    if (timestampIsMs(date)) {
      return <DateTime<Valid>>DateTime.fromMillis(date, { zone });
    }

    if (timestampIsSec(date)) {
      return DateTime.fromSeconds(date, { zone });
    }
  }

  throw new Error('Invalid date type');
}
