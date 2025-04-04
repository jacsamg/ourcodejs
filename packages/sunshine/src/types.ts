import { DateTime } from 'luxon';
import { Valid } from 'luxon/src/_util.js';

export type SunshineIsoString = string;
export type SunshineDateTime<T extends boolean> = DateTime<T>;
export type SunshineDateTimeType = DateTime<Valid>;
export type SunshineFalsyDateType = undefined | null | 0 | '';
export type ShunshineValidDateType = number | Date | SunshineIsoString | SunshineDateTimeType;