import { blockOptions } from './config/index.js';
import Block from './Block.js';

export default class BlockLayout {
	constructor(rows, cols, amount, blocks, areaPadding, blockMargin, blockHeightRatio) {
		this.rows = rows;
		this.cols = cols;
		this.amount = amount;
		this.blocks = blocks;
		this.areaPadding = areaPadding;
		this.blockMargin = blockMargin;
		this.blockHeightRatio = blockHeightRatio;

		this.area;
		this.leftoverArea;
	}

	get blockAreaWidth() {
		return this.blockArea.x1 - this.blockArea.x0;
	}

	get blockAreaHeight() {
		return this.blockArea.y1 - this.blockArea.y0;
	}

	get blockArea() {
		return {
			x0: this.area.x0 + this.areaPadding.left,
			x1: this.area.x1 - this.areaPadding.right,
			y0: this.area.y0 + this.areaPadding.top,
			y1: this.area.y1 - this.areaPadding.bottom
		}
	}

	static init(layout) {
		const { blocks: layoutBlocks, areaPadding, blockMargin, rows, cols, amount, blockHeightRatio } = layout;

		const blocks = [];

		for (let i = 0; i < rows; i++) {
			blocks.push([]);
			for (let j = 0; j < cols; j++) {
				if (layoutBlocks[i][j]) {
					blocks[i][j] = new Block();
				}
				else {
					blocks[i][j] = null;
				}
			}
		}
		return new BlockLayout(rows, cols, amount, blocks, areaPadding, blockMargin, blockHeightRatio);
	}

	setArea(area) {
		this.area = area;
		return this;
	}

	calculateRelativeBlockWidths(blockMargin, availableWidth, cols) {
		/*const totalMargin = blockMargin * availableWidth;
		const totalBlockWidth = ((1 - blockMargin) * availableWidth);
		const rawBlockWidth = totalBlockWidth / cols;			
		const rawBlockXMargin = totalMargin / (cols - 1);

		const leftoverWidth = (rawBlockWidth % 1);
		const leftoverXMargin = (rawBlockXMargin % 1);

		const blockWidth = rawBlockWidth - leftoverWidth;
		const blockXMargin = rawBlockXMargin - leftoverXMargin;

		//add all leftovers to left and right sides
		const totalLeftoverWidth = leftoverWidth * cols;
		const totalLeftoverXMargin = leftoverXMargin * (cols - 1);
		const leftovers = ((totalLeftoverWidth + totalLeftoverXMargin) / 2);

		return { blockWidth, blockXMargin, leftovers };*/

		const blockRatio = (1 - blockMargin) * cols;
		const marginRatio = blockMargin * (cols - 1);
		const totalRatio = blockRatio + marginRatio;

		const totalBlockSpace = Math.round(availableWidth / totalRatio * blockRatio);
		const totalMarginSpace = Math.round(availableWidth / totalRatio * marginRatio);

		const marginWidth = Math.floor(totalMarginSpace / (cols - 1));
		const blockWidth = Math.floor(totalBlockSpace / cols);

		//add all leftovers to left and right sides
		const usedSpace = (marginWidth * (cols - 1)) + (blockWidth * cols);
		const leftovers = availableWidth - usedSpace;

		return { blockWidth, blockXMargin: marginWidth, leftovers };
	}

	positionBlocks() {
		const { x0, y0 } = this.blockArea;

		const availableWidth = this.blockAreaWidth;
		const availableHeight = this.blockAreaHeight;

		const rows = this.rows;
		const cols = this.cols;

		let blockXMargin, blockYMargin;
		let blockWidth, blockHeight;
		let leftovers;

		if (this.blockMargin.x < 1) {
			//Relative to space
			({ leftovers, blockXMargin, blockWidth } = this.calculateRelativeBlockWidths(this.blockMargin.x, availableWidth, cols));

			this.leftoverArea = Math.floor(leftovers / 2);

			console.log({ availableWidth, leftovers, blockXMargin, blockWidth });
		} else {
			//Absolute in pixels
		}
		
		const optimalBlockH = Math.round(blockWidth * this.blockHeightRatio.optimal);

		const spaceYPerBlock = availableHeight / rows;

		if (spaceYPerBlock >= optimalBlockH) {
			blockHeight = optimalBlockH;
		} else {
			const minBlockH = Math.round(blockWidth * this.blockHeightRatio.min);
			if (minBlockH > spaceYPerBlock) {
				console.warn("Using minimum block height specified in layout, but this won't fit!");
				blockHeight = minBlockH;
			} else {
				blockHeight = spaceYPerBlock;
			}
		}

		blockYMargin = Math.floor(blockHeight * this.blockMargin.y);


		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				if (this.blocks[y][x] != null) {
					let block = this.blocks[y][x];
					const left = (x0 + this.leftoverArea) + x * (blockWidth + blockXMargin);
					const top = y0 + y * (blockHeight + blockYMargin);
					
					block.setPosition(left, top, blockWidth, blockHeight);
				}
			}
		}
		console.log(this.blocks);
		return this;
	}

	render(ctx, blockColor) {
		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.blocks[y].length; x++) {
				if (this.blocks[y][x] != null) {
					this.blocks[y][x].draw(ctx, blockColor);
				}				
			}
		}
		return this;
	}
}