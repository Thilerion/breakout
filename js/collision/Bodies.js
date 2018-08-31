export class Vector {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	get len() {
		return Math.sqrt(this.dot(this));
	}

	add(vec) {
		if (vec instanceof Vector) {
			this.x += vec.x;
			this.y += vec.y;
		} else {
			this.x += vec;
			this.y += vec;
		}
		return this;
	}

	subtract(vec) {
		if (vec instanceof Vector) {
			this.x -= vec.x;
			this.y -= vec.y;
		} else {
			this.x -= vec;
			this.y -= vec;
		}
		return this;
	}

	scale(v) {
		// Multiply vector by a scalar, increasing its length/magnitude
		this.x *= v;
		this.y *= v;
		return this;
	}

	dot(vec) {
		// Multiply vector by a vector, returning a scalar
		return this.x * vec.x + this.y * vec.y;
	}

	divide(v) {
		// Opposite of scale
		if (v != 0) {
			return this.scale(1 / v);
		}
		return this;
	}

	normalize() {
		return this.divide(this.len);
	}

	set(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}

	copy() {
		return new Vector(this.x, this.y);
	}

	getPerp() {
		// To get the 2D vector perpendicular (its normal) to another 2D vector simply swap the X and Y components and negate the new Y component. So { x, y } becomes { y | -x }.
		return new Vector(this.y, -this.x);
		// Also possible: (-y|x) is the right-hand side vector.
	}

	project(normalAxis) {
		console.log(this.x, this.y);
		const amt = this.dot(normalAxis);
		this.x = amt * normalAxis.x;
		this.y = amt * normalAxis.y;
		return this;
	}

	reflect(normalAxis) {
		const dotdot = this.dot(normalAxis.copy()) * 2;
		const ref = normalAxis.copy().scale(dotdot);
		return this.subtract(ref);
	}
}

export class Circle {
	constructor(vector, radius) {

		if (vector instanceof Vector) {
			this.vector = vector;
		} else {
			this.vector = new Vector(vector.x, vector.y);
		}
		
		this.radius = radius;
	}

	copy() {
		return new Circle(this.vector.copy(), this.radius);
	}
}

export class Line {
	constructor(vectorA, vectorB) {

		if (vectorA instanceof Vector) {
			this.vectorA = vectorA;
		} else {
			this.vectorA = new Vector(vectorA.x, vectorA.y);
		}

		if (vectorB instanceof Vector) {
			this.vectorB = vectorB;
		} else {
			this.vectorB = new Vector(vectorB.x, vectorB.y);
		}
	}

	get vectors() {
		return [this.vectorA, this.vectorB];
	}

	getNormal() {
		return this.vectorA.copy().subtract(this.vectorB).getPerp();
	}
}

export class Rectangle {
	constructor(vector, width, height) {

		if (vector instanceof Vector) {
			this.startVector = vector;
		} else {
			this.startVector = new Vector(vector.x, vector.y);
		}

		this.width = width;
		this.height = height;

		this.vectors = [
			// from topLeft, clockwise
			this.startVector,
			new Vector(this.startVector.x + this.width, this.startVector.y),
			new Vector(this.startVector.x + this.width, this.startVector.y + this.height),
			new Vector(this.startVector.x, this.startVector.y + this.height)
		];

		this.edges = [
			//top, right, bottom, left
			new Line(this.vectors[0], this.vectors[1]),
			new Line(this.vectors[1], this.vectors[2]),
			new Line(this.vectors[2], this.vectors[3]),
			new Line(this.vectors[3], this.vectors[0])
		]
	}

	get pos() {
		return this.startVector;
	}

	get w() {
		return this.width;
	}

	get h() {
		return this.height;
	}
}