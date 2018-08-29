export default class Block {
	constructor() {
		this.x, this.y, this.w, this.h;
	}

	setPosition(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		return this;
	}

	draw(ctx, color) {
		ctx.fillStyle = color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		return this;
	}
}