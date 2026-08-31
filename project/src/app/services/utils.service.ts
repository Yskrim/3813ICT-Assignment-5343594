import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class UtilsService {
    formatDate(d: Date | string): string {
        const date = d instanceof Date ? d : new Date(d);
        return date.toISOString().slice(0, 10); // yyyy-mm-dd
    }
}
