<script lang="ts">
	import { DAYS, WEEKDAYS, WEEKEND, ALL_DAYS, type DayOfWeek } from '$lib/types/alarm';

	interface Props {
		selectedDays: DayOfWeek[];
		onchange: (days: DayOfWeek[]) => void;
	}

	let { selectedDays = $bindable([]), onchange }: Props = $props();

	function toggleDay(day: DayOfWeek) {
		if (selectedDays.includes(day)) {
			selectedDays = selectedDays.filter((d) => d !== day);
		} else {
			selectedDays = [...selectedDays, day];
		}
		onchange(selectedDays);
	}

	function selectWeekdays() {
		selectedDays = [...WEEKDAYS];
		onchange(selectedDays);
	}

	function selectWeekend() {
		selectedDays = [...WEEKEND];
		onchange(selectedDays);
	}

	function selectAll() {
		selectedDays = [...ALL_DAYS];
		onchange(selectedDays);
	}

	function clearAll() {
		selectedDays = [];
		onchange(selectedDays);
	}
</script>

<div class="space-y-4">
	<!-- Quick select buttons -->
	<div class="flex flex-wrap gap-2">
		<button
			type="button"
			onclick={selectWeekdays}
			class="rounded-xl border border-white/10 bg-slate-800/50 px-4 py-2 text-sm font-light text-slate-400 transition-all hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-400 active:scale-95"
		>
			Weekdays
		</button>
		<button
			type="button"
			onclick={selectWeekend}
			class="rounded-xl border border-white/10 bg-slate-800/50 px-4 py-2 text-sm font-light text-slate-400 transition-all hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-400 active:scale-95"
		>
			Weekend
		</button>
		<button
			type="button"
			onclick={selectAll}
			class="rounded-xl border border-white/10 bg-slate-800/50 px-4 py-2 text-sm font-light text-slate-400 transition-all hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-400 active:scale-95"
		>
			Every day
		</button>
		<button
			type="button"
			onclick={clearAll}
			class="rounded-xl border border-white/10 bg-slate-800/50 px-4 py-2 text-sm font-light text-slate-400 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 active:scale-95"
		>
			Clear
		</button>
	</div>

	<!-- Individual day buttons -->
	<div class="grid grid-cols-7 gap-2">
		{#each DAYS as { value, label }}
			{@const isSelected = selectedDays.includes(value)}
			<button
				type="button"
				onclick={() => toggleDay(value)}
				class="group relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border text-sm font-light transition-all active:scale-95 {isSelected
					? 'border-amber-500/50 bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 shadow-lg shadow-amber-500/20'
					: 'border-white/10 bg-slate-800/30 text-slate-500 hover:border-white/20 hover:bg-white/5 hover:text-slate-400'}"
				aria-label="Toggle {label}"
				aria-pressed={isSelected}
			>
				{#if isSelected}
					<div
						class="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-50 blur-xl"
					></div>
				{/if}
				<span class="relative">{label}</span>
			</button>
		{/each}
	</div>

	<!-- Selected days summary -->
	{#if selectedDays.length > 0}
		<div class="rounded-xl bg-slate-800/30 px-4 py-3 text-center text-sm text-slate-400">
			{#if selectedDays.length === 7}
				Every day
			{:else if selectedDays.length === 5 && WEEKDAYS.every((d) => selectedDays.includes(d))}
				Weekdays only
			{:else if selectedDays.length === 2 && WEEKEND.every((d) => selectedDays.includes(d))}
				Weekend only
			{:else}
				{selectedDays.length} day{selectedDays.length !== 1 ? 's' : ''} selected
			{/if}
		</div>
	{/if}
</div>
