import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, forkJoin, map, Subscription, switchMap, tap } from 'rxjs';
import { Location, DatePipe } from '@angular/common';

import { Group, Channel, Message, User } from '../../models';
import { GroupService } from '../../services/group.service';
import { ChannelService } from '../../services/channel.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { SocketService } from '../../services/socket.service';

@Component({
	imports: [RouterLink, ReactiveFormsModule, DatePipe],
	selector: 'app-channel',
	styleUrl: './channel.css',
	templateUrl: './channel.html',
})
export class ChannelPage implements OnInit, OnDestroy {
	// DEPENDENCY injection --------------------------------------------------------------------------------
	private route = inject(ActivatedRoute);
	private groupService = inject(GroupService);
	private channelService = inject(ChannelService);
	private userService = inject(UserService);
	private authService = inject(AuthService);
	private socket = inject(SocketService);
	private location = inject(Location);

	// READ VALUES FROM IMPORTED SERVICES  ---------------------------------------------------------------------------
	protected readonly user = this.authService.currentUser;
	protected group = signal<Group | undefined>(undefined);
	protected channel = signal<Channel | undefined>(undefined);
	protected messages = signal<Message[]>([]);
	protected members = signal<User[]>([]);
    // senderId == username, rebuilds when members change
	protected memberNames = computed(() => new Map(this.members().map((m) => [m.id, m.username])));
	protected isLoading = signal(true);

	//subscriptions -- move to own interface - TODO
	private messageSub?: Subscription;
	private historySub?: Subscription;

	protected msgInputForm = new FormGroup({ message: new FormControl('') });
	protected groupId = '';
	protected channelId = '';

	// METHODS
	protected goBack(): void {
		this.location.back();
	}

	send(): void {
		const text = this.msgInputForm.value.message?.trim();
		const user = this.user();
		if (!text || !user) return;

		this.socket.send({ channelId: this.channelId, senderId: user.id, text } as any);
		this.msgInputForm.reset();
	}

	delete(messageId: string): void {
		this.socket.send({ channelId: this.channelId, messageId } as any);
	}

	ngOnInit() {
		// SUBSCRIBE TO THE SOCKET
		this.historySub = this.socket.getHistory().subscribe((history) => this.messages.set(history));

		this.messageSub = this.socket.getMessages().subscribe((message) => this.messages.update((prev) => [...prev, message]));

		// SUBSCRIBE TO CHANGE IN ROUTER PARAMS
		this.route.paramMap
			.pipe(
				tap((params) => {
					//leave other room before joining new
					if (this.channelId) this.socket.leave(this.channelId);
					//clear message history
					this.messages.set([]);

					// store current params
					this.groupId = params.get('gId') ?? '';
					this.channelId = params.get('cId') ?? '';

					this.socket.join(this.channelId); // join the new room
				}),
				tap({ subscribe: () => this.isLoading.set(true) }), // start process rule

				// OBSERVABLE CHAIN LINK 1
				switchMap(() =>
					forkJoin({
						group: this.groupService.getById(this.groupId),
						channel: this.channelService.getById(this.channelId),
					}).pipe(
						// OBSERVABLE CHAIN LINK 2
						switchMap(({ group, channel }) =>
							this.userService.getByIds(channel.memberIds).pipe(map((members) => ({ group, channel, members }))),
						),
						finalize(() => this.isLoading.set(false)), // finish process rule
					),
				),
			)
			.subscribe(({ group, channel, members }) => {
				this.group !== null && this.group.set(group);
				this.channel.set(channel);
				this.members.set(members);
			});
	}

	ngOnDestroy() {
		// unsubscribe from socket
		this.socket.leave(this.channelId);
		this.messageSub?.unsubscribe();
		this.historySub?.unsubscribe();
	}
}
