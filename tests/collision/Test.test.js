import Test from '../../js/collision/Test.js';
import { Vector, Circle, Line, Rectangle } from '../../js/collision/Bodies.js';

let lineA, lineB, lineC, lineD, lineE;
let vectorA, vectorB, vectorC, vectorD;

beforeAll(() => {
	lineA = new Line(new Vector(0, 0), new Vector(5, 5));
	lineB = new Line(new Vector(0, 1), new Vector(20, 21));
	lineC = new Line(new Vector(0, 2), new Vector(2, 2));
	lineD = new Line(new Vector(-1, 0), new Vector(5, -20));
	lineE = new Line(new Vector(-2, 0), new Vector(6, 10));
})

describe("Line-line intersection", () => {
	it("should return null for parallel lines", () => {
		expect(Test.lineLineIntersection(lineA, lineB)).toBeNull();
	})

	it("should return a Vector for a correct intersection", () => {
		const res = Test.lineLineIntersection(lineA, lineC);
		expect(res).toBeInstanceOf(Vector);
	})
})

describe("Vector on line segment", () => {
	
})

describe("Line segment-line segment intersection", () => {
	
})

describe("Vector on line closest to a vector", () => {
	
})

describe("Vector on line segment closest to a vector", () => {

})

describe("Vector-vector distance", () => {

})