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

	get blockArray() {
		if (!Array.isArray(this.blocks)) return [];
		return [].concat(...this.blocks).filter(v => v != null && v.active === true);
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

	_calculateRelativeBlockWidths(blockMargin, availableWidth, cols) {
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

	_calculateRelativeBlockHeights(blockMargin, blockWidth, heightRatios, availableHeight, rows) {
		const marginSpace = (rows + (rows - 1) * blockMargin);
		const availableSpace = (availableHeight / rows) * (rows + blockMargin);
		const minimumNeededSpace = marginSpace * (blockWidth * heightRatios.min);
		const optimalNeededSpace = marginSpace * (blockWidth * heightRatios.optimal);

		let blockHeight, blockYMargin;

		if (optimalNeededSpace <= availableSpace) {
			blockHeight = blockWidth * heightRatios.optimal;
			blockYMargin = Math.floor(blockHeight * blockMargin);
		} else if (availableSpace < minimumNeededSpace) {
			blockHeight = blockWidth * heightRatios.min;
			blockYMargin = Math.floor(blockHeight * blockMargin);
		} else {
			const availablePerBlock = availableSpace / rows;
			blockHeight = availablePerBlock * (1 - blockMargin);
			blockYMargin = Math.floor(availablePerBlock * blockMargin);
		}

		return { blockHeight, blockYMargin };
	}

	positionBlocks() {
		const { x0, y0 } = this.blockArea;

		const availableWidth = this.blockAreaWidth;
		const availableHeight = this.blockAreaHeight;

		const rows = this.rows;
		const cols = this.cols;

		const { leftovers, blockXMargin, blockWidth } = this._calculateRelativeBlockWidths(this.blockMargin.x, availableWidth, cols);

		this.leftoverArea = Math.round(leftovers / 2);
		
		const { blockHeight, blockYMargin } = this._calculateRelativeBlockHeights(this.blockMargin.y, blockWidth, this.blockHeightRatio, availableHeight, rows);

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
		return this;
	}

	render(ctx, blockColor) {
		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.blocks[y].length; x++) {
				if (this.blocks[y][x] != null && this.blocks[y][x].active === true) {
					this.blocks[y][x].draw(ctx, blockColor);
				}				
			}
		}
		return this;
	}
}