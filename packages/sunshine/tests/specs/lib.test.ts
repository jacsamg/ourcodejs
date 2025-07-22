import { expect } from "chai";
import { DENVER_TIMEZONE, JUAREZ_TIMEZONE } from "../../src/data";
import {
	getGlobalTimezone,
	luxonDateTime,
	setGlobalTimezone,
	sunshineDateTime,
} from "../../src/lib";

describe("lib", () => {
	describe("setGlobalTimezone", () => {
		it("should set custom timezone", () => {
			setGlobalTimezone(JUAREZ_TIMEZONE);
			expect(getGlobalTimezone().name).to.equal(JUAREZ_TIMEZONE);
		});

		it("should set fallback timezone", () => {
			setGlobalTimezone("zone/invalid", DENVER_TIMEZONE);
			expect(getGlobalTimezone().name).to.equal(DENVER_TIMEZONE);
		});
	});

	describe("getGlobalTimezone", () => {
		it("should return the default timezone", () => {
			setGlobalTimezone(JUAREZ_TIMEZONE);
			expect(getGlobalTimezone().name).to.equal(JUAREZ_TIMEZONE);
		});
	});

	describe("luxonDateTime", () => {
		it("should return the DateTime instance", () => {
			const DateTime = luxonDateTime();
			const date = DateTime.now().day;
			const nowDay = new Date().getDate();

			expect(date).to.be.a("number");
			expect(date).to.equal(nowDay);
		});
	});

	describe("sunshineDateTime", () => {
		it("should return a DateTime object with the specified timezone", () => {
			setGlobalTimezone(JUAREZ_TIMEZONE);
			expect(sunshineDateTime().zoneName).to.equal(JUAREZ_TIMEZONE);
		});
	});
});
