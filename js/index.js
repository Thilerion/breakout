import UI from './ui.js';
import BlockLayout from './BlockLayout.js';

import { layoutA } from './config/layouts.js';

class Game {
	constructor() {
		this.canvas = document.getElementById("gameCanvas");
		this.ctx = this.canvas.getContext("2d");

		this.ui;
		this.layout;
		this.area;
		
		this.running = false;
	}

	initUI() {
		let ui = new UI(this.canvas, this.ctx).init();
		this.area = ui.gameArea;
		return this;
	}

	initBlocks() {
		this.blocks = BlockLayout.init(this.layout).setArea(this.area).positionBlocks();
		return this;
	}

	setLayout(layout) {
		this.layout = layout;
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
		this.blocks.render(this.ctx, "#CCCCCC");
		return this;
	}

	update() {

	}
}

function createGame() {
	return new Game().setLayout(layoutA).initUI().initBlocks().render().start();
}

// const newGame = createGame();

// For unit tests
export { Game };