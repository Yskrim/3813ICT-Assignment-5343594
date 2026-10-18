import { Component, computed, inject, input, output, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { Channel, Group } from '../../models';

@Component({
	imports: [RouterLink, RouterLinkActive],
	selector: 'app-sidebar',
	styleUrl: './sidebar.css',
	templateUrl: './sidebar.html',
})
export class Sidebar {
	private auth = inject(AuthService);
	private groupService = inject(GroupService);

	user = this.auth.currentUser;
	groups = input.required<Group[]>();
	channelsByGroup = input.required<Record<string, Channel[]>>();

	// tell home to reload groups after join
	joined = output<void>();

	// search ---
	query = signal('');
	joinError = signal('');

	// wait 300ms after typing, new text cancels old request (switchMap)
	results = toSignal(
		toObservable(this.query).pipe(
			map((q) => q.trim()),
			debounceTime(300),
			distinctUntilChanged(),
			switchMap((q) => (q ? this.groupService.search(q).pipe(catchError(() => of([]))) : of([]))),
		),
		{ initialValue: [] as Group[] },
	);

	// ids of my groups -> show "joined" instead of button
	myGroupIds = computed(() => new Set(this.groups().map((g) => g.id)));

	// join
	join(group: Group): void {
		const userId = this.user()?.id;
		if (!userId) return;

		this.joinError.set('');
		this.groupService.join(group.id, userId).subscribe({
			next: () => {
				this.query.set('');
				this.joined.emit();
			},
			error: () => this.joinError.set(`Could not join ${group.name}`),
		});
	}
}
