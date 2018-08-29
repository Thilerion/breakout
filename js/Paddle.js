export default class Paddle {
	constructor({ width, height, speed }) {
		this.width = width;
		this.height = height;
		this.speed = speed;

		this.x, this.y, this.area;
	}

	setPosition(bottomPadding, area) {
		this.bottomPadding = bottomPadding;
		this.area = area;

		const areaWidth = this.area.x1 - this.area.x0;
		const center = this.area.x0 + (areaWidth / 2);
		this.x = center - (this.width / 2);

		this.y = this.area.y1 - this.height - this.bottomPadding;

		return this;
	}

	move(dir) {
		let newX = this.x + (this.speed * dir);

		console.log(newX);

		if (newX < this.area.x0) {
			newX = this.area.x0;
		} else if (newX + this.width > this.area.x1) {
			newX = this.area.x1 - this.width;
		}

		this.x = newX;
	}

	render(ctx, color) {
		ctx.fillStyle = color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		return this;
	}
}