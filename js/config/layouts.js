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
		top: 40,
		left: 40,
		right: 40,
		bottom: 300
	},
	blockMargin: {
		x: 0.1,
		y: 0.25
	},
	blockHeightRatio: {
		min: 0.3,
		optimal: 0.5
	},
	rows: 7,
	cols: 8,
	amount: null
}

layoutA.amount = [].concat(...layoutA.blocks).reduce((acc, val) => val ? ++acc : acc, 0);

export { layoutA };