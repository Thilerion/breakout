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

class Square {
	constructor(point, width, height) {
		this.point = point;
		this.width = width;
		this.height = height;
	}

	get pos() {
		return this.point.pos;
	}

	get w() {
		return this.width;
	}

	get h() {
		return this.height;
	}
}