export default class Ball {
	constructor({ diameter, speed }) {
		this.diameter = diameter;
		this.speed = speed * 2;

		//				270 (1.5 * PI)
		// 180 (PI)						0 or 360 (0 or 2 * PI)
		//				90 (0.5 * PI)
		//this.angle = 315;

		this.x, this.y, this.gameArea, this.paddleX;
		this.vx = 0.738, this.vy = -1;
	}

	get dx() {
		return this.vx * this.speed;
	}

	get dy() {
		return this.vy * this.speed;
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

	_calculateVector(angle) {
		return {
			vx: Math.cos(this._toRadians(angle)),
			vy: Math.sin(this._toRadians(angle))
		};
	}

	_reflect(objectAngle) {
		const nx = -Math.sin(this._toRadians(objectAngle));
		const ny = Math.cos(this._toRadians(objectAngle));

		const dot = this.vx * nx + this.vy * ny;

		this.vx = this.vx - 2 * dot * nx;
		this.vy = this.vy - 2 * dot * ny;
	}

	collisionCheck(ballX, ballY, { x0, x1, y0, y1, outside }) {
		if (!outside) {
			//walls
			const right = ballX + this.diameter;
			const left = ballX - this.diameter;
			const top = ballY - this.diameter;
			const bottom = ballY + this.diameter;

			let reflection;

			if (right >= x1 || left <= x0) {
				reflection = reflection ? reflection + 90 : 90;
			}
			if (top <= y0 || bottom >= y1) {
				reflection = reflection != null ? reflection + 360 : 360;
			}

			if (reflection != null) {
				this._reflect(reflection);
				return true;
			}
			return false;
		}
	}

	move(area) {
		//const { dx, dy } = this._calculateVector(this.angle, this.speed);
		//this.dx = dx;
		//this.dy = dy;

		if (!this.collisionCheck(this.x, this.y, area)) {
			this.collisionCheck(this.x + this.dx, this.y + this.dy, area);
		}

		this.x += this.dx;
		this.y += this.dy;
	}
}