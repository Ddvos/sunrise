<script lang="ts">
	import type { RGBColor } from '$lib/types/alarm';
	import { onMount } from 'svelte';
	import ColorPicker from './ColorPicker.svelte';
	import mqtt from 'mqtt';

	let brightness = $state(80);
	let color = $state<RGBColor>({ r: 255, g: 150, b: 50 });

	let client: any = null;
	let connected = $state(false);
	let isOn = $state(false);
	let status = $state('Connecting…');

	const MQTT_URL = 'wss://morninglow.nl/mqtt';
	const MQTT_USERNAME = 'webuser';
	const MQTT_PASSWORD = 'webpassword';
	const LED_TOPIC = 'esp32/led';

	const colorStyle = $derived(`rgb(${color.r}, ${color.g}, ${color.b})`);
	const glowStyle = $derived(
		`rgba(${color.r}, ${color.g}, ${color.b}, ${isOn ? brightness / 200 : 0})`
	);

	function togglePower() {
		isOn = !isOn;
		const payload = isOn ? 'on' : 'off';

		client.publish(LED_TOPIC, payload);
	}

	// Quick presets
	const presets = [
		{ name: 'Warm Sunrise', color: { r: 255, g: 150, b: 50 } },
		{ name: 'Soft White', color: { r: 255, g: 245, b: 235 } },
		{ name: 'Cool Daylight', color: { r: 200, g: 220, b: 255 } },
		{ name: 'Sunset', color: { r: 255, g: 100, b: 50 } }
	];

	function applyPreset(presetColor: RGBColor) {
		color = { ...presetColor };
		if (!isOn) isOn = true;

		client.subscribe(`esp32/led/${isOn}`);
	}

	onMount(async () => {
		// Only run in the browser (important for SvelteKit)
		if (typeof window === 'undefined') return;

		client = mqtt.connect(MQTT_URL, {
			username: MQTT_USERNAME,
			password: MQTT_PASSWORD,
			reconnectPeriod: 2000
		});
		console.log(client);

		client.on('connect', () => {
			connected = true;
			status = 'Connected to MQTT';
			// Optional: subscribe to some topic if you want feedback
			// client.subscribe('esp32/led/state');

			console.log('verbonden');
		});

		client.on('reconnect', () => {
			console.log(client);
			status = 'Reconnecting…';
			connected = false;
		});

		client.on('close', () => {
			status = 'Disconnected';
			connected = false;
		});

		client.on('error', (err: any) => {
			console.error('MQTT error', err);
			status = 'Error connecting (see console)';
		});

		// Optional: handle messages back from ESP32
		// client.on('message', (topic: string, payload: Uint8Array) => {
		//   if (topic === 'esp32/led/state') {
		//     ledOn = new TextDecoder().decode(payload) === 'on';
		//   }
		// });
	});

	$inspect(client);
</script>

