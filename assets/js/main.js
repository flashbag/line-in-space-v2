import { INITIAL_POINTS } from './config.js';
import { computeDerivedPoints } from './geometry.js';
import { createScene, startRenderLoop } from './scene.js';
import { addAllToScene } from './registry.js';
import { buildAxes } from './axes.js';
import { buildDots, rotateTexts } from './dots.js';
import { buildLines } from './lines.js';
import { initUi } from './ui.js';

$(function () {
	if (!Detector.webgl) {
		Detector.addGetWebGLMessage();
	}

	// `points` holds the two defining points A and B plus every derived point,
	// all addressed by name (the same names index.html uses for visibility).
	const points = {
		A: Object.assign({}, INITIAL_POINTS.A),
		B: Object.assign({}, INITIAL_POINTS.B),
	};

	function recalculate() {
		Object.assign(points, computeDerivedPoints(points.A, points.B));
	}

	recalculate();

	const world = createScene();

	buildDots(points, world.camera);
	buildAxes();
	buildLines(points);

	addAllToScene(world.scene);
	startRenderLoop(world.scene, world.camera);

	world.controls.addEventListener('change', function () {
		rotateTexts(world.camera);
	});

	initUi({
		points: points,
		controls: world.controls,
		onPointChange: function () {
			recalculate();
			buildDots(points, world.camera);
			buildLines(points);
		},
	});
});
