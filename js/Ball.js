import { Vector, Line, Circle, Rectangle } from './collision/Bodies.js';
import Test from './collision/Test.js';

export default class Ball {
	constructor({ radius, speed }) {
		this.radius = radius;
		this.speed = speed * 1;

		//				270 (1.5 * PI)
		// 180 (PI)						0 or 360 (0 or 2 * PI)
		//				90 (0.5 * PI)
		//this.angle = 315;

		this.pos;
		this.dir = new Vector(1.2, -1).normalize();
		this.gameArea, this.paddleX;

		
		//this.vx = 0.6, this.vy = -1;
	}

	get diameter() {
		return this.radius * 2;
	}

	get dx() {
		return this.dir.x * this.speed;
	}

	get dy() {
		return this.dir.y * this.speed;
	}

	setInitialPosition(paddleX, gameArea) {
		this.gameArea = gameArea;
		this.paddleX = paddleX;

		const areaWidth = this.gameArea.x1 - this.gameArea.x0;

		const x = this.gameArea.x0 + (areaWidth / 2);
		const y = this.paddleX - (this.radius * 2);

		this.pos = new Vector(x, y);

		return this;
	}

	render(ctx, color) {
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.radius * 2, 0, 2 * Math.PI, false);
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
		return;
		const nx = -Math.sin(this._toRadians(objectAngle));
		const ny = Math.cos(this._toRadians(objectAngle));

		const dot = this.dir.x * nx + this.dir.y * ny;

		const newVx = this.dir.x - 2 * dot * nx;
		const newVy = this.dir.y - 2 * dot * ny;
		this.dir = this.dir.set(newVx, newVy);
	}

	collisionCheck(ballX, ballY, { x0, x1, y0, y1, outside }) {
		const right = ballX + this.radius;
		const left = ballX - this.radius;
		const top = ballY - this.radius;
		const bottom = ballY + this.radius;
		
		if (!outside) {
			//walls
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
				this.pos.x += overlapX;
				this.pos.y += overlapY;
				this._reflect(refAngle);

				if (this.pos.x + this.dx < x0 || this.pos.x + this.dx > x1 || this.pos.y + this.dy < y0 || this.pos.y + this.dy > y1) {
					console.warn("collided again!!");
				}

				return true;
			}
			return false;
		}
		else {
			const topToBot = Math.abs(y1 - top);
			const botToTop = Math.abs(y0 - bottom);
			const leftToRight = Math.abs(x1 - left);
			const rightToLeft = Math.abs(x0 - right);

			const withinX = (right <= x1 && left >= x0);
			const withinY = (bottom <= y1 && top >= y0);
			if (withinX && withinY) {
				const smallest = Math.min(...[topToBot, botToTop, leftToRight, rightToLeft]);
				if (smallest === topToBot || smallest === botToTop) {
					this._reflect(180);
				} else {
					this._reflect(0);
				}
				return true;
			}
		}
		return false;
	}

	collisionCheckRect(rectangle, circle) {
		let returnVal = false;
		for (let edge of rectangle.edges) {
			const collided = !!(Test.circleLineSegmentCollision(circle, edge));
			if (collided) {
				returnVal = true;
				const normalAxis = edge.getNormal().normalize();
				this.dir.reflect(normalAxis);
			}
		}
		return returnVal;
	}

	move(area, blocksArray) {
		//const lineRight = new Line(new Vector(area.x1, area.y0), new Vector(area.x1, area.y1));
		//console.log(lineRight.normals.map(v => v.normalize()));
		const rectangle = new Rectangle(new Vector(area.x0, area.y0), area.x1 - area.x0, area.y1 - area.y0);
		const circle = new Circle(this.pos.copy().add(this.dir.copy().scale(this.speed)), this.radius);

		let collided = this.collisionCheckRect(rectangle, circle);
		
		/*
		if (this.collisionCheck(this.pos.x + this.dx, this.pos.y + this.dy, { ...area, outside: false })) {
			this.dir.reflect(normal);
			console.log(this.dir);
			console.log(normal);
		}
		for (let i = 0; i < blocksArray.length; i++) {
			const hit = this.collisionCheck(this.pos.x + this.dx, this.pos.y + this.dy, { ...blocksArray[i].corners, outside: true });

			if (hit) {
				blocksArray[i].hit();
			}
		}*/
		if (collided) debugger;
		this.pos.x += this.dx;
		this.pos.y += this.dy;
	}
}