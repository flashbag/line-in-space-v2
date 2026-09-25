import { FontLoader } from 'three/addons/loaders/FontLoader.js';

import { LineModel } from './model.js';
import { SceneRegistry } from './registry.js';
import { Viewport } from './viewport.js';
import { AxesLayer } from './axes.js';
import { DotLayer } from './dots.js';
import { LineLayer } from './lines.js';
import { ControlPanel } from './ui.js';

const FONT_URL = 'assets/three/fonts/helvetiker_regular.typeface.json';

class App {
	constructor(font) {
		this.model = new LineModel();
		this.registry = new SceneRegistry();
		this.viewport = new Viewport();

		this.axes = new AxesLayer(this.registry);
		this.dots = new DotLayer(this.registry, this.viewport.camera, font);
		this.lines = new LineLayer(this.registry);

		this.panel = new ControlPanel({
			model: this.model,
			registry: this.registry,
			orbitControls: this.viewport.controls,
			onPointChange: () => this._redraw(),
		});
	}

	run() {
		this.dots.build(this.model);
		this.axes.build();
		this.lines.build(this.model);

		this.registry.addAllTo(this.viewport.scene);
		this.viewport.start();

		this.viewport.onOrbit(() => this.dots.rotateLabels());

		this.panel.init();
	}

	_redraw() {
		this.dots.build(this.model);
		this.lines.build(this.model);
	}
}

function showFailure(error) {
	const message = document.createElement('div');
	message.style.cssText = 'position:absolute;top:45%;width:100%;text-align:center;color:#b00;font-size:14px;';
	message.textContent = 'Could not start WebGL rendering: ' + error.message;
	document.body.appendChild(message);
}

async function bootstrap() {
	try {
		const font = await new FontLoader().loadAsync(FONT_URL);
		new App(font).run();
	} catch (error) {
		showFailure(error);
		throw error;
	}
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', bootstrap);
} else {
	bootstrap();
}
