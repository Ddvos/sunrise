<script lang="ts">
	let deviceName = $state('Sunrise Lamp');
	let timeFormat = $state<'12h' | '24h'>('24h');
	let autoSync = $state(true);
	let nightMode = $state(false);
	let fadeSpeed = $state(5); // seconds

	const settings = [
		{
			title: 'Device',
			items: [
				{
					id: 'device-name',
					label: 'Device Name',
					type: 'text' as const,
					value: deviceName,
					onchange: (value: string) => (deviceName = value)
				},
				{
					id: 'time-format',
					label: 'Time Format',
					type: 'select' as const,
					value: timeFormat,
					options: [
						{ value: '12h', label: '12 Hour' },
						{ value: '24h', label: '24 Hour' }
					],
					onchange: (value: '12h' | '24h') => (timeFormat = value)
				}
			]
		},
		{
			title: 'Automation',
			items: [
				{
					id: 'auto-sync',
					label: 'Auto Time Sync',
					description: 'Automatically sync time with your device',
					type: 'toggle' as const,
					value: autoSync,
					onchange: (value: boolean) => (autoSync = value)
				},
				{
					id: 'night-mode',
					label: 'Night Mode',
					description: 'Reduce brightness automatically at night',
					type: 'toggle' as const,
					value: nightMode,
					onchange: (value: boolean) => (nightMode = value)
				}
			]
		},
		{
			title: 'Light Behavior',
			items: [
				{
					id: 'fade-speed',
					label: 'Fade Speed',
					description: 'Transition time when turning on/off',
					type: 'range' as const,
					value: fadeSpeed,
					min: 1,
					max: 10,
					unit: 's',
					onchange: (value: number) => (fadeSpeed = value)
				}
			]
		}
	];
</script>

