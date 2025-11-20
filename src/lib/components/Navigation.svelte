<script lang="ts">
	interface Props {
		activeTab: 'clock' | 'manual' | 'settings';
		onTabChange: (tab: 'clock' | 'manual' | 'settings') => void;
	}

	let { activeTab, onTabChange }: Props = $props();

	const tabs = [
		{ id: 'clock' as const, label: 'Clock', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
		{
			id: 'manual' as const,
			label: 'Manual',
			icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
		},
		{
			id: 'settings' as const,
			label: 'Settings',
			icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
		}
	];
</script>

<nav class="fixed bottom-0 left-0 right-0 z-50 md:relative md:bottom-auto">
	<div
		class="mx-auto max-w-7xl border-t border-white/10 bg-gradient-to-b from-slate-900/95 to-slate-950/95 px-4 backdrop-blur-xl md:border-0 md:bg-transparent md:px-0 md:backdrop-blur-none"
	>
		<div class="flex items-center justify-around gap-2 py-2 md:justify-center md:gap-4 md:py-6">
			{#each tabs as tab}
				<button
					type="button"
					onclick={() => onTabChange(tab.id)}
					class="group relative flex flex-1 flex-col items-center gap-2 rounded-2xl px-6 py-3 transition-all duration-300 md:flex-initial md:flex-row md:px-8 md:py-4 {activeTab ===
					tab.id
						? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20'
						: 'hover:bg-white/5'}"
				>
					<!-- Active indicator -->
					{#if activeTab === tab.id}
						<div
							class="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 opacity-10 blur-xl transition-opacity duration-300"
						></div>
					{/if}

					<!-- Icon -->
					<svg
						class="h-6 w-6 transition-all duration-300 {activeTab === tab.id
							? 'text-amber-400'
							: 'text-slate-400 group-hover:text-slate-300'}"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={tab.icon}
						></path>
					</svg>

					<!-- Label -->
					<span
						class="text-xs font-medium transition-all duration-300 md:text-base {activeTab ===
						tab.id
							? 'text-amber-400'
							: 'text-slate-400 group-hover:text-slate-300'}"
					>
						{tab.label}
					</span>

					<!-- Active bar (desktop only) -->
					{#if activeTab === tab.id}
						<div
							class="absolute -bottom-1 left-1/2 hidden h-1 w-16 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 md:block"
						></div>
					{/if}
				</button>
			{/each}
		</div>
	</div>
</nav>
