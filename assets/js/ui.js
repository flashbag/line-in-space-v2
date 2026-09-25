import { SLIDER_RANGE } from './config.js';
import { setVisibility } from './registry.js';

function trackEvent(category, action, label, value) {
	if (typeof window.ga === 'function') {
		window.ga('send', 'event', category, action, label, value);
	}
}

function initPanelBehavior(controls) {
	$('#controls')
		.mouseenter(function () {
			controls.enabled = false;
			controls.rotate = false;
		})
		.mouseleave(function () {
			controls.enabled = true;
			controls.rotate = true;

			$('.label').removeClass('active');
			$('.controls').hide();
		});

	$('#controls .controls-inner .label').click(function () {
		$('.label').removeClass('active');
		$('.controls').hide();

		$(this).addClass('active');
		$('.' + $(this).data('class')).show();

		trackEvent('User', 'Click', 'Label', $(this).data('class'));
	});
}

function initVisibilityToggles() {
	$('ul#visibility li input').click(function () {
		const $self = $(this);
		const objectNames = $self.parent().data('object');

		if (objectNames) {
			setVisibility(objectNames.split(','), $self.is(':checked'));
		}
	});
}

function initCoordinateSliders(points, onPointChange) {
	['A', 'B'].forEach(function (dotName) {
		['x', 'y', 'z'].forEach(function (coordName) {
			const id = dotName + coordName;
			const $slider = $('#' + id);
			const $value = $('#' + id + '-value');

			$value.text(Math.round(points[dotName][coordName]));

			$slider
				.noUiSlider({
					start: [points[dotName][coordName]],
					step: 1,
					range: {
						min: [SLIDER_RANGE.min],
						max: [SLIDER_RANGE.max],
					},
				})
				.on('slide', function () {
					const value = Number($(this).val());

					points[dotName][coordName] = value;
					$value.text(Math.round(value));

					onPointChange();
				});
		});
	});
}

export function initUi(options) {
	initPanelBehavior(options.controls);
	initVisibilityToggles();
	initCoordinateSliders(options.points, options.onPointChange);
}
