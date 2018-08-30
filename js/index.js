import UI from './ui.js';
import BlockLayout from './BlockLayout.js';
import Paddle from './Paddle.js';
import Ball from './Ball.js';

import { gameOptions } from './config/index.js'

import { layoutA } from './config/layouts.js';

class Game {
	constructor() {
		this.canvas = document.getElementById("gameCanvas");
		this.ctx = this.canvas.getContext("2d");

		this.ui;
		this.layout;
		this.area;

		this.keysActive = [];
		
		this.running = false;
	}

	keyDown(e) {
		if (!this.keysActive.includes(e.key)) {
			this.keysActive.push(e.key);
		}
	}

	keyUp(e) {
		this.keysActive = this.keysActive.filter(val => val != e.key);	
	}

	initControls() {
		document.addEventListener("keydown", (e) => this.keyDown(e), false);
		document.addEventListener("keyup", (e) => this.keyUp(e), false);
		return this;
	}

	initUI() {
		let ui = new UI(this.canvas, this.ctx).init();
		this.area = ui.gameArea;
		return this;
	}

	initBlocks() {
		this.blocks = BlockLayout
			.init(this.layout)
			.setArea(this.area)
			.positionBlocks();
		
		this.paddle = new Paddle(gameOptions.paddle)
			.setPosition(gameOptions.bottomPadding, this.area);
		
		this.ball = new Ball(gameOptions.ball)
			.setPosition(this.paddle.y, this.area);
		
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
		this.ctx.clearRect(this.area.x0, this.area.x0, (this.area.x1 - this.area.x0), (this.area.y1 - this.area.y0));
		this.blocks.render(this.ctx, "#CCCCCC");
		this.paddle.render(this.ctx, "#CCCCCC");
		this.ball.render(this.ctx, "#CCCCCC");
		return this;
	}

	update() {
		this.ball.move();

		let paddleDir = 0;
		if (this.keysActive.includes("ArrowLeft")) {
			paddleDir -= 1;
		}
		if (this.keysActive.includes("ArrowRight")) {
			paddleDir += 1;
		}
		this.paddle.move(paddleDir);
	}
}

function createGame() {
	return new Game().setLayout(layoutA).initUI().initControls().initBlocks().render().start();
}

const newGame = createGame();

// For unit tests
export { Game };