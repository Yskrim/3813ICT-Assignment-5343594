import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Group, Channel } from '../../models';
import { GroupService } from '../../services/group.service';
import { ChannelService } from '../../services/channel.service';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [RouterLink],
  selector: 'app-group',
  styleUrl: './group.css',
  templateUrl: './group.html',
})
export class GroupPage implements OnInit {
  gId = '';
  group = signal<Group | undefined>(undefined);
  channels = signal<Channel[]>([]);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private channelService: ChannelService,
    private auth: AuthService,
    private location: Location,
  ) {}

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.gId = this.route.snapshot.paramMap.get('gId')!;
    const user = this.auth.currentUser()!;

    forkJoin([
      this.groupService.getByGroupId(user.id, this.gId),
      this.channelService.getByGroupId(user.id, this.gId),
    ]).subscribe({
      next: ([group, channels]) => {
        this.group.set(group);
        this.channels.set(channels ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.group.set(undefined);
        this.channels.set([]);
        this.loading.set(false);
      },
    });
  }
}