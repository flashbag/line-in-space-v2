import { LineModel } from './model.js';
import { SceneRegistry } from './registry.js';
import { Viewport } from './viewport.js';
import { AxesLayer } from './axes.js';
import { DotLayer } from './dots.js';
import { LineLayer } from './lines.js';
import { ControlPanel } from './ui.js';

class App {
	constructor() {
		this.model = new LineModel();
		this.registry = new SceneRegistry();
		this.viewport = new Viewport();

		this.axes = new AxesLayer(this.registry);
		this.dots = new DotLayer(this.registry, this.viewport.camera);
		this.lines = new LineLayer(this.registry);

		this.panel = new ControlPanel({
			model: this.model,
			registry: this.registry,
			orbitControls: this.viewport.controls,
			onPointChange: () => this._redraw(),
		});
	}

	run() {
		if (!Detector.webgl) {
			Detector.addGetWebGLMessage();
		}

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

document.addEventListener('DOMContentLoaded', () => {
	new App().run();
});
