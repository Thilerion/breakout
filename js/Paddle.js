export default class Paddle {
	constructor({ width, height, speed }) {
		this.width = width;
		this.height = height;
		this.speed = speed;
	}

	get top() {
		return this.area.y1 - this.height - this.bottomPadding;
	}

	get left() {
		const areaWidth = this.area.x1 - this.area.x0;

		const center = this.area.x0 + (areaWidth / 2);
		return center - (this.width / 2);
	}

	setPosition(bottomPadding, area) {
		this.bottomPadding = bottomPadding;
		this.area = area;
		return this;
	}

	render(ctx, color) {
		ctx.fillStyle = color;
		ctx.fillRect(this.left, this.top, this.width, this.height);
		return this;
	}
}