<script lang="ts">
	import type { AlarmSettings } from '$lib/types/alarm';
	import Navigation from '$lib/components/Navigation.svelte';
	import ClockPage from '$lib/components/ClockPage.svelte';
	import ManualPage from '$lib/components/ManualPage.svelte';
	import SettingsPage from '$lib/components/SettingsPage.svelte';

	let activeTab = $state<'clock' | 'manual' | 'settings'>('clock');

	let alarms = $state<AlarmSettings[]>([
		{
			id: '1',
			enabled: true,
			time: '07:00',
			days: ['mon', 'tue', 'wed', 'thu', 'fri'],
			color: { r: 255, g: 150, b: 50 },
			brightness: 80,
			duration: 30,
			name: 'Weekday Morning'
		},
		{
			id: '2',
			enabled: false,
			time: '09:00',
			days: ['sat', 'sun'],
			color: { r: 255, g: 200, b: 100 },
			brightness: 60,
			duration: 45,
			name: 'Weekend Wake Up'
		}
	]);

	function addAlarm() {
		const newAlarm: AlarmSettings = {
			id: Date.now().toString(),
			enabled: true,
			time: '07:00',
			days: [],
			color: { r: 255, g: 150, b: 50 },
			brightness: 80,
			duration: 30
		};
		alarms = [...alarms, newAlarm];
	}

	function updateAlarm(id: string, updatedAlarm: AlarmSettings) {
		alarms = alarms.map((a) => (a.id === id ? updatedAlarm : a));
	}

	function deleteAlarm(id: string) {
		alarms = alarms.filter((a) => a.id !== id);
	}
</script>

<div class="min-h-screen bg-slate-950">
	<!-- Navigation -->
	<Navigation {activeTab} onTabChange={(tab) => (activeTab = tab)} />

	<!-- Main content -->
	<main>
		{#if activeTab === 'clock'}
			<ClockPage
				{alarms}
				onAddAlarm={addAlarm}
				onUpdateAlarm={updateAlarm}
				onDeleteAlarm={deleteAlarm}
			/>
		{:else if activeTab === 'manual'}
			<ManualPage />
		{:else if activeTab === 'settings'}
			<SettingsPage />
		{/if}
	</main>
</div>
