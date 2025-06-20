export interface Widget {
	id: number;
	name: string;
	quantity: number;
}

export interface Location {
	id: number;
	name: string;
	widgets: Widget[];
}
