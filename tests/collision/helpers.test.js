import * as helpers from '../../js/collision/helpers.js';

const radToDeg = helpers.radToDeg;

describe("radians to degrees", () => {
	it("converts radians to degrees", () => {
		expect(radToDeg(Math.PI)).toBeCloseTo(180);
	})

	it("does not give negative degrees", () => {
		expect(radToDeg(Math.PI * -1)).toBeCloseTo(180);
		expect(radToDeg(Math.PI * -4)).toBeCloseTo(0);
	})

	it("gives values [0, 360)", () => {
		expect(radToDeg(Math.PI * 4)).toBeCloseTo(0);
		for (let rad = (Math.PI * 3.999), max = Math.PI * 4.001; rad < max; rad += 0.001) {
			const deg = radToDeg(rad);
			expect(deg).toBeLessThan(360);
			expect(deg).toBeGreaterThanOrEqual(0);
		}
	})
})