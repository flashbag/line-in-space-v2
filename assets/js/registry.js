/**
 * Registry of every named Object3D in the scene. The visibility checkboxes
 * in index.html reference these names through their data-object attributes.
 */
export const objects = {};

export function addAllToScene(scene) {
	Object.keys(objects).forEach(function (name) {
		scene.add(objects[name]);
	});
}

export function setVisibility(names, visible) {
	names.forEach(function (name) {
		if (objects[name]) {
			objects[name].visible = visible;
		}
	});
}
