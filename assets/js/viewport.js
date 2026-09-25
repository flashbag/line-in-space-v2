import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/** Scene, camera, orbit controls, renderer and render loop. */
export class Viewport {
	constructor() {
		this.scene = new THREE.Scene();
		this.scene.fog = new THREE.FogExp2(0xcccccc, 0.001);

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 1000);
		this.camera.position.set(175, 105, 175);

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setClearColor(0xffffff);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);

		window.addEventListener('resize', () => this._onResize());
	}

	onOrbit(callback) {
		this.controls.addEventListener('change', callback);
	}

	start() {
		document.body.appendChild(this.renderer.domElement);
		this.renderer.setAnimationLoop(() => {
			this.renderer.render(this.scene, this.camera);
		});
	}

	_onResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
}
