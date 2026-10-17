import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Group, Channel } from '../../models';
import { GroupService } from '../../services/group.service';
import { ChannelService } from '../../services/channel.service';
import { AuthService } from '../../services/auth.service';

@Component({
	imports: [RouterLink, RouterOutlet],
	selector: 'app-home',
	styleUrl: './home.css',
	templateUrl: './home.html',
})
export class HomePage implements OnInit {
	private groupService = inject(GroupService);
	private channelService = inject(ChannelService);
	private auth = inject(AuthService);

	// page state -------------------------------------------------------------------------------------------
	readonly user = this.auth.currentUser; // signal, for header
	readonly groups = signal<Group[]>([]);
	readonly channelsByGroup = signal<Record<string, Channel[]>>({});

	// lifecycle ------------------------------------------------------------------------------------------
	ngOnInit(): void {
		const user = this.auth.currentUser()!;

		// get groups
		this.groupService.getForUser(user.id).subscribe((groups) => {
			this.groups.set(groups);
			this.channelsByGroup.set({});

			// for each group fetch its channels and put in the map
			groups.forEach((group) => {
				this.channelService.getForGroup(group.id, user.id).subscribe((channels: Channel[]) => {
					this.channelsByGroup.update((current) => ({ ...current, [group.id]: channels }));
				});
			});
		});
	}
}
