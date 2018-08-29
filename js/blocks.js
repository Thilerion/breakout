import { blockOptions } from './config/index.js';

export class BlockLayout {
	constructor(rows, cols, amount, blocks, areaPadding, blockMargin, blockHeightRatio) {
		this.rows = rows;
		this.cols = cols;
		this.amount = amount;
		this.blocks = blocks;
		this.areaPadding = areaPadding;
		this.blockMargin = blockMargin;
		this.blockHeightRatio = blockHeightRatio;

		this.areaHeight, this.areaWidth;
	}

	static init(layout) {
		const { blocks: layoutBlocks, areaPadding, blockMargin, rows, cols, amount, blockHeightRatio } = layout;

		const blocks = [];

		for (let i = 0; i < rows; i++) {
			blocks.push([]);
			for (let j = 0; j < cols; j++) {
				if (layoutBlocks[i][j]) {
					blocks[i].push(new Block());
				}
				else {
					blocks[i].push(null);
				}
			}
		}
		return new BlockLayout(rows, cols, amount, blocks, areaPadding, blockMargin, blockHeightRatio);
	}

	setBlockSpacing(area) {
		const blockAreaWidth = area.x1 - area.x0 - this.areaPadding.left - this.areaPadding.right;
		const blockAreaHeight = area.y1 - area.y0 - this.areaPadding.top - this.areaPadding.bottom;

		let x0 = area.x0 + this.areaPadding.left;
		const x1 = x0 + blockAreaWidth;
		const y0 = area.y0 + this.areaPadding.top;
		const y1 = y0 + blockAreaHeight;

		const availableWidth = x1 - x0;
		const availableHeight = y1 - y0;

		const rows = this.rows;
		const cols = this.cols;

		let blockXMargin, blockYMargin;
		let blockWidth, blockHeight;

		if (this.blockMargin.x < 1) {
			//Relative to space
			const totalMargin = this.blockMargin.x * availableWidth;
			const totalBlockWidth = ((1 - this.blockMargin.x) * availableWidth);
			const rawBlockWidth = totalBlockWidth / cols;			
			const rawBlockXMargin = totalMargin / (cols - 1);

			const leftoverWidth = (rawBlockWidth % 1);
			const leftoverXMargin = (rawBlockXMargin % 1);

			blockWidth = rawBlockWidth - leftoverWidth;
			blockXMargin = rawBlockXMargin - leftoverXMargin;

			const totalLeftoverWidth = Math.round(leftoverWidth * cols);
			const totalLeftoverXMargin = Math.round(leftoverXMargin * (cols - 1));

			//add all leftovers to left and right sides
			const leftovers = Math.floor((totalLeftoverWidth + totalLeftoverXMargin) / 2);
			x0 += leftovers;

			console.log({ blockWidth, blockXMargin });
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
					const left = x0 + x * (blockWidth + blockXMargin);
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
				if (this.blocks[y][x] != null) {
					this.blocks[y][x].draw(ctx, blockColor);
				}				
			}
		}
		return this;
	}
}

export class Block {
	constructor() {
		this.x, this.y, this.w, this.h;
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