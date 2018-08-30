// const radToDeg = rad => {
// 	let deg = rad * 180 / Math.PI;
// 	return deg < 0 ? deg + 360 : deg;
// }

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

export { radToDeg };