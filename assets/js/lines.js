import { COLORS } from './config.js';

// Each line is registered under the concatenation of its two endpoint names
// (e.g. ['A','B'] -> 'AB'), which the visibility checkboxes in index.html
// rely on.
const LINE_GROUPS = [
	{ color: COLORS.mainLine, width: 4, pairs: [['A', 'B']] },
	{ color: COLORS.mainLine, width: 1.5, pairs: [['A', 'F'], ['A', 'H'], ['A', 'P']] },
	{
		color: COLORS.projectionLine, width: 1.2, pairs: [
			['A', 'Af'], ['A', 'Ap'], ['A', 'Ah'], ['B', 'Bf'], ['B', 'Bp'], ['B', 'Bh'],
		],
	},
	{
		color: COLORS.projectionLine, width: 1, pairs: [
			['Af', 'Ay'], ['Af', 'Az'], ['Ap', 'Ay'], ['Ap', 'Ax'], ['Ah', 'Ax'], ['Ah', 'Az'],
			['Bf', 'By'], ['Bf', 'Bz'], ['Bp', 'By'], ['Bp', 'Bx'], ['Bh', 'Bx'], ['Bh', 'Bz'],
			['H', 'pH'], ['H', 'fH'], ['P', 'fP'], ['P', 'hP'], ['F', 'pF'], ['F', 'hF'],
		],
	},
	{
		color: COLORS.mainLine, width: 2, pairs: [
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
				this._buildLine(model, pair, group.width, group.color);
			});
		});
	}

	_buildLine(model, pair, width, color) {
		const key = pair.join('');

		if (!this.registry.has(key)) {
			const geometry = new THREE.Geometry();
			const material = new THREE.LineBasicMaterial({ color: color, linewidth: width });
			geometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0));
			this.registry.register(key, new THREE.Line(geometry, material));
		}

		const line = this.registry.get(key);

		pair.forEach((dotName, index) => {
			const vertex = line.geometry.vertices[index];
			const point = model.get(dotName);
			vertex.x = point.x;
			vertex.y = point.y;
			vertex.z = point.z;
		});

		line.geometry.verticesNeedUpdate = true;
	}
}
