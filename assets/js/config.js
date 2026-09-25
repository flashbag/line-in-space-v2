/**
 * Central configuration: colors, sizes and the initial position of the
 * two points that define the line.
 */
export const COLORS = {
	axisX: 0xBB0000,
	axisY: 0x0000BB,
	axisZ: 0x00BB00,
	helperAxis: 0x868686,

	mainDot: 0x19718A,
	traceDot: 0xEE0000,

	mainLine: 0x19718A,
	projectionLine: 0x000000,

	mainText: 0x000000,
	traceText: 0x444444,
};

export const INITIAL_POINTS = {
	A: { x: 90, y: 75, z: 10 },
	B: { x: 30, y: 50, z: 45 },
};

export const SLIDER_RANGE = { min: 0, max: 100 };
