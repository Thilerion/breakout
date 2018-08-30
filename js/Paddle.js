export default class Paddle {
	constructor({ width, height, speed }) {
		this.width = width;
		this.height = height;
		this.speed = speed;

		this.x, this.y, this.gameArea, this.bottomPadding;
	}

	setPosition(bottomPadding, gameArea) {
		this.bottomPadding = bottomPadding;
		this.gameArea = gameArea;

		const areaWidth = this.gameArea.x1 - this.gameArea.x0;
		const center = this.gameArea.x0 + (areaWidth / 2);
		this.x = center - (this.width / 2);

		this.y = this.gameArea.y1 - this.height - this.bottomPadding;

		return this;
	}

	move(dir) {
		let newX = this.x + (this.speed * dir);

		if (newX < this.gameArea.x0) {
			newX = this.gameArea.x0;
		} else if (newX + this.width > this.gameArea.x1) {
			newX = this.gameArea.x1 - this.width;
		}

		this.x = newX;
	}

	render(ctx, color) {
		ctx.fillStyle = color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		return this;
	}
}