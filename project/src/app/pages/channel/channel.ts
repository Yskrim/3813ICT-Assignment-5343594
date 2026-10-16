import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { Location } from '@angular/common';

import { Group, Channel, Message, User } from '../../models';
import { GroupService } from '../../services/group.service';
import { ChannelService } from '../../services/channel.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { SocketService } from '../../services/socket.service';

@Component({
	imports: [RouterLink, ReactiveFormsModule],
	selector: 'app-channel',
	styleUrl: './channel.css',
	templateUrl: './channel.html',
})
export class ChannelPage implements OnInit, OnDestroy {
	// CLEAR DEPENDENCIES -- TODO --------------------------------------------------------------------------------
	private route = inject(ActivatedRoute);
	private groupService = inject(GroupService);
	private channelService = inject(ChannelService);
	private userService = inject(UserService);
	private authService = inject(AuthService);
	private socket = inject(SocketService);
	private location = inject(Location);

	private messageSub?: Subscription;
	private historySub?: Subscription;

	// READ VALUES FROM IMPORTED SERVICES -- TODO ---------------------------------------------------------------------------
	protected user = this.authService.currentUser;
	protected group = signal<Group | undefined>(undefined);
	protected channel = signal<Channel | undefined>(undefined);
	protected messages = signal<Message[]>([]);
	protected members = signal<User[]>([]);
	protected isLoading = signal(true);

	protected form = new FormGroup({ message: new FormControl('') });
	protected groupId = '';
	protected channelId = '';

	protected goBack(): void {
		this.location.back();
	}

	// send -------------------------------------------------------------------------------------------------------------
	send(): void {
		const text = this.form.value.message?.trim();
		const user = this.user();
		if (!text || !user) return;

		this.socket.send({ channelId: this.channelId, senderId: user.id, text } as any);
		this.form.reset();
	}

	delete(messageId: string): void {
		return;
	}

	ngOnInit() {
        this.groupId = this.route.snapshot.paramMap.get('gId')!;
        this.channelId = this.route.snapshot.paramMap.get('cId')!;

		this.loadChannelData();

		// subscribe to receiving messages and history from socket --------------------------------------------------------------------------
		this.messageSub = this.socket.getMessages().subscribe((message) => this.messages.update((prev) => [...prev, message]));
		this.historySub = this.socket.getHistory().subscribe((history) => this.messages.set(history));
		this.socket.join(this.channelId); // join the room
	}

	ngOnDestroy() {
		// unsubscribe from socket --------------------------------------------------------------------------------------------
		this.socket.leave(this.channelId);
		this.messageSub?.unsubscribe();
		this.historySub?.unsubscribe();
	}

	private loadChannelData(): void {
		forkJoin([this.groupService.getById(this.groupId), this.channelService.getById(this.channelId)]).subscribe({
			next: ([group, channel]) => {
				this.group.set(group);
				this.channel.set(channel);
				this.isLoading.set(false);

				this.userService.getByIds(channel.memberIds).subscribe({
					next: (members) => this.members.set(members),
					error: () => this.members.set([]),
                    complete: () => console.log('members loaded')
				});
			},
			error: () => this.isLoading.set(false),
            complete: () => console.log('all data loaded\n', this.messages())
		});
	}
}
