export class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

export class Circle {
	constructor(point, radius) {

		if (point instanceof Point) {
			this.point = point;
		} else {
			this.point = new Point(point.x, point.y);
		}
		
		this.radius = radius;
	}
}

export class Line {
	constructor(pointA, pointB) {

		if (pointA instanceof Point) {
			this.pointA = pointA;
		} else {
			this.pointA = new Point(pointA.x, pointA.y);
		}

		if (pointB instanceof Point) {
			this.pointB = pointB;
		} else {
			this.pointB = new Point(pointB.x, pointB.y);
		}
	}

	get points() {
		return [this.pointA, this.pointB];
	}
}

export class Rectangle {
	constructor(point, width, height) {

		if (point instanceof Point) {
			this.startPoint = point;
		} else {
			this.startPoint = new Point(point.x, point.y);
		}

		this.width = width;
		this.height = height;

		this.points = [
			// from topLeft, clockwise
			this.startPoint,
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