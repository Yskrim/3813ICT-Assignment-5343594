import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Group, Channel } from '../../models';
import { GroupService } from '../../services/group.service';
import { ChannelService } from '../../services/channel.service';
import { AuthService } from '../../services/auth.service';
import { Sidebar } from '../../components/sidebar/sidebar';
import { concatMap, defaultIfEmpty, forkJoin, map, of, switchMap, tap } from 'rxjs';

@Component({
	imports: [RouterOutlet, Sidebar],
	selector: 'app-home',
	styleUrl: './home.css',
	templateUrl: './home.html',
})
export class HomePage implements OnInit {
	private groupService = inject(GroupService);
	private channelService = inject(ChannelService);
	private auth = inject(AuthService);
	protected route = inject(ActivatedRoute);

	// page state -------------------------------------------------------------------------------------------
	readonly user = this.auth.currentUser; // signal, for header
	readonly groups = signal<Group[]>([]);
	readonly channelsByGroup = signal<Record<string, Channel[]>>({});

	// groups + their channels, again after join from search
	loadGroups(): void {
		const userId = this.user()?.id;
		if (!userId) return;
		// ... старый код getForUser / forkJoin без изменений
	}
    
	// lifecycle ------------------------------------------------------------------------------------------
	ngOnInit(): void {
		this.loadGroups();

		const userId = this.user()?.id;
		if (!userId) return;

		// get groups
		this.groupService
			.getForUser(userId)
			.pipe(
				tap((groups) => this.groups.set(groups)),

				// { groupId: getForGroup$ } -> forkJoin returns { groupId: Channel[] }
				switchMap(
					(groups) =>
						forkJoin(
							Object.fromEntries(groups.map((g) => [g.id, this.channelService.getForGroup(g.id, userId)])),
						).pipe(defaultIfEmpty({})), // no groups -> forkJoin({}) emits nothing, so give {}
				),
			)
			.subscribe({
				next: (channelsByGroup) => this.channelsByGroup.set(channelsByGroup),
				error: () => this.channelsByGroup.set({}),
			});
	}
}
