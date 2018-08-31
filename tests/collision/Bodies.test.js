import { Vector, Circle, Line, Rectangle } from '../../js/collision/Bodies.js';

describe.only("Vector", () => {
	it("has x and y properties", () => {
		const vector = new Vector(1, 2);
		expect(vector).toHaveProperty('x', 1);
		expect(vector).toHaveProperty('y', 2);
	})

	it("has an x and y of 0 if instantiated without params", () => {
		const vector = new Vector();
		expect(vector.x).toBe(0);
		expect(vector.y).toBe(0);
	})

	describe("length getter", () => {
		let vector = new Vector();
		it("has a length getter property", () => {
			expect(vector).toHaveProperty('len');
		})

		it("returns the correct length", () => {
			expect(new Vector(0, 0).len).toBe(0);
			expect(new Vector(1, 1).len).toBeCloseTo(1.414);
			expect(new Vector(10, 15).len).toBeCloseTo(18.027);
			expect(new Vector(0.312, 0.813).len).toBeCloseTo(0.8708);
		})

		it("works with negative vectors", () => {
			expect(new Vector(-0, -0).len).toBe(0);
			expect(new Vector(-1, -1).len).toBeCloseTo(1.414);
			expect(new Vector(-10, -15).len).toBeCloseTo(18.027);
			expect(new Vector(-0.312, -0.813).len).toBeCloseTo(0.8708);
		})
	})

	describe("vector calculations", () => {
		let vecA, vecB, vecC;
		
		describe("add", () => {
			it("correctly adds two vectors", () => {
				vecA = new Vector(0, 0);
				expect(vecA.add(vecA)).toStrictEqual(vecA);
				vecA = new Vector(1, 1.21);
				vecB = new Vector(10.3, 2);
				vecC = new Vector(11.3, 3.21);
				expect(vecA.add(vecB)).toStrictEqual(vecC);
				vecA = new Vector(-5, 15);
				vecB = new Vector(5, -15.5);
				vecC = new Vector(0, -0.5);
				expect(vecA.add(vecB)).toStrictEqual(vecC);
			})

			it("accepts just a single unit to add", () => {
				vecA = new Vector(0, 0);
				vecB = new Vector(5, 5);
				expect(vecA.add(5)).toStrictEqual(vecB);
				vecA = new Vector(3, 3);
				expect(vecA.add(-3.33).x).toBeCloseTo(-0.33);
				expect(vecA.y).toBeCloseTo(-0.33);
			})
		})

		describe("subtract", () => {
			it("correctly subtracts two vectors", () => {
				vecA = new Vector(0, 0);
				expect(vecA.subtract(vecA)).toStrictEqual(vecA);
				vecA = new Vector(1, 1.5);
				vecB = new Vector(-1, 1);
				vecC = new Vector(2, 0.5);
				expect(vecA.subtract(vecB)).toStrictEqual(vecC);
			})

			it("accepts just a single unit", () => {
				vecA = new Vector(1, 1);
				vecB = new Vector(0, 0);
				expect(vecA.subtract(1)).toStrictEqual(vecB);
			})
		})

		describe("scale", () => {
			it("correctly increases the length of the vector", () => {
				vecA = new Vector(0, 0);
				const lenA = vecA.len;
				vecB = new Vector(1, 1);
				const lenB = vecB.len;
				vecC = new Vector(5.5, -5);
				const lenC = vecC.len;
				expect(vecA.scale(10).len).toBe(lenA * 10);
				expect(vecB.scale(4).len).toBe(lenB * 4);
				expect(vecC.scale(5).len).toBe(lenC * 5);
			})
		})

		describe("dot", () => {
			it("returns the correct scalar dot product", () => {
				vecA = new Vector(-6, 8);
				vecB = new Vector(5, 12);
				expect(vecA.dot(vecB)).toBeCloseTo(66);
				vecA = new Vector(3, 4);
				vecB = new Vector(-5.2, 6.1);
				expect(vecA.dot(vecB)).toBeCloseTo(8.8);
				vecA = new Vector(0.1, 0);
				expect(vecA.dot(vecB)).toBeCloseTo(-0.52);
			})
		})

		describe("divide", () => {
			it("correctly divides a vector's length", () => {
				vecA = new Vector(0, 0);
				const lenA = vecA.len;
				vecB = new Vector(1, 1);
				const lenB = vecB.len;
				vecC = new Vector(5.5, -5);
				const lenC = vecC.len;
				expect(vecA.divide(10).len).toBe(lenA / 10);
				expect(vecB.divide(4).len).toBe(lenB / 4);
				expect(vecC.divide(5).len).toBe(lenC / 5);
			})

			it("can handle a division by 0", () => {
				vecA = new Vector(0, 0);
				vecB = new Vector(1, 1);
				vecC = new Vector(1, 1);
				expect(vecA.divide(0).len).toBe(0);
				expect(vecB.divide(0)).toStrictEqual(vecC);
				expect(vecB.divide(5)).not.toBe(vecC);
			})
		})

		describe("normalize", () => {
			it("returns a vector with length 1", () => {
				vecA = new Vector(1, 1);
				vecB = new Vector(-5, 3.3);
				vecC = new Vector(0.1, 0.2);
				expect(vecA.normalize().len).toBeCloseTo(1);
				expect(vecB.normalize().len).toBeCloseTo(1);
				expect(vecC.normalize().len).toBeCloseTo(1);
				vecA = new Vector(0, 1);
				expect(vecA.normalize().len).toBeCloseTo(1);
			})

			it("gives the correct x and y", () => {
				vecA = new Vector(0, 1).normalize();
				expect(vecA.x).toBeCloseTo(0);
				expect(vecA.y).toBeCloseTo(1);
				vecB = new Vector(-5, 3.3).normalize();
				expect(vecB.x + 0.835).toBeCloseTo(0);
				expect(vecB.y - 0.551).toBeCloseTo(0);
				vecC = new Vector(0.1, 0.2).normalize();
				expect(vecC.x - 0.447).toBeCloseTo(0);
				expect(vecC.y - 0.894).toBeCloseTo(0);
			})

			it("can handle a zero-vector", () => {
				vecA = new Vector(0, 0);
				vecB = new Vector(0, 0);
				expect(vecA.normalize()).toStrictEqual(vecB);
			})
		})
	})
})