<div class="mx-auto max-w-5xl space-y-8 px-4 py-8 pb-24 md:px-6 md:pb-8">
	<!-- Power control -->
	<div
		class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 p-8"
	>
		<!-- Ambient glow effect when light is on -->
		<div
			class="pointer-events-none absolute inset-0 transition-opacity duration-700"
			style="background: radial-gradient(circle at center, {glowStyle} 0%, transparent 70%)"
		></div>

		<div class="relative">
			<div class="flex flex-col items-center gap-8 md:flex-row md:justify-between">
				<div class="text-center md:text-left">
					<h2 class="text-3xl font-light text-white">Manual Control</h2>
					<p class="mt-2 text-slate-400">Direct control of your sunrise lamp</p>
				</div>

				<!-- Power button -->
				<button
					type="button"
					onclick={togglePower}
					class="group relative h-32 w-32 transition-transform duration-300 active:scale-95"
				>
					<!-- Outer glow ring -->
					<div
						class="absolute inset-0 rounded-full transition-all duration-500 {isOn
							? 'bg-gradient-to-br from-amber-500/30 to-orange-500/30 blur-xl'
							: 'bg-slate-700/20 blur-lg'}"
					></div>

					<!-- Button body -->
					<div
						class="relative flex h-full w-full items-center justify-center rounded-full border-2 transition-all duration-500 {isOn
							? 'border-amber-500/50 bg-gradient-to-br from-amber-500/20 to-orange-500/20 shadow-[0_0_40px_rgba(251,191,36,0.3)]'
							: 'border-white/10 bg-slate-800/50 group-hover:border-white/20'}"
					>
						<svg
							class="h-12 w-12 transition-all duration-500 {isOn
								? 'text-amber-400'
								: 'text-slate-500 group-hover:text-slate-400'}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							></path>
						</svg>
					</div>

					<!-- Inner ring animation -->
					{#if isOn}
						<div
							class="absolute inset-2 animate-ping rounded-full bg-amber-500/20 opacity-75"
							style="animation-duration: 2s;"
						></div>
					{/if}
				</button>
			</div>

			<!-- Status text -->
			<div class="mt-6 text-center">
				<span
					class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-500 {isOn
						? 'bg-amber-500/20 text-amber-400'
						: 'bg-slate-700/30 text-slate-500'}"
				>
					<span class="h-2 w-2 rounded-full {isOn ? 'animate-pulse bg-amber-400' : 'bg-slate-500'}"
					></span>
					{isOn ? 'Light On' : 'Light Off'}
				</span>

				<!-- MQTT Status -->
				<div class="mt-4">
					<span
						class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium {connected
							? 'bg-green-500/20 text-green-400'
							: 'bg-red-500/20 text-red-400'}"
					>
						<span
							class="h-2 w-2 rounded-full {connected ? 'animate-pulse bg-green-400' : 'bg-red-400'}"
						></span>
						{status}
					</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Brightness control -->
	<div
		class="overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 backdrop-blur-sm"
	>
		<h3 class="mb-6 text-xl font-light text-white">Brightness</h3>
		<div class="space-y-4">
			<!-- Large brightness slider -->
			<div class="relative">
				<input
					type="range"
					min="0"
					max="100"
					bind:value={brightness}
					disabled={!isOn}
					class="brightness-slider h-4 w-full cursor-pointer appearance-none rounded-full transition-opacity outline-none {isOn
						? 'opacity-100'
						: 'opacity-50'}"
					style="background: linear-gradient(to right,
						rgba(51, 65, 85, 1) 0%,
						rgba(251, 191, 36, 0.3) 50%,
						rgba(251, 191, 36, 1) 100%)"
				/>
			</div>

			<!-- Brightness percentage -->
			<div class="flex items-center justify-between">
				<span class="text-2xl font-light text-slate-300">{brightness}%</span>
				<div class="flex gap-2">
					<button
						type="button"
						onclick={() => (brightness = 25)}
						disabled={!isOn}
						class="rounded-xl border border-white/10 bg-slate-800/50 px-4 py-2 text-sm text-slate-400 transition-all hover:border-white/20 hover:text-slate-300 disabled:opacity-50"
					>
						25%
					</button>
					<button
						type="button"
						onclick={() => (brightness = 50)}
						disabled={!isOn}
						class="rounded-xl border border-white/10 bg-slate-800/50 px-4 py-2 text-sm text-slate-400 transition-all hover:border-white/20 hover:text-slate-300 disabled:opacity-50"
					>
						50%
					</button>
					<button
						type="button"
						onclick={() => (brightness = 100)}
						disabled={!isOn}
						class="rounded-xl border border-white/10 bg-slate-800/50 px-4 py-2 text-sm text-slate-400 transition-all hover:border-white/20 hover:text-slate-300 disabled:opacity-50"
					>
						100%
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Color presets -->
	<div
		class="overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 backdrop-blur-sm"
	>
		<h3 class="mb-6 text-xl font-light text-white">Quick Presets</h3>
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
			{#each presets as preset}
				<button
					type="button"
					onclick={() => applyPreset(preset.color)}
					class="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-800/50 p-6 transition-all duration-300 hover:border-white/20 hover:shadow-lg active:scale-95"
				>
					<div
						class="mx-auto mb-4 h-16 w-16 rounded-full shadow-lg transition-all duration-300 group-hover:scale-110"
						style="background-color: rgb({preset.color.r}, {preset.color.g}, {preset.color.b})"
					></div>
					<p class="text-center text-sm font-light text-slate-300">{preset.name}</p>
				</button>
			{/each}
		</div>
	</div>

	<!-- Custom color picker -->
	<div
		class="overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 backdrop-blur-sm"
	>
		<h3 class="mb-6 text-xl font-light text-white">Custom Color</h3>
		<ColorPicker {color} onchange={(newColor) => (color = newColor)} />
	</div>
</div>

<style>
	.brightness-slider::-webkit-slider-thumb {
		appearance: none;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
		border: 3px solid rgba(15, 23, 42, 1);
		box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.brightness-slider::-webkit-slider-thumb:hover {
		transform: scale(1.2);
		box-shadow: 0 0 30px rgba(251, 191, 36, 0.7);
	}

	.brightness-slider::-moz-range-thumb {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
		border: 3px solid rgba(15, 23, 42, 1);
		box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.brightness-slider::-moz-range-thumb:hover {
		transform: scale(1.2);
		box-shadow: 0 0 30px rgba(251, 191, 36, 0.7);
	}
</style>
