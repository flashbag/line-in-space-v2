import { COLORS } from './config.js';
import { objects } from './registry.js';

const AXIS_LENGTH = 1000;
const HELPER_LENGTH = 200;
const HELPER_STEP = 25;

function createAxisLine(src, dst, colorHex, thin) {
	const geometry = new THREE.Geometry();
	const material = new THREE.LineBasicMaterial({ linewidth: thin ? 1 : 2, color: colorHex });

	geometry.vertices.push(src.clone(), dst.clone());

	return new THREE.Line(geometry, material, THREE.LinePieces);
}

function buildMainAxes() {
	const nullPoint = new THREE.Vector3(0, 0, 0);
	const group = new THREE.Object3D();

	group.add(createAxisLine(nullPoint, new THREE.Vector3(AXIS_LENGTH, 0, 0), COLORS.axisX));
	group.add(createAxisLine(nullPoint, new THREE.Vector3(-AXIS_LENGTH, 0, 0), COLORS.axisX));

	group.add(createAxisLine(nullPoint, new THREE.Vector3(0, AXIS_LENGTH, 0), COLORS.axisY));
	group.add(createAxisLine(nullPoint, new THREE.Vector3(0, -AXIS_LENGTH, 0), COLORS.axisY));

	group.add(createAxisLine(nullPoint, new THREE.Vector3(0, 0, AXIS_LENGTH), COLORS.axisZ));
	group.add(createAxisLine(nullPoint, new THREE.Vector3(0, 0, -AXIS_LENGTH), COLORS.axisZ));

	objects.mainAxes = group;
}

function buildHelperAxes() {
	const length = HELPER_LENGTH;
	const color = COLORS.helperAxis;
	const group = new THREE.Object3D();

	for (let i = -length; i <= length; i += HELPER_STEP) {
		if (i === 0) {
			continue;
		}
		// plane P — Z and X change
		group.add(createAxisLine(new THREE.Vector3(-length, i, 0), new THREE.Vector3(length, i, 0), color, true));
		group.add(createAxisLine(new THREE.Vector3(i, -length, 0), new THREE.Vector3(i, length, 0), color, true));
		// plane F — Z and Y change
		group.add(createAxisLine(new THREE.Vector3(0, i, -length), new THREE.Vector3(0, i, length), color, true));
		group.add(createAxisLine(new THREE.Vector3(0, -length, i), new THREE.Vector3(0, length, i), color, true));
		// plane H — X and Y change
		group.add(createAxisLine(new THREE.Vector3(i, 0, -length), new THREE.Vector3(i, 0, length), color, true));
		group.add(createAxisLine(new THREE.Vector3(-length, 0, i), new THREE.Vector3(length, 0, i), color, true));
	}

	objects.helperAxes = group;
}

export function buildAxes() {
	buildMainAxes();
	buildHelperAxes();
}
