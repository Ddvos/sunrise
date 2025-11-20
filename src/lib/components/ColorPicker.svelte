<script lang="ts">
	import type { RGBColor } from '$lib/types/alarm';

	interface Props {
		color: RGBColor;
		onchange: (color: RGBColor) => void;
	}

	let { color = $bindable({ r: 255, g: 150, b: 50 }), onchange }: Props = $props();

	let hue = $state(0);
	let saturation = $state(100);
	let lightness = $state(50);

	// Convert RGB to HSL for better color picking
	function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
		r /= 255;
		g /= 255;
		b /= 255;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h = 0,
			s = 0;
		const l = (max + min) / 2;

		if (max !== min) {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
					break;
				case g:
					h = ((b - r) / d + 2) / 6;
					break;
				case b:
					h = ((r - g) / d + 4) / 6;
					break;
			}
		}

		return [h * 360, s * 100, l * 100];
	}

	// Convert HSL to RGB
	function hslToRgb(h: number, s: number, l: number): RGBColor {
		h /= 360;
		s /= 100;
		l /= 100;

		let r, g, b;

		if (s === 0) {
			r = g = b = l;
		} else {
			const hue2rgb = (p: number, q: number, t: number) => {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			};

			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}

		return {
			r: Math.round(r * 255),
			g: Math.round(g * 255),
			b: Math.round(b * 255)
		};
	}

	// Initialize HSL from RGB
	$effect(() => {
		const [h, s, l] = rgbToHsl(color.r, color.g, color.b);
		hue = h;
		saturation = s;
		lightness = l;
	});

	function updateColor() {
		const newColor = hslToRgb(hue, saturation, lightness);
		color = newColor;
		onchange(newColor);
	}

	const colorStyle = $derived(`rgb(${color.r}, ${color.g}, ${color.b})`);
</script>

<div class="space-y-4">
	<!-- Color preview -->
	<div class="flex items-center gap-4">
		<div
			class="h-16 w-16 shrink-0 rounded-2xl border-4 border-white shadow-lg ring-2 ring-gray-200 transition-all duration-300"
			style="background-color: {colorStyle}"
		></div>
		<div class="text-sm text-gray-600">
			<div class="font-medium text-gray-900">RGB({color.r}, {color.g}, {color.b})</div>
			<div class="mt-1">{colorStyle}</div>
		</div>
	</div>

	<!-- Hue slider -->
	<div>
		<label class="mb-2 block text-sm font-medium text-gray-700">Hue</label>
		<input
			type="range"
			min="0"
			max="360"
			bind:value={hue}
			oninput={updateColor}
			class="h-3 w-full cursor-pointer appearance-none rounded-full outline-none"
			style="background: linear-gradient(to right,
				hsl(0, 100%, 50%),
				hsl(60, 100%, 50%),
				hsl(120, 100%, 50%),
				hsl(180, 100%, 50%),
				hsl(240, 100%, 50%),
				hsl(300, 100%, 50%),
				hsl(360, 100%, 50%))"
		/>
	</div>

	<!-- Saturation slider -->
	<div>
		<label class="mb-2 block text-sm font-medium text-gray-700">Saturation</label>
		<input
			type="range"
			min="0"
			max="100"
			bind:value={saturation}
			oninput={updateColor}
			class="h-3 w-full cursor-pointer appearance-none rounded-full outline-none"
			style="background: linear-gradient(to right,
				hsl({hue}, 0%, {lightness}%),
				hsl({hue}, 100%, {lightness}%))"
		/>
	</div>

	<!-- Lightness slider -->
	<div>
		<label class="mb-2 block text-sm font-medium text-gray-700">Brightness</label>
		<input
			type="range"
			min="0"
			max="100"
			bind:value={lightness}
			oninput={updateColor}
			class="h-3 w-full cursor-pointer appearance-none rounded-full outline-none"
			style="background: linear-gradient(to right,
				hsl({hue}, {saturation}%, 0%),
				hsl({hue}, {saturation}%, 50%),
				hsl({hue}, {saturation}%, 100%))"
		/>
	</div>
</div>

<style>
	input[type='range']::-webkit-slider-thumb {
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: white;
		border: 2px solid #d1d5db;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	input[type='range']::-webkit-slider-thumb:hover {
		transform: scale(1.15);
		border-color: #9ca3af;
	}

	input[type='range']::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: white;
		border: 2px solid #d1d5db;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	input[type='range']::-moz-range-thumb:hover {
		transform: scale(1.15);
		border-color: #9ca3af;
	}
</style>
