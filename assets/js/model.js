import { INITIAL_POINTS } from './config.js';
import { computeDerivedPoints } from './geometry.js';

/**
 * Holds the two defining points A and B plus every derived point, all
 * addressed by name — the same names index.html uses in its
 * data-object attributes.
 */
export class LineModel {
	constructor() {
		this.points = {
			A: Object.assign({}, INITIAL_POINTS.A),
			B: Object.assign({}, INITIAL_POINTS.B),
		};
		this.recalculate();
	}

	recalculate() {
		Object.assign(this.points, computeDerivedPoints(this.points.A, this.points.B));
	}

	setCoordinate(dotName, coordName, value) {
		this.points[dotName][coordName] = value;
		this.recalculate();
	}

	coordinate(dotName, coordName) {
		return this.points[dotName][coordName];
	}

	get(name) {
		return this.points[name];
	}
}
