export interface RGBColor {
	r: number; // 0-255
	g: number; // 0-255
	b: number; // 0-255
}

export interface AlarmSettings {
	id: string;
	enabled: boolean;
	time: string; // HH:mm format
	days: DayOfWeek[];
	color: RGBColor;
	brightness: number; // 0-100
	duration: number; // sunrise duration in minutes
	name?: string;
}

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export const DAYS: { value: DayOfWeek; label: string }[] = [
	{ value: 'mon', label: 'Mon' },
	{ value: 'tue', label: 'Tue' },
	{ value: 'wed', label: 'Wed' },
	{ value: 'thu', label: 'Thu' },
	{ value: 'fri', label: 'Fri' },
	{ value: 'sat', label: 'Sat' },
	{ value: 'sun', label: 'Sun' }
];

export const WEEKDAYS: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri'];
export const WEEKEND: DayOfWeek[] = ['sat', 'sun'];
export const ALL_DAYS: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
