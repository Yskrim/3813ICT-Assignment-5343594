import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink} from '@angular/router';
import { Group, Channel } from '../../models'
import { GroupService } from '../../services/group.service';
import { ChannelService } from '../../services/channel.service';
import { Location } from '@angular/common';

@Component({
  imports: [RouterLink],
  selector: 'app-group',
  styleUrl: './group.css',
  templateUrl: './group.html',
})

export class GroupPage implements OnInit {
  gId = '';
  group: Group | undefined;
  channels: Channel[] = [];

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private channelService: ChannelService,
    private location: Location,
  ) { }

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.gId = this.route.snapshot.paramMap.get('gId')!;
    this.group = this.groupService.getByGroupId(this.gId);
    this.channels = this.channelService.getByGroupId(this.gId);
    console.log('gId:', this.gId, 'channels:', this.channels);
  }
}










