/**
 * Scene, camera, orbit controls and render loop.
 * Uses the vendored globals THREE and THREEx loaded from assets/three/.
 */
export function createScene() {
	const scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0xcccccc, 0.001);

	const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 1000);
	camera.position.set(175, 105, 175);

	const controls = new THREE.OrbitControls(camera);

	return { scene: scene, camera: camera, controls: controls };
}

export function startRenderLoop(scene, camera) {
	const renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xffffff);
	renderer.setSize(window.innerWidth, window.innerHeight);

	THREEx.WindowResize(renderer, camera);

	document.body.appendChild(renderer.domElement);

	(function animate() {
		requestAnimationFrame(animate);
		renderer.render(scene, camera);
	})();

	return renderer;
}
