const radToDeg = rad => {
	let deg = rad * 180 / Math.PI;
	return deg < 0 ? deg + 360 : deg;
}

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	get pos() {
		return { x: this.x, y: this.y };
	}
}


class Circle {
	constructor(point, radius) {
		this.point = point;
		this.radius = radius;
	}

	get pos() {
		return this.point.pos;
	}
}

class Line {
	constructor(pointA, pointB) {
		this.pointA = pointA;
		this.pointB = pointB;
	}

	get points() {
		return [this.pointA.pos, this.pointB.pos];
	}

	get angleRad() {
		const dx = this.pointB.pos.x - this.pointA.pos.x;
		const dy = this.pointB.pos.y - this.pointA.pos.y;
		return Math.atan2(dy, dx); //range (-PI, PI]
	}

	get angleDeg() {
		return radToDeg(this.angleRad);
	}
}

class Rectangle {
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
		return this.startPoint.pos;
	}

	get w() {
		return this.width;
	}

	get h() {
		return this.height;
	}
}


function testLineLine(lineA, lineB) {
	let x, y;

	const [p1, p2] = lineA.points;
	const [p3, p4] = lineB.points;

	// Endpoints of line segments into equations of form Ax + By = C
	const A1 = p2.y - p1.y;
	const A2 = p4.y - p3.y;
	const B1 = p1.x - p2.x;
	const B2 = p3.x - p4.x;
	// Rearrange into a linear system of equations
	const C1 = A1 * p1.x + B1 * p1.y;
	const C2 = A2 * p3.x + B2 * p3.y;

	// Find determinant
	const det = A1 * B2 - A2 * B1;
	if (Math.round(det * 100) / 100 !== 0) {
		// Lines are parallel or equal, and there is no point of intersection
		x = (C1 * B2 - B1 * C2) / det;
		y = (A1 * C2 - C1 * A2) / det;

		return new Point(x, y);
	} else {
		console.warn(`Determinant (${det}) is zero, so no solutions.`);
		return null;
	}
}

function testPointOnLine(point, line) {
	const [l1, l2] = line.points;
	const x = point.x;
	const y = point.y;
	
	const onX = (Math.min(l1.x, l2.x) <= x) && (x <= Math.max(l1.x, l2.x));
	const onY = (Math.min(l1.y, l2.y) <= y) && (y <= Math.max(l1.y, l2.y));

	return (onX && onY);
}

function testLineSegmentLineSegment(lineA, lineB) {
	
	let intersection = testLineLine(lineA, lineB);

	if (!intersection) return intersection;

	if (testPointLine(intersection, lineA) && testPointLine(intersection, lineB)) {
		return intersection;
	} else {
		console.warn(`Intersection found (${intersection.x}, ${intersection.y}) was not on both lines.`);
		return null;
	}
}