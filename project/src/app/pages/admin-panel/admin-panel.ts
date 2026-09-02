import { NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';

import { User, AdminRequest, Group, Channel } from '../../models';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ChannelService } from '../../services/channel.service';
import { GroupService } from '../../services/group.service';
import { AdminRequestService } from '../../services/admin-request.service';
import { UtilsService } from '../../services/utils.service';

@Component({
	imports: [RouterLink, NgTemplateOutlet],
	selector: 'app-admin-panel',
	styleUrl: './admin-panel.css',
	templateUrl: './admin-panel.html',
})


export class AdminPanelPage implements OnInit {
	user!: User;
	requests = signal<{ groupRequests: AdminRequest[]; superRequests: AdminRequest[] }>({
		groupRequests: [],
		superRequests: []
	});
	groups = signal<Group[]>([]);
	channelsByGroup = signal<Record<string, Channel[]>>({});

	constructor(
		private auth: AuthService,
		private userService: UserService,
		private groupService: GroupService,
		private channelService: ChannelService,
		private adminRequestService: AdminRequestService,
		private utilsService: UtilsService,
		private router: Router,
	) { }

	ngOnInit(): void {
		// get user
		const currentUser = this.auth.currentUser();
		if (!currentUser) {
			this.router.navigate(['/login']);
			return;
		}
		this.user = currentUser;

		// get requests
		if (currentUser.role === 'user') {
			this.router.navigate(['/home']);
			return;
		}

		// Load required data from server
		forkJoin([
			this.userService.getByUserId(this.user.id), // loads current user data
			this.groupService.getGroupsForUser(this.user.id), // loads groups the user is in

		]).subscribe({
			next: ([user, groups]) => {

				// Set groups in local state
				this.groups.set(groups);

				// Clear current channel map
				this.channelsByGroup.set({});

				// If the user is not a member of any groups, immediately load admin requests
				if (groups.length === 0) {
					this.loadAdminRequests();
					return;
				}

				// Fetch channels for each group and build a Map<string, Channel[]>
				forkJoin(
					this.groups().map((group: Group) =>

						this.channelService.getByGroupId(this.user!.id, group.id)
					),
				).subscribe({
					next: () => {
						this.loadAdminRequests();
					},
				});
			},
		});
	}

	loadAdminRequests(): void {
		if (!this.user) return;

		//get requests
		// subscribe to the observable and assign result to this.requests when loaded.
		this.adminRequestService.getAdminRequests(this.user).subscribe({
			next: (result) => {
				this.requests.set(result);
				console.log(result)
			},
			error: () => {
				this.requests.set({ groupRequests: [], superRequests: [] });

			}
		});
	}

	// fetch user data to fill request cards
	private loadUsersForRequests(result: {
		groupRequests: AdminRequest[];
		superRequests: AdminRequest[];
	}): void {
		// make a set for id's
		const ids = new Set<string>();

		// fill id list with any issuers + targets
		for (const req of [...result.groupRequests, ...result.superRequests]) {
			ids.add(req.issuerId);
			if (req.targetUserId) ids.add(req.targetUserId);
		}
		if (ids.size === 0) return;


	}

	// Skip loading other user

	issuerName(id: string): string {
		return id;
	}

	issuerRole(id: string): string {
		return 'user-role-unknown';
	}

	groupName(id?: string): string {
		return this.groups().find((g) => g.id === id)?.name ?? id ?? 'unknown';
	}

	channelName(id?: string): string {
		if (!id) return 'unknown';
		for (const channels of Object.values(this.channelsByGroup())) {
			const ch = channels.find((c) => c.id === id);
			if (ch) return ch.name;
		}
		return id;
	}

	approve(req: AdminRequest): void {
		this.adminRequestService
			.updateReqStatus(this.user.id, req.id, 'approved')
			.subscribe(() => this.loadAdminRequests());
	}

	reject(req: AdminRequest): void {
		this.adminRequestService
			.updateReqStatus(this.user.id, req.id, 'rejected')
			.subscribe(() => this.loadAdminRequests());
	}

	formatDate(d: Date): string {
		return this.utilsService.formatDate(d);
	}
}
