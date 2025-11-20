<script lang="ts">
	import type { AlarmSettings } from '$lib/types/alarm';
	import AlarmCard from './AlarmCard.svelte';

	interface Props {
		alarms: AlarmSettings[];
		onAddAlarm: () => void;
		onUpdateAlarm: (id: string, alarm: AlarmSettings) => void;
		onDeleteAlarm: (id: string) => void;
	}

	let { alarms, onAddAlarm, onUpdateAlarm, onDeleteAlarm }: Props = $props();

	const activeAlarmsCount = $derived(alarms.filter((a) => a.enabled).length);
	let currentTime = $state(
		new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
	);

	$effect(() => {
		const interval = setInterval(() => {
			currentTime = new Date().toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			});
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="mx-auto max-w-5xl space-y-8 px-4 py-8 pb-24 md:px-6 md:pb-8">
	<!-- Hero section with current time -->
	<div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 p-8">
		<!-- Ambient glow -->
		<div
			class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/20 blur-[100px]"
		></div>
		<div
			class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-500/20 blur-[100px]"
		></div>

		<div class="relative">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-5xl font-light tracking-tight text-white md:text-7xl">{currentTime}</h1>
					<p class="mt-3 text-lg text-slate-400">
						{activeAlarmsCount} active alarm{activeAlarmsCount !== 1 ? 's' : ''}
					</p>
				</div>
				<div class="hidden md:block">
					<svg
						class="h-24 w-24 text-amber-400/30"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
						></path>
					</svg>
				</div>
			</div>
		</div>
	</div>

	<!-- Alarms list -->
	<div class="space-y-4">
		{#if alarms.length === 0}
			<div
				class="group relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-12 text-center backdrop-blur-sm transition-all duration-500 hover:border-white/10"
			>
				<div
					class="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 opacity-0 transition-opacity duration-500 group-hover:from-amber-500/5 group-hover:to-orange-500/5 group-hover:opacity-100"
				></div>
				<div class="relative">
					<svg
						class="mx-auto h-16 w-16 text-slate-700"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
					<h3 class="mt-6 text-xl font-light text-slate-300">No alarms configured</h3>
					<p class="mt-2 text-slate-500">Create your first sunrise alarm to get started</p>
				</div>
			</div>
		{:else}
			{#each alarms as alarm (alarm.id)}
				<AlarmCard
					alarm={alarm}
					onupdate={(updated) => onUpdateAlarm(alarm.id, updated)}
					ondelete={() => onDeleteAlarm(alarm.id)}
				/>
			{/each}
		{/if}
	</div>

	<!-- Add alarm button -->
	<button
		type="button"
		onclick={onAddAlarm}
		class="group relative w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)] active:scale-[0.99]"
	>
		<div
			class="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 opacity-0 transition-opacity duration-300 group-hover:from-amber-500/10 group-hover:to-orange-500/10 group-hover:opacity-100"
		></div>
		<div class="relative flex items-center justify-center gap-3">
			<svg
				class="h-6 w-6 text-amber-400 transition-transform duration-300 group-hover:rotate-90"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 6v6m0 0v6m0-6h6m-6 0H6"
				></path>
			</svg>
			<span class="text-lg font-light text-slate-300">Add New Alarm</span>
		</div>
	</button>
</div>
