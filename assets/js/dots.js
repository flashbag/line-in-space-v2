import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { COLORS } from './config.js';

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

const LABELED_DOTS = TEXT_GROUPS.reduce((all, group) => all.concat(group.names), []);

/** Every dot sphere and its floating text label. */
export class DotLayer {
	constructor(registry, camera, font) {
		this.registry = registry;
		this.camera = camera;
		this.font = font;
		// Text geometries are expensive to build, so they are created once per
		// label and only the mesh position is updated afterwards.
		this.textGeometries = {};
	}

	/** Create the dot and label meshes, or reposition them if they already exist. */
	build(model) {
		DOT_GROUPS.forEach((group) => {
			group.names.forEach((name) => {
				this._buildDot(model, name, group.radius, group.color);
			});
		});
		TEXT_GROUPS.forEach((group) => {
			group.names.forEach((name) => {
				this._buildLabel(model, name, group.size, group.color);
			});
		});
	}

	/** Keep the labels facing the camera while the user orbits. */
	rotateLabels() {
		LABELED_DOTS.forEach((name) => {
			const mesh = this.registry.get(name + 'text');
			mesh.rotation.y = this._labelYaw(mesh.position);
		});
	}

	// Yaw from the label towards the camera. camera.rotation.y is a Euler
	// angle limited to -90°..90°, which made labels face away from the
	// camera outside that sector; atan2 over the full circle does not.
	_labelYaw(position) {
		return Math.atan2(
			this.camera.position.x - position.x,
			this.camera.position.z - position.z
		);
	}

	_buildDot(model, name, radius, color) {
		if (!this.registry.has(name)) {
			const geometry = new THREE.SphereGeometry(radius, 15, 15);
			const material = new THREE.MeshBasicMaterial({ color: color });
			this.registry.register(name, new THREE.Mesh(geometry, material));
		}
		const point = model.get(name);
		this.registry.get(name).position.set(point.x, point.y, point.z);
	}

	_textGeometry(label, size) {
		if (!this.textGeometries[label]) {
			const geometry = new TextGeometry(label, { font: this.font, size: size, depth: 0.3 });
			geometry.computeBoundingBox();
			geometry.textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
			geometry.textHeight = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
			this.textGeometries[label] = geometry;
		}
		return this.textGeometries[label];
	}

	_buildLabel(model, name, size, color) {
		const geometry = this._textGeometry(name, size);
		const key = name + 'text';

		if (!this.registry.has(key)) {
			const material = new THREE.MeshBasicMaterial({ color: color });
			this.registry.register(key, new THREE.Mesh(geometry, material));
		}

		const mesh = this.registry.get(key);
		const point = model.get(name);

		mesh.position.set(
			point.x - geometry.textWidth / 2,
			point.y + geometry.textHeight / 3,
			point.z
		);
		mesh.rotation.y = this._labelYaw(mesh.position);
	}
}
