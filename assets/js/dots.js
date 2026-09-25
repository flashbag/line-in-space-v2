import { COLORS } from './config.js';
import { objects } from './registry.js';

const DOT_GROUPS = [
	{ names: ['A', 'B'], radius: 1.5, color: COLORS.mainDot },
	{ names: ['F', 'H', 'P'], radius: 1.2, color: COLORS.traceDot },
	{ names: ['Ax', 'Ay', 'Az', 'Bx', 'By', 'Bz'], radius: 0.5, color: COLORS.traceDot },
	{ names: ['Af', 'Ap', 'Ah', 'Bf', 'Bp', 'Bh'], radius: 0.5, color: COLORS.traceDot },
	{ names: ['pF', 'hF', 'pH', 'fH', 'hP', 'fP'], radius: 0.5, color: COLORS.traceDot },
];

const TEXT_GROUPS = [
	{ names: ['A', 'B'], size: 7, color: COLORS.mainText },
	{ names: ['F', 'H', 'P'], size: 5, color: COLORS.traceText },
	{ names: ['pF', 'hF', 'pH', 'fH', 'hP', 'fP'], size: 4, color: COLORS.traceText },
];

const LABELED_DOTS = TEXT_GROUPS.reduce(function (all, group) {
	return all.concat(group.names);
}, []);

// Text geometries are expensive to build, so they are created once per label
// and only the mesh position is updated afterwards.
const textGeometries = {};

function buildDotGroup(points, names, radius, color) {
	names.forEach(function (name) {
		if (!objects[name]) {
			const geometry = new THREE.SphereGeometry(radius, 15, 15);
			const material = new THREE.MeshBasicMaterial({ color: color });
			objects[name] = new THREE.Mesh(geometry, material);
		}
		objects[name].position.set(points[name].x, points[name].y, points[name].z);
	});
}

function getTextGeometry(label, size) {
	if (!textGeometries[label]) {
		const geometry = new THREE.TextGeometry(label, { size: size, height: 0.3 });
		geometry.computeBoundingBox();
		geometry.textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
		geometry.textHeight = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
		textGeometries[label] = geometry;
	}
	return textGeometries[label];
}

function buildTextGroup(points, camera, names, size, color) {
	names.forEach(function (name) {
		const geometry = getTextGeometry(name, size);
		const key = name + 'text';

		if (!objects[key]) {
			const material = new THREE.MeshBasicMaterial({ color: color });
			objects[key] = new THREE.Mesh(geometry, material);
		}

		objects[key].rotation.y = camera.rotation.y;
		objects[key].position.set(
			points[name].x - geometry.textWidth / 2,
			points[name].y + geometry.textHeight / 3,
			points[name].z
		);
		objects[key].geometry.verticesNeedUpdate = true;
	});
}

/** Create the dot and label meshes, or reposition them if they already exist. */
export function buildDots(points, camera) {
	DOT_GROUPS.forEach(function (group) {
		buildDotGroup(points, group.names, group.radius, group.color);
	});
	TEXT_GROUPS.forEach(function (group) {
		buildTextGroup(points, camera, group.names, group.size, group.color);
	});
}

/** Keep the labels facing the camera while the user orbits. */
export function rotateTexts(camera) {
	LABELED_DOTS.forEach(function (name) {
		objects[name + 'text'].rotation.y = camera.rotation.y;
	});
}
