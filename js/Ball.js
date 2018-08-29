export default class Ball {
	constructor({ diameter, speed }) {
		this.diameter = diameter;
		this.speed = speed;

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

	move() {
		
	}
}