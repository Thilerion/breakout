import { Game } from '../js/index.js';
import { layoutA } from '../js/config/layouts.js';

import UI from '../js/ui.js';
const mockGameArea = { x0: 0, x1: 1000, y0: 0, y1: 1000 };
jest.mock('../js/ui.js', () => {
	return function () {
		return {
			gameArea: {...mockGameArea},
			init: jest.fn().mockReturnThis()
		}
	}
});

let game;

beforeAll(() => {
	const canvas = document.createElement("canvas");

	canvas.id = "gameCanvas";
	canvas.width = 1024;
	canvas.height = 768;

	document.body.appendChild(canvas);
})

describe("new Game class object", () => {
	beforeAll(() => {
		game = new Game();
	})

	test("references a canvas element", () => {
		expect(game.canvas).toBeTruthy();
	})

	test("has no UI", () => {
		expect(game.ui).toBeFalsy();
	})

	test("is not running", () => {
		expect(game.running).toBe(false);
	})

	test("has no layout", () => {
		expect(game.layout).toBeFalsy();
	})
})

describe("set layout method", () => {
	beforeEach(() => {
		game = new Game();
	})

	test("setLayout returns itself", () => {
		expect(game).toBe(game.setLayout());
	})

	test("after setting layout, it is assigned to the object", () => {
		expect(game.setLayout(layoutA).layout).toStrictEqual(layoutA);
	})
})

describe("object initUI method", () => {
	beforeEach(() => {
		game = new Game().setLayout(layoutA);
	})

	test("init method returns itself", () => {
		expect(game).toBe(game.initUI());
	})

	test("sets ui.gameArea to area property", () => {
		expect(game.initUI().area).toStrictEqual(mockGameArea);
	})
})

describe("oject initBlocks method", () => {
	beforeEach(() => {
		game = new Game().setLayout(layoutA).initUI();
	})

	test("init blocks method returns itself", () => {
		expect(game).toBe(game.initBlocks());
	})
})