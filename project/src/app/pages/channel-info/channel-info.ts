import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink} from '@angular/router';
import { Location } from '@angular/common';
import { Channel, User } from '../../models';
import { ChannelService } from '../../services/channel.service';
import { UserService } from '../../services/user.service';

@Component({
  imports: [RouterLink],
  selector: 'app-channel-info',
  styleUrl: './channel-info.css',
  templateUrl: './channel-info.html',
})

export class ChannelInfo implements OnInit {
  gId = '';
  cId = '';
  channel: Channel | undefined;
  members: User[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private channelService: ChannelService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.gId = this.route.snapshot.paramMap.get('gId')!;
    this.cId = this.route.snapshot.paramMap.get('cId')!;
    this.channel = this.channelService.getByChannelId(this.cId);
    this.members = this.userService.getMembers(this.cId);
  }

  goBack(): void {
    this.location.back();
  }
}