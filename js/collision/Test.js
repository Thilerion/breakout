import { Vector } from './Bodies.js';

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
			console.warn(`Determinant (${det}) is zero, so no solutions.`);
			return null;
		}
	},

	vectorLineSegment(vector, line) {
		const [l1, l2] = line.vectors;
		const x = vector.x;
		const y = vector.y;
		
		const onX = (Math.min(l1.x, l2.x) <= x) && (x <= Math.max(l1.x, l2.x));
		const onY = (Math.min(l1.y, l2.y) <= y) && (y <= Math.max(l1.y, l2.y));

		return (onX && onY);
	},

	lineSegmentLineSegmentIntersection(lineA, lineB) {
		let intersection = Test.lineLineIntersection(lineA, lineB);

		if (!intersection) return intersection;

		if (Test.vectorLineSegment(intersection, lineA) && Test.vectorLineSegment(intersection, lineB)) {
			return intersection;
		} else {
			console.warn(`Intersection found (${intersection.x}, ${intersection.y}) was not on both lines.`);
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

	vectorClosesVectorToLineSegment(vector, line) {
		const closest = Test.vectorClosestVectorToLine(vector, line);
		if (Test.vectorLineSegment(closest, line)) {
			return closest;
		} else {
			console.warn("The closest vector is not on the line. If this is checking a circle, the radius may have hit the endvector though.");
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

		if (distance === 0) {
			//console.log("Circle is exactly on the line.");
			return 0;
		} else if (distance < circle.radius) {
			//console.log("Circle is touching the line.");
			return distance;
		} else {
			//console.log("Circle is not touching the line.");
			return null;
		}
	},

	circleLineSegmentCollision(circle, line) {
		// Determine the distance from the circle to the line by first finding the closest vector on the line to the center of the circle (vector1) using the closest line on a vector to a line algorithm.
		const closest = Test.vectorClosestVectorToLine(circle.vector, line);
		const closestOnSegment = Test.vectorLineSegment(closest, line);
		const distance = Test.vectorVectorDistance(closest, circle.vector);

		if (closestOnSegment && distance === 0) {
			//console.log("Circle is exactly on the line.");
			return true;
		} else if (closestOnSegment && distance < circle.radius) {
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
	}
}

export default Test;