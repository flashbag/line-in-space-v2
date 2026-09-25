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
	constructor(registry, camera) {
		this.registry = registry;
		this.camera = camera;
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
			this.registry.get(name + 'text').rotation.y = this.camera.rotation.y;
		});
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
			const geometry = new THREE.TextGeometry(label, { size: size, height: 0.3 });
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

		mesh.rotation.y = this.camera.rotation.y;
		mesh.position.set(
			point.x - geometry.textWidth / 2,
			point.y + geometry.textHeight / 3,
			point.z
		);
		mesh.geometry.verticesNeedUpdate = true;
	}
}
