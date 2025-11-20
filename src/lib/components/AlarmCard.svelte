<script lang="ts">
	import type { AlarmSettings } from '$lib/types/alarm';
	import ColorPicker from './ColorPicker.svelte';
	import TimePicker from './TimePicker.svelte';
	import DaySelector from './DaySelector.svelte';

	interface Props {
		alarm: AlarmSettings;
		onupdate: (alarm: AlarmSettings) => void;
		ondelete: () => void;
	}

	let { alarm = $bindable(), onupdate, ondelete }: Props = $props();

	let isExpanded = $state(false);

	function toggleExpanded() {
		isExpanded = !isExpanded;
	}

	function updateAlarm(updates: Partial<AlarmSettings>) {
		alarm = { ...alarm, ...updates };
		onupdate(alarm);
	}

	const previewColor = $derived(`rgb(${alarm.color.r}, ${alarm.color.g}, ${alarm.color.b})`);
	const glowColor = $derived(
		`rgba(${alarm.color.r}, ${alarm.color.g}, ${alarm.color.b}, ${alarm.enabled ? 0.2 : 0})`
	);
</script>

<div
	class="group relative overflow-hidden rounded-3xl border transition-all duration-500 {alarm.enabled
		? 'border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 shadow-lg'
		: 'border-white/5 bg-gradient-to-br from-slate-800/30 to-slate-900/30'} backdrop-blur-sm"
