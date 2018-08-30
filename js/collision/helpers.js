const radToDeg = rad => {
	let deg = rad * 180 / Math.PI;
	return deg < 0 ? deg + 360 : deg;
}

export { radToDeg };