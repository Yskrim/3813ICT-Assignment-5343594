import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Group, Channel } from '../../models';
import { GroupService } from '../../services/group.service';
import { ChannelService } from '../../services/channel.service';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';

import { AdminRequestService } from '../../services/admin-request.service';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	imports: [RouterLink, ReactiveFormsModule],
	selector: 'app-group',
	styleUrl: './group.css',
	templateUrl: './group.html',
})
export class GroupPage implements OnInit {
	gId = '';
	group = signal<Group | undefined>(undefined);
	channels = signal<Channel[]>([]);
	loading = signal(true);

	// request new channel ---
	showRequestForm = signal(false);
	requestStatus = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');
	requestForm = new FormGroup({
		name: new FormControl('', {
			nonNullable: true,
			validators: [Validators.required, Validators.maxLength(40)],
		}),
		note: new FormControl('', { nonNullable: true }),
	});

	constructor(
		private route: ActivatedRoute,
		private groupService: GroupService,
		private channelService: ChannelService,
		private auth: AuthService,
		private location: Location,
		private adminRequests: AdminRequestService,
	) {}

	// send createChannel request, admin approves it in admin panel
	requestChannel(): void {
		const user = this.auth.currentUser();
		const { name, note } = this.requestForm.getRawValue();
		if (!user || !name.trim()) return;

		this.requestStatus.set('sending');
		this.adminRequests
			.create({
				type: 'createChannel',
				issuerId: user.id,
				targetGroupId: this.gId,
				proposedChannelName: name.trim(),
				note,
			})
			.subscribe({
				next: () => {
					this.requestStatus.set('sent');
					this.requestForm.reset();
					this.showRequestForm.set(false);
				},
				error: () => this.requestStatus.set('error'),
			});
	}

	goBack(): void {
		this.location.back();
	}

	ngOnInit(): void {
		this.gId = this.route.snapshot.paramMap.get('gId')!;
		const user = this.auth.currentUser()!;

		forkJoin([this.groupService.getById(this.gId), this.channelService.getForGroup(this.gId, user.id)]).subscribe({
			next: ([group, channels]) => {
				this.group.set(group);
				this.channels.set(channels ?? []);
				this.loading.set(false);
			},
			error: () => {
				this.group.set(undefined);
				this.channels.set([]);
				this.loading.set(false);
			},
		});
	}
}
