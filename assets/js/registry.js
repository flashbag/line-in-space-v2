/**
 * Registry of every named Object3D in the scene. The visibility checkboxes
 * in index.html reference these names through their data-object attributes.
 */
export class SceneRegistry {
	constructor() {
		this.objects = {};
	}

	has(name) {
		return Boolean(this.objects[name]);
	}

	get(name) {
		return this.objects[name];
	}

	register(name, object) {
		this.objects[name] = object;
		return object;
	}

	addAllTo(scene) {
		Object.keys(this.objects).forEach((name) => {
			scene.add(this.objects[name]);
		});
	}

	setVisibility(names, visible) {
		names.forEach((name) => {
			if (this.objects[name]) {
				this.objects[name].visible = visible;
			}
		});
	}
}
