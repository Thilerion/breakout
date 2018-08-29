import UI from './ui.js';
import { BlockLayout, Block } from './blocks.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

import { layoutA } from './config/layouts.js';

class Game {
	constructor() {
		this.blocks;
		this.ui;
		
		this.running = false;
	}

	init() {
		let ui = new UI(canvas, ctx).init();

		const area = ui.gameArea;

		let blockLayout = BlockLayout.init(layoutA).setArea(area).positionBlocks();
		this.blocks = blockLayout;
		return this;
	}

	start() {
		this.running = true;
		requestAnimationFrame(() => this.loop());
		return this;
	}

	loop() {
		requestAnimationFrame(() => this.loop());
		if (this.running) {
			this.update();
		}
		this.render();
	}

	render() {
		this.blocks.render(ctx, "#CCCCCC");
		return this;
	}

	update() {

	}
}

export const game = new Game().init().render().start();