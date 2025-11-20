<script lang="ts">
	interface Props {
		time: string; // HH:mm format
		onchange: (time: string) => void;
	}

	let { time = $bindable('07:00'), onchange }: Props = $props();

	let hours = $state(7);
	let minutes = $state(0);

	// Parse initial time
	$effect(() => {
		const [h, m] = time.split(':').map(Number);
		hours = h;
		minutes = m;
	});

	function updateTime() {
		const newTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
		time = newTime;
		onchange(newTime);
	}

	function incrementHours() {
		hours = (hours + 1) % 24;
		updateTime();
	}

	function decrementHours() {
		hours = hours === 0 ? 23 : hours - 1;
		updateTime();
	}

	function incrementMinutes() {
		if (minutes === 55) {
			minutes = 0;
			incrementHours();
		} else {
			minutes += 5;
		}
		updateTime();
	}

	function decrementMinutes() {
		if (minutes === 0) {
			minutes = 55;
			decrementHours();
		} else {
			minutes -= 5;
		}
		updateTime();
	}
</script>

<div class="flex items-center justify-center gap-6">
	<!-- Hours -->
	<div class="flex flex-col items-center">
		<button
			type="button"
			onclick={incrementHours}
			class="group rounded-xl p-3 text-slate-500 transition-all hover:bg-white/5 hover:text-amber-400 active:scale-95"
			aria-label="Increase hours"
		>
			<svg
				class="h-6 w-6 transition-transform group-hover:-translate-y-0.5"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"
				></path>
			</svg>
		</button>

		<div
			class="my-3 flex h-28 w-24 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 text-5xl font-light tracking-tight text-white shadow-lg backdrop-blur-sm"
		>
			{hours.toString().padStart(2, '0')}
		</div>

		<button
			type="button"
			onclick={decrementHours}
			class="group rounded-xl p-3 text-slate-500 transition-all hover:bg-white/5 hover:text-amber-400 active:scale-95"
			aria-label="Decrease hours"
		>
			<svg
				class="h-6 w-6 transition-transform group-hover:translate-y-0.5"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
				></path>
			</svg>
		</button>

		<span class="mt-2 text-xs font-light uppercase tracking-wide text-slate-600">Hours</span>
	</div>

	<!-- Separator -->
	<div class="mb-8 text-5xl font-extralight text-slate-700">:</div>

	<!-- Minutes -->
	<div class="flex flex-col items-center">
		<button
			type="button"
			onclick={incrementMinutes}
			class="group rounded-xl p-3 text-slate-500 transition-all hover:bg-white/5 hover:text-amber-400 active:scale-95"
			aria-label="Increase minutes"
		>
			<svg
				class="h-6 w-6 transition-transform group-hover:-translate-y-0.5"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"
				></path>
			</svg>
		</button>

		<div
			class="my-3 flex h-28 w-24 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/80 to-slate-900/80 text-5xl font-light tracking-tight text-white shadow-lg backdrop-blur-sm"
		>
			{minutes.toString().padStart(2, '0')}
		</div>

		<button
			type="button"
			onclick={decrementMinutes}
			class="group rounded-xl p-3 text-slate-500 transition-all hover:bg-white/5 hover:text-amber-400 active:scale-95"
			aria-label="Decrease minutes"
		>
			<svg
				class="h-6 w-6 transition-transform group-hover:translate-y-0.5"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
				></path>
			</svg>
		</button>

		<span class="mt-2 text-xs font-light uppercase tracking-wide text-slate-600">Minutes</span>
	</div>
</div>
