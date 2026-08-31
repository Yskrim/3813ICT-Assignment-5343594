import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { Channel, Group, User } from '../../models';
import { ChannelService } from '../../services/channel.service';
import { UserService } from '../../services/user.service';
import { GroupService } from '../../services/group.service';

@Component({
  imports: [RouterLink],
  selector: 'app-channel-info',
  styleUrl: './channel-info.css',
  templateUrl: './channel-info.html',
})

export class ChannelInfo implements OnInit {
  gId = '';
  cId = '';
  group: Group | undefined;
  channel: Channel | undefined;
  members: User[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private channelService: ChannelService,
    private groupService: GroupService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.gId = this.route.snapshot.paramMap.get('gId')!;
    this.cId = this.route.snapshot.paramMap.get('cId')!;
    this.group = this.groupService.getByGroupId(this.gId);
    this.channel = this.channelService.getByChannelId(this.cId);
    this.members = this.channel
      ? this.userService.getByIdsList(this.channel.memberIds)
      : [];

    console.log('gId', this.gId)
    console.log('cId', this.cId)
    console.log('channel', this.channel)
    console.log('members', this.members)
  }

  goBack(): void {
    this.location.back();
  }
}