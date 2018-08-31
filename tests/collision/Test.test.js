import Test from '../../js/collision/Test.js';
import { Point, Circle, Line, Rectangle } from '../../js/collision/Objects.js';

let lineA, lineB, lineC, lineD, lineE;
let pointA, pointB, pointC, pointD;

beforeAll(() => {
	lineA = new Line(new Point(0, 0), new Point(5, 5));
	lineB = new Line(new Point(0, 1), new Point(20, 21));
	lineC = new Line(new Point(0, 2), new Point(2, 2));
	lineD = new Line(new Point(-1, 0), new Point(5, -20));
	lineE = new Line(new Point(-2, 0), new Point(6, 10));
})

describe("Line-line intersection", () => {
	it("should return null for parallel lines", () => {
		expect(Test.lineLineIntersection(lineA, lineB)).toBeNull();
	})

	it("should return a Point for a correct intersection", () => {
		const res = Test.lineLineIntersection(lineA, lineC);
		expect(res).toBeInstanceOf(Point);
	})
})

describe("Point on line segment", () => {
	
})

describe("Line segment-line segment intersection", () => {
	
})

describe("Point on line closest to a point", () => {
	
})

describe("Point on line segment closest to a point", () => {

})

describe("Point-point distance", () => {

})