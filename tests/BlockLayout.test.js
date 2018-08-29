import BlockLayout from '../js/BlockLayout.js';
import Block from '../js/Block.js';
jest.mock('../js/Block.js');

import { layoutA } from '../js/config/layouts.js';

const testLayout = {
	...layoutA, blocks: [
		[1, 1, 1, 1],
		[0, 0, 1, 1],
		[0, 0, 0, 0],
		[1, 1, 0, 1]
	], rows: 4, cols: 4, amount: 9, areaPadding: { top: 10, left: 11, right: 12, bottom: 13	}
};

const testLayout2 = {
	...layoutA, blocks: [
		[1, 1, 0, 1],
		[0, 1, 1, 0]
	],
	rows: 2,
	cols: 4,
	amount: 5,
	areaPadding: {
		top: 39,
		left: 60,
		right: 40,
		bottom: 161
	},
	blockMargin: {
		x: 0.2,
		y: 0.6
	},
	blockHeightRatio: {
		min: 0.25,
		optimal: 0.5
	}
};
const testArea2 = { x0: 62, x1: 1162, y0: 62, y1: 762 };

const testArea = { x0: 10, x1: 980, y0: 10, y1: 476 };

let blockLayout;

beforeAll(() => {
	blockLayout = BlockLayout.init(testLayout);
})

describe("static init method", () => {

	test("returns a new BlockLayout instance", () => {
		expect(BlockLayout.init(layoutA)).toBeInstanceOf(BlockLayout);
	})

	test("initializing gives an object with correct layout properties", () => {
		expect(blockLayout).toHaveProperty('rows', testLayout.rows);
		expect(blockLayout).toHaveProperty('cols', testLayout.cols);
		expect(blockLayout).toHaveProperty('amount', testLayout.amount);
		expect(blockLayout).toHaveProperty('blockMargin');
		expect(blockLayout).toHaveProperty('areaPadding');
		expect(blockLayout).toHaveProperty('blockHeightRatio');
		
		expect(blockLayout).toHaveProperty('blocks');
	})

	test("generates the correct amount of array items", () => {
		expect(blockLayout.blocks.length).toBe(blockLayout.rows);
		expect(blockLayout.blocks[0].length).toBe(blockLayout.cols);
	})

	test("generates a new Block in an array for every truthy value", () => {
		Block.mockClear();
		expect(Block).not.toHaveBeenCalled();
		blockLayout = BlockLayout.init(testLayout);
		expect(blockLayout.blocks[0][0]).toBeInstanceOf(Block);
		expect(blockLayout.blocks[1][1]).toBeFalsy();
		expect(blockLayout.blocks[1][2]).toBeInstanceOf(Block);
		expect(Block).toHaveBeenCalledTimes(testLayout.amount);
	})
})

describe("set area method and related properties", () => {
	test("setArea method returns itself", () => {
		expect(blockLayout).toBe(blockLayout.setArea(testArea));
	})

	describe("properties related to setArea method", () => {
		const testAreaWidth = testArea.x1 - testArea.x0;
		const sidePaddings = testLayout.areaPadding.left + testLayout.areaPadding.right;
		const testAreaHeight = testArea.y1 - testArea.y0;

		test("blockAreaWidth property is areaWidth minus padding", () => {
			expect(blockLayout.blockAreaWidth).toBe(testAreaWidth - sidePaddings);
		})

		test("blockAreaHeight property is areaHeight minus padding", () => {
			expect(blockLayout.blockAreaHeight).toBe(testAreaHeight - sidePaddings);
		})

		test("blockArea coords are blockAreaWidth/height apart from eachother", () => {
			const { x0: blockX0, x1: blockX1, y0: blockY0, y1: blockY1 } = blockLayout.blockArea;

			expect(blockX1 - blockX0).toBe(blockLayout.blockAreaWidth);
			expect(blockY1 - blockY0).toBe(blockLayout.blockAreaHeight);
		})
	})
})

describe("calculate relative block widths", () => {
	let marginPercentage, availableWidth, cols;
	let blockWidth, blockXMargin, leftovers;

	beforeAll(() => {
		blockLayout = BlockLayout.init(testLayout2).setArea(testArea2);

		marginPercentage = testLayout2.blockMargin.x;
		availableWidth = blockLayout.blockAreaWidth;
		cols = testLayout2.cols;
	})

	test("returns blockWidth, blockXMargin, and leftovers", () => {
		const result = blockLayout._calculateRelativeBlockWidths(marginPercentage, availableWidth, cols);
		expect(result).toHaveProperty('blockWidth');
		expect(result).toHaveProperty('blockXMargin');
		expect(result).toHaveProperty('leftovers');
	})

	test("block widths, margins, and leftovers equal available width", () => {
		({ blockWidth, blockXMargin, leftovers } = blockLayout._calculateRelativeBlockWidths(marginPercentage, availableWidth, cols));
		const total = (blockWidth * cols) + (blockXMargin * (cols - 1)) + leftovers;
		expect(total).toBe(availableWidth);
	})

	test("margin is correct percentage of margin+block", () => {
		({ blockWidth, blockXMargin, leftovers } = blockLayout._calculateRelativeBlockWidths(marginPercentage, availableWidth, cols));
		const toCheck = blockXMargin;
		const expected = (blockWidth + blockXMargin) * marginPercentage;
		expect(Math.abs(toCheck - expected)).toBeLessThan(1);
	})
})

describe("calculate relative block heights", () => {

	beforeEach(() => {
		blockLayout = BlockLayout.init(testLayout2).setArea(testArea2);
	})

	test("returns optimal blockHeight and blockYMargin when enough space", () => {
		const res = blockLayout._calculateRelativeBlockHeights(0.1, 100, { min: 0.1, optimal: 0.5 }, 1000, 10);
		
		console.log(res);

		const totalSpace = (res.blockHeight * 10) + (res.blockYMargin * 9);
		expect(totalSpace).toBeLessThanOrEqual(1000);

		expect()
	})

	test("returns minimal blockHeight and blockYMargin when more space needed than available", () => {
		const res = blockLayout._calculateRelativeBlockHeights(0.1, 100, { min: 0.5, optimal: 0.6}, 1000, 20);
		
		console.log(res);

		const totalSpace = (res.blockHeight * 20) + (res.blockYMargin * 19);
		expect(totalSpace).toBeGreaterThan(1000);
	})

	test("returns available height and margin when space needed is more than optimal, but less than available", () => {
		const res = blockLayout._calculateRelativeBlockHeights(0.1, 100, { min: 0.1, optimal: 2.5 }, 1000, 10);
		
		console.log(res);

		const totalSpace = (res.blockHeight * 10) + (res.blockYMargin * 9);
		expect(totalSpace).toBeLessThanOrEqual(1000);
	})
})


describe.only("position blocks method", () => {
	beforeEach(() => {
		Block.mockClear();
		blockLayout = BlockLayout.init(testLayout2).setArea(testArea2);
	})

	test("returns itself", () => {
		expect(blockLayout.positionBlocks()).toBe(blockLayout);
	})

	test("sets position for each Block instance", () => {
		expect(Block).toHaveBeenCalledTimes(testLayout2.amount);
		expect(Block.mock.instances[0].setPosition).not.toHaveBeenCalled();
		blockLayout.positionBlocks();
		expect(Block.mock.instances[0].setPosition).toHaveBeenCalledTimes(1);
	})
})