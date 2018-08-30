export default class Ball {
	constructor({ radius, speed }) {
		this.radius = radius;
		this.speed = speed * 1;

		//				270 (1.5 * PI)
		// 180 (PI)						0 or 360 (0 or 2 * PI)
		//				90 (0.5 * PI)
		//this.angle = 315;

		this.x, this.y, this.gameArea, this.paddleX;
		this.vx = -0.6, this.vy = -1;
	}

	get diameter() {
		return this.radius * 2;
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

		this.y = this.paddleX - (this.radius * 2);

		return this;
	}

	render(ctx, color) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius * 2, 0, 2 * Math.PI, false);
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
			const right = ballX + this.radius;
			const left = ballX - this.radius;
			const top = ballY - this.radius;
			const bottom = ballY + this.radius;

			let reflections = {
				top: false,
				bottom: false,
				left: false,
				right: false
			};

			let refAngle;
			let overlapX = 0;
			let overlapY = 0;

			if (right >= x1) {
				reflections.right = true;
				overlapX += right - x1;
			} else if (left <= x0) {
				reflections.left = true;
				overlapX += left - x0;
			}
			if (top <= y0) {
				reflections.top = true;
				overlapY += y0 - top;
			} else if (bottom >= y1) {
				reflections.bottom = true;
				overlapY += y1 - bottom;
			}

			if (reflections.left && reflections.top) {
				refAngle = 135;
			} else if (reflections.right && reflections.top) {
				refAngle = 225;
			} else if (reflections.right && reflections.bottom) {
				refAngle = 315;
			} else if (reflections.left && reflections.bottom) {
				refAngle = 45;
			} else if (reflections.left || reflections.right) {
				refAngle = 90;
			} else if (reflections.top || reflections.bottom) {
				refAngle = 180;
			}

			if (refAngle != null) {
				this.x += overlapX;
				this.y += overlapY;
				this._reflect(refAngle);

				if (this.x + this.dx < x0 || this.x + this.dx > x1 || this.y + this.dy < y0 || this.y + this.dy > y1) {
					console.warn("collided again!!");
				}

				return true;
			}
			return false;
		}
	}

	move(area) {
		this.collisionCheck(this.x + this.dx, this.y + this.dy, area);

		this.x += this.dx;
		this.y += this.dy;
	}
}