>
	<!-- Glow effect when enabled -->
	{#if alarm.enabled}
		<div
			class="pointer-events-none absolute -inset-20 opacity-50 blur-3xl transition-opacity duration-700"
			style="background: radial-gradient(circle at 50% 0%, {glowColor}, transparent 60%)"
		></div>
	{/if}

	<!-- Card Header -->
	<button
		type="button"
		onclick={toggleExpanded}
		class="relative flex w-full items-center justify-between p-6 text-left transition-all duration-300 hover:bg-white/5"
	>
		<div class="flex items-center gap-4">
			<!-- Color indicator with glow -->
			<div class="relative">
				<div
					class="h-14 w-14 shrink-0 rounded-2xl shadow-lg transition-all duration-500 {alarm.enabled
						? 'shadow-[0_0_20px_rgba(0,0,0,0.3)]'
						: 'opacity-40'}"
					style="background-color: {previewColor}"
				></div>
				{#if alarm.enabled}
					<div
						class="absolute inset-0 rounded-2xl opacity-40 blur-xl"
						style="background-color: {previewColor}"
					></div>
				{/if}
			</div>

			<div>
				<div class="text-4xl font-light tracking-tight text-white">
					{alarm.time}
				</div>
				{#if alarm.name}
					<div class="mt-1 text-sm font-light text-slate-400">{alarm.name}</div>
				{/if}
				<div class="mt-1 text-xs text-slate-500">
					{#if alarm.days.length === 7}
						Every day
					{:else if alarm.days.length === 0}
						No days selected
					{:else}
						{alarm.days.map((d) => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}
					{/if}
				</div>
			</div>
		</div>

		<div class="flex items-center gap-4">
			<!-- Enable/Disable toggle -->
			<label class="relative inline-flex cursor-pointer items-center">
				<input
					type="checkbox"
					checked={alarm.enabled}
					onchange={(e) => updateAlarm({ enabled: e.currentTarget.checked })}
					onclick={(e) => e.stopPropagation()}
					class="peer sr-only"
				/>
				<div
					class="peer h-8 w-14 rounded-full bg-slate-700 peer-checked:bg-gradient-to-r peer-checked:from-amber-500 peer-checked:to-orange-500 peer-focus:ring-2 peer-focus:ring-amber-500/50 after:absolute after:top-[4px] after:left-[4px] after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow-md after:transition-all after:content-[''] peer-checked:after:translate-x-6"
				></div>
			</label>

			<!-- Expand icon -->
			<svg
				class="h-6 w-6 text-slate-400 transition-all duration-300 {isExpanded
					? 'rotate-180 text-amber-400'
					: 'group-hover:text-slate-300'}"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
				></path>
			</svg>
		</div>
	</button>

	<!-- Expanded content -->
	{#if isExpanded}
		<div class="relative border-t border-white/5 bg-slate-900/30 p-6">
			<div class="space-y-8">
				<!-- Name input -->
				<div>
					<label for="alarm-name-{alarm.id}" class="mb-3 block text-sm font-light text-slate-400"
						>Alarm Name</label
					>
					<input
						id="alarm-name-{alarm.id}"
						type="text"
						value={alarm.name || ''}
						oninput={(e) => updateAlarm({ name: e.currentTarget.value })}
						placeholder="e.g., Morning Routine"
						class="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3 text-slate-300 placeholder-slate-600 transition-all outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
					/>
				</div>

				<!-- Time picker -->
				<div>
					<h3 class="mb-4 text-sm font-light text-slate-400">Wake Time</h3>
					<TimePicker time={alarm.time} onchange={(time) => updateAlarm({ time })} />
				</div>

				<!-- Day selector -->
				<div>
					<h3 class="mb-4 text-sm font-light text-slate-400">Repeat On</h3>
					<DaySelector selectedDays={alarm.days} onchange={(days) => updateAlarm({ days })} />
				</div>

				<!-- Sunrise duration -->
				<div>
					<label for="duration-{alarm.id}" class="mb-3 block text-sm font-light text-slate-400">
						Sunrise Duration: <span class="text-slate-300">{alarm.duration} minutes</span>
					</label>
					<input
						id="duration-{alarm.id}"
						type="range"
						min="5"
						max="60"
						step="5"
						value={alarm.duration}
						oninput={(e) => updateAlarm({ duration: parseInt(e.currentTarget.value) })}
						class="alarm-slider h-3 w-full cursor-pointer appearance-none rounded-full outline-none"
						style="background: linear-gradient(to right,
							rgba(51, 65, 85, 1) 0%,
							rgba(251, 146, 60, 0.3) 40%,
							rgba(251, 191, 36, 0.6) 70%,
							rgba(254, 243, 199, 1) 100%)"
					/>
					<div class="mt-2 flex justify-between text-xs text-slate-600">
						<span>5 min</span>
						<span>60 min</span>
					</div>
				</div>

				<!-- Brightness -->
				<div>
					<label for="brightness-{alarm.id}" class="mb-3 block text-sm font-light text-slate-400">
						Maximum Brightness: <span class="text-slate-300">{alarm.brightness}%</span>
					</label>
					<input
						id="brightness-{alarm.id}"
						type="range"
						min="10"
						max="100"
						step="5"
						value={alarm.brightness}
						oninput={(e) => updateAlarm({ brightness: parseInt(e.currentTarget.value) })}
						class="alarm-slider h-3 w-full cursor-pointer appearance-none rounded-full outline-none"
						style="background: linear-gradient(to right,
							rgba(71, 85, 105, 1) 0%,
							rgba(251, 191, 36, 1) 100%)"
					/>
					<div class="mt-2 flex justify-between text-xs text-slate-600">
						<span>10%</span>
						<span>100%</span>
					</div>
				</div>

				<!-- Delete button -->
				<button
					type="button"
					onclick={ondelete}
					class="group/delete relative w-full overflow-hidden rounded-2xl border border-red-500/20 bg-slate-800/30 px-4 py-4 font-light text-red-400 transition-all hover:border-red-500/40 hover:bg-red-500/10 active:scale-[0.99]"
				>
					<div class="flex items-center justify-center gap-2">
						<svg
							class="h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							></path>
						</svg>
						Delete Alarm
					</div>
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.alarm-slider::-webkit-slider-thumb {
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
		border: 2px solid rgba(15, 23, 42, 1);
		box-shadow: 0 0 15px rgba(251, 191, 36, 0.5);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.alarm-slider::-webkit-slider-thumb:hover {
		transform: scale(1.15);
		box-shadow: 0 0 25px rgba(251, 191, 36, 0.7);
	}

	.alarm-slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
		border: 2px solid rgba(15, 23, 42, 1);
		box-shadow: 0 0 15px rgba(251, 191, 36, 0.5);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.alarm-slider::-moz-range-thumb:hover {
		transform: scale(1.15);
		box-shadow: 0 0 25px rgba(251, 191, 36, 0.7);
	}
</style>
