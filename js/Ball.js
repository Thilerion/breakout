export default class Ball {
	constructor({ diameter, speed }) {
		this.diameter = diameter;
		this.speed = speed * 5;

		//				270 (1.5 * PI)
		// 180 (PI)						0 or 360 (0 or 2 * PI)
		//				90 (0.5 * PI)
		//this.angle = 315;

		this.x, this.y, this.gameArea, this.paddleX;
		this.vx = -0.738, this.vy = -1;
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

			let reflections = {
				top: false,
				bottom: false,
				left: false,
				right: false
			};

			let refAngle;

			// let overlapX = 0;
			// let overlapY = 0;
			if (right >= x1) {
				reflections.right = true;
			} else if (left <= x0) {
				reflections.left = true;
			}
			if (top <= y0) {
				reflections.top = true;
			} else if (bottom >= y1) {
				reflections.bottom = true;
			}

			if (reflections.left && reflections.top) {
				debugger;
				refAngle = 135;
			} else if (reflections.right && reflections.top) {
				debugger;
				refAngle = 225;
			} else if (reflections.right && reflections.bottom) {
				debugger;
				refAngle = 315;
			} else if (reflections.left && reflections.bottom) {
				debugger;
				refAngle = 45;
			} else if (reflections.left || reflections.right) {
				refAngle = 90;
			} else if (reflections.top || reflections.bottom) {
				refAngle = 180;
			}

			if (refAngle != null) {
				this._reflect(refAngle);
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