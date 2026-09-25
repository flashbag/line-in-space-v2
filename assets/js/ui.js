/**
 * The control panel: native range sliders for A/B coordinates, visibility
 * checkboxes, and the show/hide behavior of the panel's sub-sections.
 * Plain DOM — no jQuery.
 */
export class ControlPanel {
	constructor(options) {
		this.model = options.model;
		this.registry = options.registry;
		this.orbitControls = options.orbitControls;
		this.onPointChange = options.onPointChange;
	}

	init() {
		this._initPanelBehavior();
		this._initVisibilityToggles();
		this._initCoordinateSliders();
	}

	_trackEvent(category, action, label, value) {
		if (typeof window.ga === 'function') {
			window.ga('send', 'event', category, action, label, value);
		}
	}

	_closeSections() {
		document.querySelectorAll('#controls .label').forEach((label) => {
			label.classList.remove('active');
		});
		document.querySelectorAll('#controls .controls').forEach((section) => {
			section.style.display = 'none';
		});
	}

	_initPanelBehavior() {
		const panel = document.getElementById('controls');

		panel.addEventListener('mouseenter', () => {
			this.orbitControls.enabled = false;
		});
		panel.addEventListener('mouseleave', () => {
			this.orbitControls.enabled = true;
			this._closeSections();
		});

		panel.querySelectorAll('.controls-inner .label').forEach((label) => {
			label.addEventListener('click', () => {
				this._closeSections();

				label.classList.add('active');
				const section = panel.querySelector('.' + label.dataset.class);
				if (section) {
					section.style.display = 'block';
				}

				this._trackEvent('User', 'Click', 'Label', label.dataset.class);
			});
		});
	}

	_initVisibilityToggles() {
		document.querySelectorAll('ul#visibility li input').forEach((checkbox) => {
			checkbox.addEventListener('change', () => {
				const objectNames = checkbox.closest('li').dataset.object;
				if (objectNames) {
					this.registry.setVisibility(objectNames.split(','), checkbox.checked);
				}
			});
		});
	}

	_initCoordinateSliders() {
		['A', 'B'].forEach((dotName) => {
			['x', 'y', 'z'].forEach((coordName) => {
				const id = dotName + coordName;
				const slider = document.getElementById(id);
				const valueLabel = document.getElementById(id + '-value');

				if (!slider) {
					return;
				}

				slider.value = this.model.coordinate(dotName, coordName);
				valueLabel.textContent = Math.round(this.model.coordinate(dotName, coordName));

				slider.addEventListener('input', () => {
					const value = Number(slider.value);

					this.model.setCoordinate(dotName, coordName, value);
					valueLabel.textContent = Math.round(value);

					this.onPointChange();
				});
			});
		});
	}
}
