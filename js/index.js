import UI from './ui.js';
import { BlockLayout, Block } from './blocks.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

import { layoutA } from './config/layouts.js';

class Game {
	constructor() {
		this.blocks;
		this.ui;
	}

	init() {
		let ui = new UI(canvas, ctx).init();

		const area = ui.gameArea;

		let blockLayout = BlockLayout.init(layoutA).setBlockSpacing(area);
		this.blocks = blockLayout;
		return this;
	}

	loop() {

	}

	render() {
		this.blocks.render(ctx, "#CCCCCC");
	}

	update() {

	}
}

export const game = new Game().init().render();