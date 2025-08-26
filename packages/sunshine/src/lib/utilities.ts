import { DateTime } from 'luxon';

/**
  @returns {string}
  The short offset of the timezone in the format: '+HH:MM' or '-HH:MM' (E.g. -06:00).
*/
export function getTimezoneShortOffset(
  date: DateTime = DateTime.now(),
): string {
  return date.toFormat('ZZ');
}

/**
  @returns {string}
  The techie offset of the timezone in the format: '+HHMM' or '-HHMM' (E.g. -0600).
*/
export function getTimezoneTechieOffset(
  date: DateTime = DateTime.now(),
): string {
  return date.toFormat('ZZZ');
}

export function isValidIsoDateWithTimezone(dateString: string): boolean {
  try {
    const dateTime = DateTime.fromISO(dateString);

    if (!dateTime.isValid || !dateString.includes('T')) {
      return false;
    }

    // Check if the string has a timezone offset or Z at the end
    const timezoneRegex = /([+-]\d{2}:\d{2}|[+-]\d{4}|Z)$/;
    return timezoneRegex.test(dateString);
  } catch (_error: unknown) {
    return false;
  }
}

export function getOffsetFromISO(date: string): string | null {
  const offsetRegex = /([+-]\d{2}:\d{2}|Z)$/;
  const match = date.match(offsetRegex);

  if (match) {
    return match[0] === 'Z' ? '+00:00' : match[0]; // Example: "-06:00"
  }

  return null;
}

export function timestampIsSec(timestamp: number): boolean {
  const minValidTimestamp = 1e9; // Jan 1, 2001 approximately
  const maxValidTimestamp = 1e10 - 1; // Before year 2286

  return (
    Number.isInteger(timestamp) &&
    timestamp >= minValidTimestamp &&
    timestamp <= maxValidTimestamp
  );
}

export function timestampIsMs(timestamp: number): boolean {
  const minValidTimestamp = 1e12; // Jan 1, 2001 approximately
  const maxValidTimestamp = 1e13 - 1; // Before year 2286

  return (
    Number.isInteger(timestamp) &&
    timestamp >= minValidTimestamp &&
    timestamp <= maxValidTimestamp
  );
}
