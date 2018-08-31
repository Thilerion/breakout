import { Vector, Line, Circle, Rectangle } from './collision/Bodies.js';
import Test from './collision/Test.js';

export default class Ball {
	constructor({ radius, speed }) {
		this.radius = radius;
		this.speed = speed * 25;

		this.pos;
		this.dir = new Vector(0.6, -1).normalize();
		this.gameArea, this.paddleX;
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
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
		ctx.closePath();
		ctx.fillStyle = color;
		ctx.fill();
		return this;
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
		const rectangle = new Rectangle(new Vector(this.gameArea.x0, this.gameArea.y0), this.gameArea.x1 - this.gameArea.x0, this.gameArea.y1 - this.gameArea.y0);
		const circle = new Circle(this.pos.copy().add(this.dir.copy().scale(this.speed)), this.radius);

		let collided = this.collisionCheckRect(rectangle, circle);
		
		this.pos.x += this.dx;
		this.pos.y += this.dy;

		if (this.pos.y < 20) debugger;
	}
}