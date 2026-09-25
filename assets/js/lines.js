import { COLORS } from './config.js';
import { objects } from './registry.js';

// Each line is registered in `objects` under the concatenation of its two
// endpoint names (e.g. ['A','B'] -> 'AB'), which the visibility checkboxes
// in index.html rely on.
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

function buildLine(points, pair, width, color) {
	const key = pair.join('');

	if (!objects[key]) {
		const geometry = new THREE.Geometry();
		const material = new THREE.LineBasicMaterial({ color: color, linewidth: width });
		geometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0));
		objects[key] = new THREE.Line(geometry, material);
	}

	pair.forEach(function (dotName, index) {
		const vertex = objects[key].geometry.vertices[index];
		vertex.x = points[dotName].x;
		vertex.y = points[dotName].y;
		vertex.z = points[dotName].z;
	});

	objects[key].geometry.verticesNeedUpdate = true;
}

/** Create the line meshes, or update their endpoints if they already exist. */
export function buildLines(points) {
	LINE_GROUPS.forEach(function (group) {
		group.pairs.forEach(function (pair) {
			buildLine(points, pair, group.width, group.color);
		});
	});
}
