import { DateTime } from 'luxon';

/**
  @returns {string} The short offset of the timezone in the format:
                    '+HH:MM' or '-HH:MM' (E.g. -06:00).
*/
export function getTimezoneShortOffset(
  date: DateTime = DateTime.now(),
): string {
  return date.toFormat('ZZ');
}

/**
  @returns {string} The techie offset of the timezone in the format:
                    '+HHMM' or '-HHMM' (E.g. -0600).
*/
export function getTimezoneTechieOffset(
  date: DateTime = DateTime.now(),
): string {
  return date.toFormat('ZZZ');
}

export function isValidIsoDateWithTimezone(dateString: string): boolean {
  try {
    const dateTime = DateTime.fromISO(dateString);

    return (
      dateTime.isValid &&
      dateString.includes('T') &&
      (dateString.includes('+') ||
        dateString.includes('-') ||
        dateString.includes('Z'))
    );
  } catch (_error: unknown) {
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
  const minutes = parts[1] || '00';
  const formattedMinutes = minutes.padEnd(2, '0');

  return `${hours}${formattedMinutes}`; // Example: "-0600"
}

export function timestampIsSec(timestamp: number): boolean {
  const minValidTimestamp = 0;
  const maxValidTimestamp = 1e10 - 1;

  return (
    Number.isInteger(timestamp) &&
    timestamp >= minValidTimestamp &&
    timestamp <= maxValidTimestamp
  );
}

export function timestampIsMs(timestamp: number): boolean {
  const minValidTimestamp = 0;
  const maxValidTimestamp = 1e13 - 1;

  return (
    Number.isInteger(timestamp) &&
    timestamp >= minValidTimestamp &&
    timestamp <= maxValidTimestamp
  );
}
