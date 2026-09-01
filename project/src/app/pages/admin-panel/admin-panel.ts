import { NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

import { User, AdminRequest, Group, Channel } from '../../models';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ChannelService } from '../../services/channel.service';
import { GroupService } from '../../services/group.service';
import { AdminRequestService } from '../../services/admin-request.service';
import { UtilsService } from '../../services/utils.service';
import { GROUPS } from '../../data/seed.groups';

@Component({
  imports: [RouterLink, NgTemplateOutlet],
  selector: 'app-admin-panel',
  styleUrl: './admin-panel.css',
  templateUrl: './admin-panel.html',
})


export class AdminPanelPage implements OnInit {
  user: User | undefined;
  requests: { groupRequests: AdminRequest[], superRequests: AdminRequest[] } = {
    groupRequests: [],
    superRequests: []
  };
  groups: Group[] = [];
  channelsByGroup = new Map<string, Channel[]>();

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private groupService: GroupService,
    private channelService: ChannelService,
    private adminRequestService: AdminRequestService,
    private utilsService: UtilsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // get user
    const currentUser = this.auth.currentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // get requests
    if (currentUser.role === 'user') {
      this.router.navigate(['/home']);
      return;
    }

    this.user = currentUser;
    this.loadViewData();
    console.log(this.user)
    console.log(this.requests)
    console.log(this.groups)
  }

  loadViewData(): void {
    if (!this.user) return;

    //get requests
    this.requests = this.adminRequestService.getPanelView(this.user);

    //get groups
    const managedGroups = GROUPS.filter(g => g.adminIds.includes(this.user!.id));
    if (this.user.role === "groupAdmin") { this.groups = managedGroups } else { this.groups = GROUPS }

    // channels ? super cant access messages on the chats
    // this.channels = this.groups.flatMap(g => this.channelService.getByGroupId(g.id)); for the groups he's a reg admin still -- TODO
  }

  issuerName(id: string) {
    return this.userService.getByUserId(id)?.username ?? id;
  }

  issuerRole(id: string) {
    return this.userService.getByUserId(id)?.role ?? 'user-role-unknown';
  }

  groupName(id?: string): string {
    if (!id) return 'group-name-unknown';
    return this.groupService.getByGroupId(id)?.name ?? id;
  }

  channelName(id?: string): string {
    if (!id) return 'channel-name-unknown';
    return this.channelService.getByChannelId(id)?.name ?? id;
  }

  approve(req: AdminRequest): void {
    if (!this.user) return;
    this.adminRequestService.updateReqStatus(this.user.id, req.id, 'approved');
    this.loadViewData();
  }

  reject(req: AdminRequest): void {
    if (!this.user) return;
    this.adminRequestService.updateReqStatus(this.user.id, req.id, 'rejected');
    this.loadViewData();

  }

  formatDate(d: Date): string {
    return this.utilsService.formatDate(d);
  }
}
