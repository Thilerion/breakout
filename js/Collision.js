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

	if (testPointOnLine(intersection, lineA) && testPointOnLine(intersection, lineB)) {
		return intersection;
	} else {
		console.warn(`Intersection found (${intersection.x}, ${intersection.y}) was not on both lines.`);
		return null;
	}
}

function testClosestPointLinePoint(point, line) {
	const { x, y } = point.pos;
	const [l1, l2] = line.points;

	// Take the endpoints of the line segment and turn it into an equation of the form Ax + By = C
	const A = l2.y - l1.y;
	const B = l1.x - l2.x;
	const C1 = A * l1.x + B * l1.y;

	// The equation of the line perpendicular to the initial line segment is given by  -Bx + Ay = C
	// but this time(x, y) is the given point so that the new equation crosses through the given point
	const C2 = -B * x + A * y;

	// Find the determinant
	const det = A * A + B * B;

	let Cx, Cy;
	// Use Cramer's Rule to solve for the point of intersection of the original line and the perpendicular line,
	// and that gives us the closest point on the given line to given point
	if (det !== 0) {
		Cx = (A * C1 - B * C2) / det;
		Cy = (A * C2 + B * C1) / det;
	} else {
		// If determinant = 0, the point is on the line and the closest point to the line is the point itself
		Cx = x;
		Cy = y;
	}

	return new Point(Cx, Cy);	
}

function testClosestPointLineSegmentPoint(point, line) {
	const closest = testClosestPointLinePoint(point, line);
	if (testPointOnLine(closest, line)) {
		return closest;
	} else {
		console.warn("The closest point is not on the line. If this is checking a circle, the radius may have hit the endpoint though.");
	}
}

function getDistanceBetweenPoints(pointA, pointB) {
	const dx = pointA.x - pointB.x;
	const dy = pointA.y - pointB.y;

	return Math.sqrt(dx * dx + dy * dy);
}

// TODO: REPLACES NULLS WITH DISTANCE OBJECTS
// TODO: WATCH OUT WITH CIRCLE + LINE SEGMENT COLLISION! THERE CAN STILL BE A COLLISION IF testClosestPointLineSegmentPoint SAYS NOT, BECAUSE THE RADIUS OF THE CIRCLE COULD HAVE HIT THE LINE
//		 SO, https://ericleong.me/old/research/leong10.pdf PAGE 10:

/* 
The point returned is definitely on the line, so if the x values are between the minimum and maximum x values
	of the endpoints of the line and the same is true for the y axis, then the point returned is on the line segment.
	Special consideration must be made for the endpoints. This is done by also checking if the endpoints
	are less than the radius away using the distance formula.
*/

function testCircleLineSegment(circle, line) {
	// Determine distance from circle to line by finding closest point on the line to the center of the circle
	
}