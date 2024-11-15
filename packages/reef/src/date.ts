import { DateTime, Settings, IANAZone, Zone } from 'luxon';
import { Valid } from 'luxon/src/_util.js';

Settings.throwOnInvalid = true;

export type IsoString = string;
export type LuxonDateTime<T extends boolean> = DateTime<T>;
export type DateTimeType = DateTime<Valid>;
export type FalsyDateType = undefined | null | 0 | '';
export type ValidDateType = number | Date | IsoString | DateTimeType;

export const JUAREZ_TIMEZONE = 'America/Ciudad_Juarez';
export const DENVER_TIMEZONE = 'America/Denver';

export function setTimezone(primary: string, fallback?: string): Zone<true> {
  Settings.defaultZone = fallback || Intl.DateTimeFormat().resolvedOptions().timeZone;

  try {
    if (IANAZone.isValidZone(primary)) Settings.defaultZone = primary;
  } catch (error: unknown) {
    console.error(error);
  }

  return <Zone<true>>Settings.defaultZone;
}

export function getTimezone(): Zone<true> {
  return <Zone<true>>Settings.defaultZone;
}

export function getDateTime(): typeof DateTime {
  return DateTime;
}

export function getDate(date?: FalsyDateType | ValidDateType): DateTime<Valid> {
  if (!date) return DateTime.now();  // With 'Settings.defaultZone' zone
  if (date instanceof DateTime) return date;
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

export function getLocalTimezone(): string {
  return DateTime.now().toFormat('ZZZ'); // Example: "-0600"
}

export function getTimezoneFromDate(date: DateTime): string {
  return date.toFormat('ZZ'); // Example: "-06:00"
}

export function isValidIsoDateWithTimezone(dateString: string): boolean {
  try {
    const dateTime = DateTime.fromISO(dateString);

    return dateTime.isValid &&
      dateString.includes('T') && (
        dateString.includes('+') ||
        dateString.includes('-') ||
        dateString.includes('Z')
      );
  } catch (error: unknown) {
    return false;
  }
}

export function extractOffsetFromISO(date: string): string | null {
  const offsetRegex = /([+-]\d{2}:\d{2}|Z)$/;
  const match = date.match(offsetRegex);

  if (match) {
    return match[0] === 'Z' ? '+00:00' : match[0]; // Example: "-06:00"
  }

  return null;
}

export function convertOffsetToTimezone(offset: string): string {
  const parts = offset.split(':');
  const hours = parts[0];
  const minutes = parts[1] || "00";
  const formattedMinutes = minutes.padEnd(2, '0');

  return `${hours}${formattedMinutes}`; // Example: "-0600"
}

export function timestampIsSec(timestamp: number): boolean {
  const minValidTimestamp = 0;
  const maxValidTimestamp = 1e10 - 1;

  return Number.isInteger(timestamp) &&
    (timestamp >= minValidTimestamp) &&
    (timestamp <= maxValidTimestamp);
}

export function timestampIsMs(timestamp: number): boolean {
  const minValidTimestamp = 0;
  const maxValidTimestamp = 1e13 - 1;

  return Number.isInteger(timestamp) &&
    (timestamp >= minValidTimestamp) &&
    (timestamp <= maxValidTimestamp);
}
