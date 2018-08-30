import * as helpers from './helpers.js';

export class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	get pos() {
		return { x: this.x, y: this.y };
	}
}

export class Circle {
	constructor(point, radius) {
		this.point = point;
		this.radius = radius;
	}

	get pos() {
		return this.point;
	}
}

export class Line {
	constructor(pointA, pointB) {
		this.pointA = pointA;
		this.pointB = pointB;
	}

	get points() {
		return [this.pointA, this.pointB];
	}

	get angleRad() {
		const dx = this.pointB.pos.x - this.pointA.pos.x;
		const dy = this.pointB.pos.y - this.pointA.pos.y;
		return Math.atan2(dy, dx); //range (-PI, PI]
	}

	get angleDeg() {
		return helpers.radToDeg(this.angleRad);
	}
}

export class Rectangle {
	constructor(point, width, height) {
		this.startPoint = point;
		this.width = width;
		this.height = height;

		this.points = [
			// from topLeft, clockwise
			new Point(this.startPoint.x, this.startPoint.y),
			new Point(this.startPoint.x + this.width, this.startPoint.y),
			new Point(this.startPoint.x + this.width, this.startPoint.y + this.height),
			new Point(this.startPoint.x, this.startPoint.y + this.height)
		];

		this.edges = [
			//top, right, bottom, left
			new Line(this.points[0], this.points[1]),
			new Line(this.points[1], this.points[2]),
			new Line(this.points[2], this.points[3]),
			new Line(this.points[3], this.points[0])
		]
	}

	get pos() {
		return this.startPoint;
	}

	get w() {
		return this.width;
	}

	get h() {
		return this.height;
	}
}