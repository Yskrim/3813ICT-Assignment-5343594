import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { Group, Channel, User } from '../../models';
import { GroupService } from '../../services/group.service';
import { ChannelService } from '../../services/channel.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
	imports: [RouterLink],
	selector: 'app-group-info',
	styleUrl: './group-info.css',
	templateUrl: './group-info.html',
})
export class GroupInfo implements OnInit {
	private route = inject(ActivatedRoute);
	private groupService = inject(GroupService);
	private userService = inject(UserService);
	private channelService = inject(ChannelService);
	private location = inject(Location);
	private auth = inject(AuthService);

	gId = '';
	uId = '';
	group: Group | undefined;
	channels: Channel[] = [];
	members: User[] = [];
	loading = true;

	constructor() {}

	ngOnInit(): void {
		this.gId = this.route.snapshot.paramMap.get('gId')!;
		this.uId = this.auth.currentUser()?.id ?? '';

		// Fetch group info first
		this.groupService.getById(this.gId).subscribe({
			next: (group) => {
				this.group = group;
				if (!group) {
					this.loading = false;
					return;
				}

				// Fetch channels for the group
				this.channelService.getForGroup(this.gId, this.uId).subscribe({
					next: (channels) => {
						this.channels = channels;

						// Fetch members for the group
						this.userService.getByIds(group.memberIds || []).subscribe({
							next: (members) => {
								this.members = members;
								this.loading = false;
							},
							error: () => {
								this.loading = false;
							},
						});
					},
					error: () => {
						this.loading = false;
					},
				});
			},
			error: () => {
				this.loading = false;
			},
		});
	}

	goBack(): void {
		this.location.back();
	}
}
