const layoutA = {
	blocks: [
		[1, 1, 1, 0, 0, 1, 1, 1],
		[1, 1, 1, 0, 0, 1, 1, 1],
		[1, 1, 1, 0, 0, 1, 1, 1],
		[1, 1, 1, 0, 0, 1, 1, 1],
		[1, 1, 1, 0, 0, 1, 1, 1],
		[0, 0, 1, 1, 1, 1, 0, 0],
		[0, 0, 1, 1, 1, 1, 0, 0]
	],
	areaPadding: {
		top: 60,
		left: 60,
		right: 60,
		bottom: 375
	},
	blockMargin: {
		x: 0.125,
		y: 0.5
	},
	blockHeightRatio: {
		min: 0.3,
		optimal: 0.4
	},
	rows: 7,
	cols: 8,
	amount: null
}

layoutA.amount = [].concat(...layoutA.blocks).reduce((acc, val) => val ? ++acc : acc, 0);

export { layoutA };