describe("Circle", () => {
	const circle = new Circle(new Vector(1, 2), 5);

	it("has a vector and radius property", () => {
		expect(circle).toHaveProperty('radius', 5);
		expect(circle).toHaveProperty('vector');
	})

	it("has a Vector class as its vector property", () => {
		expect(circle.vector).toBeInstanceOf(Vector);
	})
})

describe("Line", () => {
	let line;
	const vectorA = new Vector(1, 2);
	const vectorB = new Vector(3, 4);

	beforeEach(() => {
		line = new Line(vectorA, vectorB);
	})

	it("has a vectorA and vectorB property", () => {
		expect(line).toHaveProperty('vectorA');
		expect(line).toHaveProperty('vectorB');
	})

	it("has Vector objects as vector properties", () => {
		expect(line.vectorA).toBeInstanceOf(Vector);
		expect(line.vectorB).toBeInstanceOf(Vector);
	})

	it("has a vectors array with two Vectors", () => {
		expect(Array.isArray(line.vectors)).toBe(true);
		expect(line.vectors[0]).toBeInstanceOf(Vector);
		expect(line.vectors).toHaveLength(2);
	})
})

describe("Rectangle", () => {
	let rect;
	const vector = new Vector(5, 5);
	const width = 10;
	const height = 10;

	beforeEach(() => {
		rect = new Rectangle(vector, width, height);
	})

	it("has a startVector property that is a Vector object", () => {
		expect(rect).toHaveProperty("startVector");
		expect(rect.startVector).toBeInstanceOf(Vector);
	})

	it("has a width and height property", () => {
		expect(rect).toHaveProperty('width', width);
		expect(rect).toHaveProperty('height', height);
	})

	it("has a vectors property with 4 Vectors for all corners", () => {
		expect(rect.vectors).toHaveLength(4);
		expect(rect.vectors[2]).toBeInstanceOf(Vector);
		expect(rect.vectors[0]).toBeInstanceOf(Vector);
	})

	it("has a vectors property that starts topLeft and goes clockwise", () => {
		expect(rect.vectors[1].x - rect.vectors[0].x).toBe(width);
		expect(rect.vectors[2].x - rect.vectors[3].x).toBe(width);
		expect(rect.vectors[3].y - rect.vectors[0].y).toBe(height);
		expect(rect.vectors[2].y - rect.vectors[1].y).toBe(height);
	})

	it("has an edges property with 4 Line objects", () => {
		expect(rect.edges).toHaveLength(4);
		expect(rect.edges[2]).toBeInstanceOf(Line);
		expect(rect.edges[0]).toBeInstanceOf(Line);
	})
})