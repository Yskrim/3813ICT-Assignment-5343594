import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink} from '@angular/router';
import { Location } from '@angular/common';
import { Group, Channel, User } from '../../models';
import { GroupService } from '../../services/group.service';
import { ChannelService } from '../../services/channel.service';
import { UserService } from '../../services/user.service';

@Component({
  imports: [RouterLink],
  selector: 'app-group-info',
  styleUrl: './group-info.css',
  templateUrl: './group-info.html',
})

export class GroupInfo implements OnInit {
  gId = '';
  group: Group | undefined;
  channels: Channel[] = [];
  members: User[] = [];

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private userService: UserService,
    private channelService: ChannelService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.gId = this.route.snapshot.paramMap.get('gId')!;
    this.group = this.groupService.getByGroupId(this.gId);
    this.channels = this.channelService.getByGroupId(this.gId);
    this.members = this.userService.getMembers(this.gId);
  }

  goBack(): void {
    this.location.back();
  }
}
