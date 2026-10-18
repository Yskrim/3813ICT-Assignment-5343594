import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UtilsService {
	formatDate(d: Date | string | null | undefined): string {
		if (!d) return '';
		const date = d instanceof Date ? d : new Date(d);
		if (isNaN(date.getTime())) return ''; // invalid date -> toISOString would throw
		return date.toISOString().slice(0, 10);
	}
}
