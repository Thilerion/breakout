import { Vector, Circle, Line, Rectangle } from '../../js/collision/Bodies.js';

describe("Vector", () => {
	it("has x and y properties", () => {
		const vector = new Vector(1, 2);
		expect(vector).toHaveProperty('x', 1);
		expect(vector).toHaveProperty('y', 2);
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