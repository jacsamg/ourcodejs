import { DateTime } from 'luxon';
import { Valid } from 'luxon/src/_util.js';

export type CoralIsoString = string;
export type CoralDateTime<T extends boolean> = DateTime<T>;
export type CoralDateTimeType = DateTime<Valid>;
export type CoralFalsyDateType = undefined | null | 0 | '';
export type CoralValidDateType = number | Date | CoralIsoString | CoralDateTimeType;