export default class Ball {
	constructor({ diameter, speed }) {
		this.diameter = diameter;
		this.speed = speed;

		//				270 (1.5 * PI)
		// 180 (PI)						0 or 360 (0 or 2 * PI)
		//				90 (0.5 * PI)
		this.angle = 315;

		this.x, this.y, this.gameArea, this.paddleX;
	}

	setPosition(paddleX, gameArea) {
		this.gameArea = gameArea;
		this.paddleX = paddleX;

		const areaWidth = this.gameArea.x1 - this.gameArea.x0;
		this.x = this.gameArea.x0 + (areaWidth / 2);

		this.y = this.paddleX - (this.diameter * 2);

		return this;
	}

	render(ctx, color) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.diameter * 2, 0, 2 * Math.PI, false);
		ctx.closePath();
		ctx.fillStyle = color;
		ctx.fill();
		return this;
	}

	_toRadians(angle) {
		return angle * (Math.PI / 180);
	}

	_calculateVector(angle, speed) {
		return {
			dx: Math.cos(this._toRadians(angle)) * speed,
			dy: Math.sin(this._toRadians(angle)) * speed
		};
	}

	_reflect(objectAngle) {
		const nx = -Math.sin(objectAngle);
		const ny = Math.cos(objectAngle);

		const dot = this.dx * nx + this.dy * ny;

		this.dx = this.dx - 2 * dot * nx;
		this.dy = this.dy - 2 * dot * ny;
	}

	move() {
		const { dx, dy } = this._calculateVector(this.angle, this.speed);
		this.dx = dx;
		this.dy = dy;

		this.x += this.dx;
		this.y += this.dy;
	}
}