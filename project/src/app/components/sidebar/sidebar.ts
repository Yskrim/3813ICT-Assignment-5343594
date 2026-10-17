import { Component, inject, input, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { GroupService } from '../../services/group.service';
import { ChannelService } from '../../services/channel.service';
import { AuthService } from '../../services/auth.service';
import { Channel, Group } from '../../models';
import { RouterLink } from '@angular/router';

@Component({
	imports: [RouterLink],
	selector: 'app-sidebar',
	styleUrl: './sidebar.css',
	templateUrl: './sidebar.html',
})
export class Sidebar {
	private auth = inject(AuthService);


    user = this.auth.currentUser;
	groups = input.required<Group[]>();
	channelsByGroup = input.required<Record<string, Channel[]>>();
}
