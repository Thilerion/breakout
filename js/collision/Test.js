import { Vector, Circle, Line } from './Bodies.js';
import { fixFloat as fp } from './helpers.js';

// TODO: REPLACES NULLS WITH DISTANCE OBJECTS
// TODO: WATCH OUT WITH CIRCLE + LINE SEGMENT COLLISION! THERE CAN STILL BE A COLLISION IF vectorClosesVectorToLineSegment SAYS NOT, BECAUSE THE RADIUS OF THE CIRCLE COULD HAVE HIT THE LINE
//		 SO, https://ericleong.me/old/research/leong10.pdf PAGE 10:

/* 
The vector returned is definitely on the line, so if the x values are between the minimum and maximum x values
	of the endvectors of the line and the same is true for the y axis, then the vector returned is on the line segment.
	Special consideration must be made for the endvectors. This is done by also checking if the endvectors
	are less than the radius away using the distance formula.
*/

const Test = {
	lineLineIntersection(lineA, lineB) {
		let x, y;

		const [p1, p2] = lineA.vectors;
		const [p3, p4] = lineB.vectors;

		// Endvectors of line segments into equations of form Ax + By = C
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
			// Lines are parallel or equal, and there is no vector of intersection
			x = (C1 * B2 - B1 * C2) / det;
			y = (A1 * C2 - C1 * A2) / det;

			return new Vector(x, y);
		} else {
			//console.warn(`Determinant (${det}) is zero, so no solutions.`);
			return null;
		}
	},

	vectorLineSegment(vector, line) {
		const [l1, l2] = line.vectors;
		const x = fp(vector.x);
		const y = fp(vector.y);
		
		const onX = (Math.min(fp(l1.x), fp(l2.x)) <= x) && (x <= Math.max(fp(l1.x), fp(l2.x)));
		const onY = (Math.min(fp(l1.y), fp(l2.y)) <= y) && (y <= Math.max(fp(l1.y), fp(l2.y)));

		return (onX && onY);
	},

	lineSegmentLineSegmentIntersection(lineA, lineB) {
		let intersection = Test.lineLineIntersection(lineA, lineB);

		if (!intersection) return intersection;

		if (Test.vectorLineSegment(intersection, lineA) && Test.vectorLineSegment(intersection, lineB)) {
			return intersection;
		} else {
			//console.warn(`Intersection found (${intersection.x}, ${intersection.y}) was not on both lines.`);
			return null;
		}
	},

	vectorClosestVectorToLine(vector, line) {
		const { x, y } = vector;
		const [l1, l2] = line.vectors;

		// Take the endvectors of the line segment and turn it into an equation of the form Ax + By = C
		const A = l2.y - l1.y;
		const B = l1.x - l2.x;
		const C1 = A * l1.x + B * l1.y;

		// The equation of the line perpendicular to the initial line segment is given by  -Bx + Ay = C
		// but this time(x, y) is the given vector so that the new equation crosses through the given vector
		const C2 = -B * x + A * y;

		// Find the determinant
		const det = A * A + B * B;

		let Cx, Cy;
		// Use Cramer's Rule to solve for the vector of intersection of the original line and the perpendicular line,
		// and that gives us the closest vector on the given line to given vector
		if (det !== 0) {
			Cx = (A * C1 - B * C2) / det;
			Cy = (A * C2 + B * C1) / det;
		} else {
			// If determinant = 0, the vector is on the line and the closest vector to the line is the vector itself
			Cx = x;
			Cy = y;
		}

		return new Vector(Cx, Cy);
	},

	vectorClosestVectorToLineSegment(vector, line) {
		const closest = Test.vectorClosestVectorToLine(vector, line);
		if (Test.vectorLineSegment(closest, line)) {
			return closest;
		} else {
			// console.warn("The closest vector is not on the line. If this is checking a circle, the radius may have hit the endvector though.");
			return null;
		}
	},

	vectorVectorDistance(vectorA, vectorB) {
		const dx = vectorA.x - vectorB.x;
		const dy = vectorA.y - vectorB.y;

		return Math.sqrt(dx * dx + dy * dy);
	},

	circleLineCollision(circle, line) {
		// Determine the distance from the circle to the line by first finding the closest vector on the line to the center of the circle (vector1) using the closest line on a vector to a line algorithm.
		const closest = Test.vectorClosestVectorToLine(circle.vector, line);
		const distance = Test.vectorVectorDistance(closest, circle.vector);

		if (fp(distance) === 0) {
			//console.log("Circle is exactly on the line.");
			return 0;
		} else if (fp(distance) < circle.radius) {
			//console.log("Circle is touching the line.");
			return distance;
		} else {
			//console.log("Circle is not touching the line.");
			return null;
		}
	},

	circleLineDistance(circle, line) {
		const closest = Test.vectorClosestVectorToLine(circle.vector, line);
		const distance = Test.vectorVectorDistance(closest, circle.vector) - circle.radius;
		return distance;
	},

	circleLineSegmentCollision(circle, line) {
		// Determine the distance from the circle to the line by first finding the closest vector on the line to the center of the circle (vector1) using the closest line on a vector to a line algorithm.
		const closest = Test.vectorClosestVectorToLine(circle.vector, line);
		const closestOnSegment = Test.vectorLineSegment(closest, line);
		const distance = Test.vectorVectorDistance(closest, circle.vector);

		if (closestOnSegment && fp(distance) === 0) {
			//console.log("Circle is exactly on the line.");
			return true;
		} else if (closestOnSegment && fp(distance) < circle.radius) {
			//console.log("Circle is touching the line.");
			return true;
		} else if (!closestOnSegment) {
			const distanceEndvectorA = Test.vectorVectorDistance(line.vectorA, circle.vector);
			const distanceEndvectorB = Test.vectorVectorDistance(line.vectorB, circle.vector);
			if (distanceEndvectorA < circle.radius || distanceEndvectorB < circle.radius) {
				//console.log("Closest vector of circle is not on the line segment. However, one edge of the line segment is less than radius away from the circle, so there was a collision.");
				// TODO: return something of an object that has additional info, such as that the collision was with an endvector (so the collision response vector can be adjusted)
				return true;
			}
		} else {
			//console.log("Circle is not touching the line.");
			return null;
		}
	},

	movingCircleLineSegmentCollision(circle, circleMovementVector, line) {
		//const collisionNow = Test.circleLineSegmentCollision(circle, line);
		// This collisionNow is not even necessary I think...
		//if (!!collisionNow) {
		//	return collisionNow;
		//}

		const nextCirclePosition = circle.vector.copy().add(circleMovementVector);
		const movementLine = new Line(circle.vector.copy(), nextCirclePosition);

		// Point of intersection between 'line' and circle's 'movement vector'
		const lineMovIntersect = Test.lineSegmentLineSegmentIntersection(movementLine, line);
		// Closest point on 'line' to endpoint of circle's movement vector
		const closestLineMovVectorEndpoint = Test.vectorClosestVectorToLineSegment(nextCirclePosition, line);
		// Closest point on movement vector to line segment startpoint
		const closestMovVectorLineStartpoint = Test.vectorClosestVectorToLineSegment(line.vectorA, movementLine);
		// Closest point on movement vector line segment endpoint
		const closestMovVectorLineEndpoint = Test.vectorClosestVectorToLineSegment(line.vectorB, movementLine);

		// Collision only possible if any of:
		// lineMovIntersect on line AND movement vector
		// closestLineMovVectorEndpoint less than radius away from endpoint of the movement vector, and is on the line segment
		// closestMovVectorLineStartpoint less than radius away from line startpoint and is on movement vector
		// closestMovVectorLineEndpoint less than radius away from line endpoint and is on movement vector

		const possibleA = !!lineMovIntersect;
		const possibleB = closestLineMovVectorEndpoint && Test.vectorVectorDistance(closestLineMovVectorEndpoint, nextCirclePosition) < circle.radius;
		const possibleC = closestMovVectorLineStartpoint && Test.vectorVectorDistance(closestMovVectorLineStartpoint, line.vectorA) < circle.radius;
		const possibleD = closestMovVectorLineEndpoint && Test.vectorVectorDistance(closestMovVectorLineEndpoint, line.vectorB) < circle.radius;
		
		if (possibleA || possibleB || possibleC || possibleD) {
			//debugger;
			return true;
		}
		return false;
	}
}

export default Test;