<div class="mx-auto max-w-5xl space-y-8 px-4 py-8 pb-24 md:px-6 md:pb-8">
	<!-- Header -->
	<div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 p-8">
		<div
			class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/20 blur-[100px]"
		></div>

		<div class="relative">
			<h1 class="text-3xl font-light text-white md:text-4xl">Settings</h1>
			<p class="mt-2 text-slate-400">Configure your sunrise lamp preferences</p>
		</div>
	</div>

	<!-- Settings sections -->
	{#each settings as section}
		<div
			class="overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm"
		>
			<div class="border-b border-white/5 p-6">
				<h2 class="text-xl font-light text-white">{section.title}</h2>
			</div>

			<div class="divide-y divide-white/5">
				{#each section.items as item}
					<div class="p-6">
						<div class="flex items-start justify-between gap-4">
							<div class="flex-1">
								<label for={item.id} class="block text-base font-light text-slate-300">
									{item.label}
								</label>
								{#if item.description}
									<p class="mt-1 text-sm text-slate-500">{item.description}</p>
								{/if}

								{#if item.type === 'range'}
									<div class="mt-4 flex items-center gap-4">
										<input
											id={item.id}
											type="range"
											min={item.min}
											max={item.max}
											value={item.value}
											oninput={(e) => item.onchange(parseInt(e.currentTarget.value))}
											class="setting-slider h-2 flex-1 cursor-pointer appearance-none rounded-full bg-slate-700 outline-none"
										/>
										<span class="w-12 text-right text-slate-300"
											>{item.value}{item.unit}</span
										>
									</div>
								{/if}
							</div>

							<div class="flex-shrink-0">
								{#if item.type === 'toggle'}
									<label class="relative inline-flex cursor-pointer items-center">
										<input
											id={item.id}
											type="checkbox"
											checked={item.value}
											onchange={(e) => item.onchange(e.currentTarget.checked)}
											class="peer sr-only"
										/>
										<div
											class="peer h-7 w-14 rounded-full bg-slate-700 after:absolute after:left-[4px] after:top-[4px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-gradient-to-r peer-checked:from-amber-500 peer-checked:to-orange-500 peer-checked:after:translate-x-7 peer-focus:ring-2 peer-focus:ring-amber-500/50"
										></div>
									</label>
								{:else if item.type === 'text'}
									<input
										id={item.id}
										type="text"
										value={item.value}
										oninput={(e) => item.onchange(e.currentTarget.value)}
										class="rounded-xl border border-white/10 bg-slate-800/50 px-4 py-2 text-slate-300 outline-none transition-all focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
									/>
								{:else if item.type === 'select'}
									<select
										id={item.id}
										value={item.value}
										onchange={(e) => item.onchange(e.currentTarget.value)}
										class="rounded-xl border border-white/10 bg-slate-800/50 px-4 py-2 text-slate-300 outline-none transition-all focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
									>
										{#each item.options as option}
											<option value={option.value}>{option.label}</option>
										{/each}
									</select>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/each}

	<!-- Device info -->
	<div
		class="overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-8 backdrop-blur-sm"
	>
		<h2 class="mb-6 text-xl font-light text-white">Device Information</h2>
		<div class="space-y-4 text-sm">
			<div class="flex justify-between border-b border-white/5 pb-3">
				<span class="text-slate-500">Firmware Version</span>
				<span class="font-medium text-slate-300">v1.2.0</span>
			</div>
			<div class="flex justify-between border-b border-white/5 pb-3">
				<span class="text-slate-500">Model</span>
				<span class="font-medium text-slate-300">Sunrise Pro</span>
			</div>
			<div class="flex justify-between border-b border-white/5 pb-3">
				<span class="text-slate-500">Connection</span>
				<span class="flex items-center gap-2 font-medium text-green-400">
					<span class="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
					Connected
				</span>
			</div>
			<div class="flex justify-between">
				<span class="text-slate-500">Last Sync</span>
				<span class="font-medium text-slate-300">Just now</span>
			</div>
		</div>
	</div>

	<!-- Actions -->
	<div class="space-y-4">
		<button
			type="button"
			class="group w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 text-left backdrop-blur-sm transition-all duration-300 hover:border-amber-500/30 active:scale-[0.99]"
		>
			<div
				class="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 opacity-0 transition-opacity duration-300 group-hover:from-amber-500/5 group-hover:to-orange-500/5 group-hover:opacity-100"
			></div>
			<div class="relative flex items-center justify-between">
				<div>
					<div class="font-light text-slate-300">Check for Updates</div>
					<div class="mt-1 text-sm text-slate-500">Your device is up to date</div>
				</div>
				<svg
					class="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5l7 7-7 7"
					></path>
				</svg>
			</div>
		</button>

		<button
			type="button"
			class="group w-full overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 text-left backdrop-blur-sm transition-all duration-300 hover:border-red-500/40 active:scale-[0.99]"
		>
			<div
				class="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 opacity-0 transition-opacity duration-300 group-hover:from-red-500/5 group-hover:to-red-500/5 group-hover:opacity-100"
			></div>
			<div class="relative flex items-center justify-between">
				<div>
					<div class="font-light text-red-400">Reset to Factory Defaults</div>
					<div class="mt-1 text-sm text-slate-500">Clear all settings and alarms</div>
				</div>
				<svg
					class="h-5 w-5 text-red-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					></path>
				</svg>
			</div>
		</button>
	</div>
</div>

<style>
	.setting-slider::-webkit-slider-thumb {
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
		border: 2px solid rgba(15, 23, 42, 1);
		box-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.setting-slider::-webkit-slider-thumb:hover {
		transform: scale(1.15);
		box-shadow: 0 0 15px rgba(251, 191, 36, 0.7);
	}

	.setting-slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
		border: 2px solid rgba(15, 23, 42, 1);
		box-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.setting-slider::-moz-range-thumb:hover {
		transform: scale(1.15);
		box-shadow: 0 0 15px rgba(251, 191, 36, 0.7);
	}
</style>
