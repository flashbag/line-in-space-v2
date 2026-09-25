/**
 * Scene, camera, orbit controls and render loop.
 * Uses the vendored globals THREE and THREEx loaded from assets/three/.
 */
export class Viewport {
	constructor() {
		this.scene = new THREE.Scene();
		this.scene.fog = new THREE.FogExp2(0xcccccc, 0.001);

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 1000);
		this.camera.position.set(175, 105, 175);

		this.controls = new THREE.OrbitControls(this.camera);
		this.renderer = null;
	}

	onOrbit(callback) {
		this.controls.addEventListener('change', callback);
	}

	start() {
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setClearColor(0xffffff);
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		THREEx.WindowResize(this.renderer, this.camera);

		document.body.appendChild(this.renderer.domElement);

		const animate = () => {
			requestAnimationFrame(animate);
			this.renderer.render(this.scene, this.camera);
		};
		animate();
	}
}
