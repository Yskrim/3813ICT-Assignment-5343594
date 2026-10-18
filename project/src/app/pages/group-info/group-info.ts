import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { forkJoin, map, switchMap } from 'rxjs';

import { AdminRequest, Channel, Group, User } from '../../models';
import { AuthService } from '../../services/auth.service';
import { GroupService } from '../../services/group.service';
import { ChannelService } from '../../services/channel.service';
import { UserService } from '../../services/user.service';
import { AdminRequestService } from '../../services/admin-request.service';

// what user sees after clicking an action
type Flash = { kind: 'success' | 'danger'; text: string } | null;

@Component({
	imports: [RouterLink],
	selector: 'app-group-info',
	styleUrl: './group-info.css',
	templateUrl: './group-info.html',
})
export class GroupInfo implements OnInit {
	// dependencies ---
	private route = inject(ActivatedRoute);
	private location = inject(Location);
	private auth = inject(AuthService);
	private groupService = inject(GroupService);
	private channelService = inject(ChannelService);
	private userService = inject(UserService);
	private adminRequests = inject(AdminRequestService);

	// route params ---
	protected gId = '';

	// page state ---
	protected me = this.auth.currentUser;
	protected group = signal<Group | undefined>(undefined);
	protected channels = signal<Channel[]>([]);
	protected members = signal<User[]>([]);
	protected isLoading = signal(true);
	protected flash = signal<Flash>(null);

	// permissions ---
	// group admin of this group or super admin can manage group
	protected canManage = computed(() => {
		const me = this.me();
		const group = this.group();
		if (!me || !group) return false;
		return me.role === 'superAdmin' || group.adminIds.includes(me.id);
	});

	protected isGroupAdmin = (userId: string) => this.group()?.adminIds.includes(userId) ?? false;

	// lifecycle ---
	ngOnInit(): void {
		this.gId = this.route.snapshot.paramMap.get('gId') ?? '';
		const userId = this.me()?.id ?? '';

		// group + channels in parallel, then people (members + admins)
		forkJoin({
			group: this.groupService.getById(this.gId),
			channels: this.channelService.getForGroup(this.gId, userId),
		})
			.pipe(
				switchMap(({ group, channels }) => {
					// admin may be not in memberIds -> merge, Set removes duplicates
					const ids = [...new Set([...group.adminIds, ...group.memberIds])];
					return this.userService.getByIds(ids).pipe(map((members) => ({ group, channels, members })));
				}),
			)
			.subscribe({
				next: ({ group, channels, members }) => {
					this.group.set(group);
					this.channels.set(channels);
					this.members.set(members);
					this.isLoading.set(false);
				},
				error: () => {
					this.isLoading.set(false);
					this.flash.set({ kind: 'danger', text: 'Could not load group.' });
				},
			});
	}

	// actions -> admin requests, nothing changes until admin approves ---
	protected kick(user: User): void {
		this.sendRequest(
			{ type: 'kickUser', targetGroupId: this.gId, targetUserId: user.id },
			`Kick request for ${user.displayName} sent.`,
		);
	}

	protected makeAdmin(user: User): void {
		this.sendRequest(
			{ type: 'giveAdmin', targetGroupId: this.gId, targetUserId: user.id },
			`Admin request for ${user.displayName} sent to super admin.`,
		);
	}

	protected ban(user: User): void {
		this.sendRequest({ type: 'banUser', targetUserId: user.id }, `Ban request for ${user.displayName} sent to super admin.`);
	}

	protected deleteGroup(): void {
		this.sendRequest({ type: 'deleteGroup', targetGroupId: this.gId }, 'Delete group request sent to super admin.');
	}

	protected goBack(): void {
		this.location.back();
	}

	// one place for all requests + user feedback
	private sendRequest(draft: Partial<AdminRequest> & Pick<AdminRequest, 'type'>, successText: string): void {
		const me = this.me();
		if (!me) return;
		this.adminRequests.create({ ...draft, issuerId: me.id }).subscribe({
			next: () => this.flash.set({ kind: 'success', text: successText }),
			error: () => this.flash.set({ kind: 'danger', text: 'Request failed. Try again.' }),
		});
	}
}
