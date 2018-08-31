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

	/*cross(vec) {
		// Multiply vector by a vector, returning a vector
		// The resulting vector is at right angles (orthogonal) to both previous vectors with 3d vectors
		// With 2d vectors, the cross product is not defined
	}*/

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