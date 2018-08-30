import { uiOptions } from './config/index.js';

export default class UI {
	constructor(canvas, ctx) {
		const { width, height, edge, border, padding, bgColor, mainColor } = uiOptions;
		
		this.canvas = canvas;
		this.ctx = ctx;

		this.cWidth = width;
		this.cHeight = height;

		this.bgColor = bgColor;
		this.mainColor = mainColor;
		this.edge = edge;
		this.border = border;
	}

	get gameWidth() {
		return this.cWidth - (2 * this.edge) - (2 * this.border);
	}

	get gameHeight() {
		return this.cHeight - (2 * this.edge) - (2 * this.border);
	}

	get gameArea() {
		const x0 = this.edge + this.border;
		const x1 = this.cWidth - x0;
		const y1 = this.cHeight - x0;
		return {
			x0,
			x1,
			y0: x0,
			y1
		};
	}

	get collisionPosition() {
		return {
			...this.gameArea,
			outside: false
		}
	}

	init() {
		this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);
		this.drawBorder();

		return this;
	}

	drawBorder() {
		this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);
		this.ctx.fillStyle = this.mainColor;
		this.ctx.fillRect(this.edge, this.edge, this.cWidth - 2 * this.edge, this.cHeight - 2 * this.edge);
		this.ctx.fillStyle = this.bgColor;
		this.ctx.fillRect((this.edge + this.border), (this.edge + this.border), this.gameWidth, this.gameHeight);
		return this;
	}
}