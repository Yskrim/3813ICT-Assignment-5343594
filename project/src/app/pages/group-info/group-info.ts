import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
  uId = '';
  group: Group | undefined;
  channels: Channel[] = [];
  members: User[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private userService: UserService,
    private channelService: ChannelService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.gId = this.route.snapshot.paramMap.get('gId')!;
    this.uId = this.route.snapshot.parent?.paramMap.get('userId')!;

    // Fetch group info first
    this.groupService
      .getByGroupId(this.uId, this.gId)
      .subscribe({ next: (group) => {
          this.group = group;
          if (!group) {
            this.loading = false;
            return;
          }

          // Fetch channels for the group
          this.channelService.getByGroupId( this.uId, this.gId
          ).subscribe({
            next: (channels) => {
              this.channels = channels;

              // Fetch members for the group
              this.userService.getByIdsList(group.memberIds || []).subscribe({
                next: (members) => {
                  this.members = members;
                  this.loading = false;
                },
                error: () => {
                  this.loading = false;
                }
              });
            },
            error: () => {
              this.loading = false;
            }
          });
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  goBack(): void {
    this.location.back();
  }
}
