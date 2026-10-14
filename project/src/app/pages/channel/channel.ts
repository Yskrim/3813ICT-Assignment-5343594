import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { Group, Channel, Message, User } from '../../models';
import { GroupService } from '../../services/group.service';
import { ChannelService } from '../../services/channel.service';
import { MessageService } from '../../services/message.service';
import { Location } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
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
	private messageService = inject(MessageService);
	private userService = inject(UserService);
	private authService = inject(AuthService);
	private location = inject(Location);

	// USE ngModel and template variables -- TODO ---------------------------------------------------------------------------
	gId = '';
	cId = '';
	user!: User;

	// READ VALUES FROM IMPORTED SERVICES -- TODO ---------------------------------------------------------------------------

	group = signal<Group | undefined>(undefined);
	channel = signal<Channel | undefined>(undefined);
	messages = signal<Message[]>([]);
	members = signal<User[]>([]);
	loading = signal(true);

	form = new FormGroup({
		message: new FormControl(''),
	});

	goBack(): void {
		this.location.back();
	}

	handleSubmit() {
		const text = this.form.value.message;
		if (!text) return;

		const user = this.authService.currentUser();
		if (!user) return;

		// send -------------------------------------------------------------------------------------------------------------
		this.gId = this.route.snapshot.paramMap.get('gId')!;
		this.socket.send({
			id: crypto.randomUUID(),
			chatId: this.cId,
			senderId: user.id,
			text,
			createdAt: new Date().toISOString(),
			isEdited: false,
		});

		// rerender
		// this.messages.set(this.messageService.getMessagesForChannel(this.cId));
		this.form.reset();
	}

	deleteMessage(messageId: string): void {
		const user = this.authService.currentUser();
		if (!user) return;

		const deleted = this.messageService.deleteMessage(this.cId, user.id, messageId);
		if (!deleted) return;

		this.messages.set(this.messageService.getMessagesForChannel(this.cId));
	}

	private socket = inject(SocketService);
	private sub?: Subscription;

	ngOnInit() {
		// subscribe to receiving messages from socket --------------------------------------------------------------------------
		this.sub = this.socket.getMessages().subscribe({
			next: (message) => {
				if (message.chatId !== this.cId) return;
				this.messages.update((prev) => [...prev, message]);
			},
		});

		// old code CLEAR OUT -- TODO --------------------------------------------------------------------------------------------
		this.gId = this.route.snapshot.paramMap.get('gId')!;
		this.cId = this.route.snapshot.paramMap.get('cId')!;

		const user = this.authService.currentUser();
		if (!user) {
			throw new Error('User not found.');
		}
		this.user = user;

		// get group and channel data in parallel
		forkJoin([this.groupService.getById(this.gId), this.channelService.getById(this.cId)]).subscribe({
			next: ([group, channel]) => {
				this.group.set(group);
				this.channel.set(channel);
				this.messages.set(this.messageService.getMessagesForChannel(this.cId));

				// getByIdsList returns Observable<User[]>, need to subscribe to get members
				this.userService.getByIds(channel.memberIds).subscribe({
					next: (members) => {
						this.members.set(members);
					},
					error: () => {
						this.members.set([]);
					},
				});
				this.loading.set(false);
			},
			error: () => {
				this.loading.set(false);
			},
		});
	}

	ngOnDestroy() {
		// unsubscribe from socket --------------------------------------------------------------------------------------------
		this.sub?.unsubscribe();
	}
}
