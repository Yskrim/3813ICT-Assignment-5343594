import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Group, Channel, Message, User } from '../../models'
import { GroupService } from '../../services/group.service';
import { ChannelService } from '../../services/channel.service';
import { MessageService } from '../../services/message.service';
import { Location } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-channel',
  styleUrl: './channel.css',
  templateUrl: './channel.html',
})

export class ChannelPage {
  gId = '';
  cId = '';
  user!: User;
  group?: Group;
  channel?: Channel;
  messages?: Message[] = [];

  form = new FormGroup({
    message: new FormControl('')
  })

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private channelService: ChannelService,
    private messageService: MessageService,
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
    this.messages = this.messageService.getMessagesForChannel(this.cId);
    this.form.reset();
  }

  deleteMessage(messageId: string): void {
    const user = this.authService.currentUser();
    if (!user) return;

    const deleted = this.messageService.deleteMessage(this.cId, user.id, messageId);
    if (!deleted) return;

    this.messages = this.messageService.getMessagesForChannel(this.cId);
  }

  ngOnInit() {
    this.gId = this.route.snapshot.paramMap.get('gId')!;
    this.cId = this.route.snapshot.paramMap.get('cId')!;
    console.log("cId:", this.cId);
    
    const user = this.authService.currentUser();
    if (!user) {
      throw new Error("User not found.");
    }
    this.user = user;

    this.group = this.groupService.getByGroupId(this.gId);
    this.channel = this.channelService.getByChannelId(this.cId);
    this.messages = this.messageService.getMessagesForChannel(this.cId);
  }
}


