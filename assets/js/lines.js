import * as THREE from 'three';
import { COLORS } from './config.js';

// Each line is registered under the concatenation of its two endpoint names
// (e.g. ['A','B'] -> 'AB'), which the visibility checkboxes in index.html
// rely on.
const LINE_GROUPS = [
	{ color: COLORS.mainLine, pairs: [['A', 'B']] },
	{ color: COLORS.mainLine, pairs: [['A', 'F'], ['A', 'H'], ['A', 'P']] },
	{
		color: COLORS.projectionLine, pairs: [
			['A', 'Af'], ['A', 'Ap'], ['A', 'Ah'], ['B', 'Bf'], ['B', 'Bp'], ['B', 'Bh'],
		],
	},
	{
		color: COLORS.projectionLine, pairs: [
			['Af', 'Ay'], ['Af', 'Az'], ['Ap', 'Ay'], ['Ap', 'Ax'], ['Ah', 'Ax'], ['Ah', 'Az'],
			['Bf', 'By'], ['Bf', 'Bz'], ['Bp', 'By'], ['Bp', 'Bx'], ['Bh', 'Bx'], ['Bh', 'Bz'],
			['H', 'pH'], ['H', 'fH'], ['P', 'fP'], ['P', 'hP'], ['F', 'pF'], ['F', 'hF'],
		],
	},
	{
		color: COLORS.mainLine, pairs: [
			['Af', 'Bf'], ['Ap', 'Bp'], ['Ah', 'Bh'],
			['H', 'hP'], ['H', 'hF'], ['F', 'fP'], ['F', 'fH'], ['P', 'pF'], ['P', 'pH'],
		],
	},
];

/** Every line segment connecting dots, projections and traces. */
export class LineLayer {
	constructor(registry) {
		this.registry = registry;
	}

	/** Create the line meshes, or update their endpoints if they already exist. */
	build(model) {
		LINE_GROUPS.forEach((group) => {
			group.pairs.forEach((pair) => {
				this._buildLine(model, pair, group.color);
			});
		});
	}

	_buildLine(model, pair, color) {
		const key = pair.join('');

		if (!this.registry.has(key)) {
			const geometry = new THREE.BufferGeometry();
			geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
			const material = new THREE.LineBasicMaterial({ color: color });
			const line = new THREE.Line(geometry, material);
			// Endpoints move with the sliders; skip culling instead of
			// recomputing the bounding sphere on every update.
			line.frustumCulled = false;
			this.registry.register(key, line);
		}

		const position = this.registry.get(key).geometry.attributes.position;

		pair.forEach((dotName, index) => {
			const point = model.get(dotName);
			position.setXYZ(index, point.x, point.y, point.z);
		});

		position.needsUpdate = true;
	}
}
