import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Group, Channel, Message, User } from '../../models'
import { GroupService } from '../../services/group.service';
import { ChannelService } from '../../services/channel.service';
import { MessageService } from '../../services/message.service';
import { Location } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
	imports: [RouterLink, ReactiveFormsModule],
	selector: 'app-channel',
	styleUrl: './channel.css',
	templateUrl: './channel.html',
})

export class ChannelPage implements OnInit {
	gId = '';
	cId = '';
	user!: User;

	group = signal<Group | undefined>(undefined);
	channel = signal<Channel | undefined>(undefined);
	messages = signal<Message[]>([]);
	members = signal<User[]>([]);
	loading = signal(true);

	form = new FormGroup({
		message: new FormControl('')
	})

	constructor(
		private route: ActivatedRoute,
		private groupService: GroupService,
		private channelService: ChannelService,
		private messageService: MessageService,
		private userService: UserService,
		private authService: AuthService,
		private location: Location,
	) { }

	goBack(): void {
		this.location.back();
	}

	handleSubmit() {
		const text = this.form.value.message;
		if (!text) return;

		const user = this.authService.currentUser();
		if (!user) return;

		// send
		this.messageService.sendMessage(this.cId, user.id, text);

		// rerender
		this.messageService.sendMessage(this.cId, user.id, text);
		this.messages.set(this.messageService.getMessagesForChannel(this.cId));
		this.form.reset();
	}

	deleteMessage(messageId: string): void {
		const user = this.authService.currentUser();
		if (!user) return;

		const deleted = this.messageService.deleteMessage(this.cId, user.id, messageId);
		if (!deleted) return;

		this.messages.set(this.messageService.getMessagesForChannel(this.cId));
	}

	ngOnInit() {
		this.gId = this.route.snapshot.paramMap.get('gId')!;
		this.cId = this.route.snapshot.paramMap.get('cId')!;

		const user = this.authService.currentUser();
		if (!user) {
			throw new Error("User not found.");
		}
		this.user = user;

		// get group and channel data in parallel
		forkJoin([
			this.groupService.getByGroupId(user.id, this.gId),
			this.channelService.getByChannelId(this.cId),
		]).subscribe({
			next: ([group, channel]) => {

				this.group.set(group);
				this.channel.set(channel);
				this.messages.set(this.messageService.getMessagesForChannel(this.cId));

				// getByIdsList returns Observable<User[]>, need to subscribe to get members
				this.userService.getByIdsList(channel.memberIds).subscribe({
					next: (members) => {
						this.members.set(members);
					},
					error: () => {
						this.members.set([]);
					}
				});
				this.loading.set(false);
			},
			error: () => { this.loading.set(false) },
		});
	}
}



