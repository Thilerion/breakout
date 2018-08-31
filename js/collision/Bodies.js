export class Vector {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	dot(vec) {
		return this.x * vec.x + this.y + vec.y;
	}

	get length() {
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

	multiply(vec) {
		if (vec instanceof Vector) {
			this.x *= vec.x;
			this.y *= vec.y;
		} else {
			this.x *= vec;
			this.y *= vec;
		}
		return this;
	}

	divide(vec) {
		if (vec instanceof Vector) {
			if (vec.x != 0) this.x = this.x / vec.x;
			if (vec.y != 0) this.y = this.y / vec.y;
		} else {
			if (vec != 0) {
				this.x = this.x / vec;
				this.y = this.y / vec;
			}
		}
		return this;
	}

	normalize() {
		return this.divide(this.length);
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