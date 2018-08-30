import { Point, Circle, Line, Rectangle } from '../../js/collision/Objects.js';

describe("Point", () => {
	it("has x and y properties", () => {
		const point = new Point(1, 2);
		expect(point).toHaveProperty('x', 1);
		expect(point).toHaveProperty('y', 2);
	})
})

describe("Circle", () => {
	const circle = new Circle(new Point(1, 2), 5);

	it("has a point and radius property", () => {
		expect(circle).toHaveProperty('radius', 5);
		expect(circle).toHaveProperty('point');
	})

	it("has a Point class as its point property", () => {
		expect(circle.point).toBeInstanceOf(Point);
	})
})

describe("Line", () => {
	let line;
	const pointA = new Point(1, 2);
	const pointB = new Point(3, 4);

	beforeEach(() => {
		line = new Line(pointA, pointB);
	})

	it("has a pointA and pointB property", () => {
		expect(line).toHaveProperty('pointA');
		expect(line).toHaveProperty('pointB');
	})

	it("has Point objects as point properties", () => {
		expect(line.pointA).toBeInstanceOf(Point);
		expect(line.pointB).toBeInstanceOf(Point);
	})

	it("has a points array with two Points", () => {
		expect(Array.isArray(line.points)).toBe(true);
		expect(line.points[0]).toBeInstanceOf(Point);
		expect(line.points).toHaveLength(2);
	})
})

describe("Rectangle", () => {
	let rect;
	const point = new Point(5, 5);
	const width = 10;
	const height = 10;

	beforeEach(() => {
		rect = new Rectangle(point, width, height);
	})

	it("has a startPoint property that is a Point object", () => {
		expect(rect).toHaveProperty("startPoint");
		expect(rect.startPoint).toBeInstanceOf(Point);
	})

	it("has a width and height property", () => {
		expect(rect).toHaveProperty('width', width);
		expect(rect).toHaveProperty('height', height);
	})

	it("has a points property with 4 Points for all corners", () => {
		expect(rect.points).toHaveLength(4);
		expect(rect.points[2]).toBeInstanceOf(Point);
		expect(rect.points[0]).toBeInstanceOf(Point);
	})

	it("has a points property that starts topLeft and goes clockwise", () => {
		expect(rect.points[1].x - rect.points[0].x).toBe(width);
		expect(rect.points[2].x - rect.points[3].x).toBe(width);
		expect(rect.points[3].y - rect.points[0].y).toBe(height);
		expect(rect.points[2].y - rect.points[1].y).toBe(height);
	})

	it("has an edges property with 4 Line objects", () => {
		expect(rect.edges).toHaveLength(4);
		expect(rect.edges[2]).toBeInstanceOf(Line);
		expect(rect.edges[0]).toBeInstanceOf(Line);
	})
})