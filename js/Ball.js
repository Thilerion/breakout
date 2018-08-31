import { Vector, Line, Circle, Rectangle } from './collision/Bodies.js';
import Test from './collision/Test.js';

export default class Ball {
	constructor({ radius, speed }) {
		this.radius = radius;
		this.speed = speed * 10;

		this._pos = new Vector();
		this._mov = new Vector();
		this.dir = new Vector(0.6, -1).normalize();
		this.gameArea, this.paddleX;
		this.circleBody = new Circle(new Vector(), radius);
	}

	set pos({x, y}) {
		this._pos.set(x, y);
	}

	get pos() {
		return this._pos;
	}

	get mov() {
		return this._mov.set(this.dir.x, this.dir.y).scale(this.speed);
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
			/*let collided = !!(Test.circleLineSegmentCollision(circle, edge));
			collided = false;
			if (collided) {
				returnVal = true;
				const normalAxis = edge.getNormal().normalize();
				this.dir.reflect(normalAxis);
			} else {*/
				// Check movement vector
				const collided2 = !!(Test.movingCircleLineSegmentCollision(circle, this.mov, edge));
				if (collided2) {
					//debugger;
					returnVal = true;
					const normalAxis = edge.getNormal().normalize();
					this.dir.reflect(normalAxis);
				//}
			}
		}
		return returnVal;
	}

	move(area, blocksArray) {
		const rectangle = new Rectangle(new Vector(this.gameArea.x0, this.gameArea.y0), this.gameArea.x1 - this.gameArea.x0, this.gameArea.y1 - this.gameArea.y0);
		const circle = new Circle(this.pos, this.radius);

		let collided = this.collisionCheckRect(rectangle, circle);
		
		this.pos.add(this.mov);
	}
}