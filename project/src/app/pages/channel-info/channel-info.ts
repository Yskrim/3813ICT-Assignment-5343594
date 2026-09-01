import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
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
  uId = '';
  gId = '';
  cId = '';
  group = signal<Group | undefined>(undefined);
  channel = signal<Channel | undefined>(undefined);
  members = signal<User[]>([]);


  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private channelService: ChannelService,
    private groupService: GroupService,
    private location: Location,
  ) { }

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.gId = this.route.snapshot.paramMap.get('gId')!;
    this.cId = this.route.snapshot.paramMap.get('cId')!;
    this.uId = this.route.snapshot.parent?.paramMap.get('userId') || '';

    forkJoin([
      this.groupService.getByGroupId(this.uId, this.gId),
      this.channelService.getByChannelId(this.cId),
    ]).subscribe({
      next: ([group, channel]) => {
        this.group.set(group);
        this.channel.set(channel);
        if (channel && channel.memberIds) {
   
          this.userService.getByIdsList(channel.memberIds).subscribe({
     
            next: (members) => {
              this.members.set(members);
            },
            error: () => {
              this.members.set([]);
            }
          });
        } else {
          this.members.set([]);
        }
      },
      error: () => {
      },
    });
  }
}