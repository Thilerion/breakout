export default class Block {
	constructor() {
		this.x, this.y, this.w, this.h;
		this.active = true;
	}

	get corners() {
		if (!this.x || !this.y) return {};
		return { x0: this.x, x1: this.x + this.w, y0: this.y, y1: this.y + this.h };
	}

	hit() {
		this.active = false;
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