function radToDeg(rad) {
	let deg = rad * (180 / Math.PI);
	if (deg > 360) {
		return deg % 360;
	} else if (deg < 0) {
		const times = Math.abs(Math.floor(deg / 360));
		return (deg + times * 360) % 360;
	}
	return deg;
}

function fixFloat(n) {
	const returnValue = Math.round(n * 1e8) / 1e8;
	return returnValue;
}

export { radToDeg, fixFloat };