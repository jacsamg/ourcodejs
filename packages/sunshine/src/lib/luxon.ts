import { IANAZone, type Settings, type Zone } from "luxon";
import { DEFAULT_TIMEZONE } from "../data/data.js";

export function setLuxonThrowOnInvalid(
	throwOnInvalid: boolean,
	settings: typeof Settings,
) {
	settings.throwOnInvalid = throwOnInvalid;
}

export function setLuxonGlobalTimezone(
	primary: string,
	fallback = DEFAULT_TIMEZONE,
	settings: typeof Settings,
) {
	settings.defaultZone = IANAZone.isValidZone(primary) ? primary : fallback;
}

export function getLuxonGlobalTimezone(
	settings: typeof Settings,
): Zone<true | false> {
	return settings.defaultZone;
}
