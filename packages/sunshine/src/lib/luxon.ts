import { IANAZone, Settings, type Zone } from 'luxon';
import { DEFAULT_TIMEZONE } from '../data/data.js';

export function getLuxonGlobalTimezone(): Zone<true> {
  return Settings.defaultZone;
}

export function setLuxonGlobalTimezone(
  primary: string,
  fallback = DEFAULT_TIMEZONE,
): Zone<true> {
  Settings.defaultZone = IANAZone.isValidZone(primary) ? primary : fallback;
  return getLuxonGlobalTimezone();
}

export function setLuxonThrowOnInvalid(status: boolean): void {
  Settings.throwOnInvalid = status;
}
