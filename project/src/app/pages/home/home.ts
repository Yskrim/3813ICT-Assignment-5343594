import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Group, Channel } from '../../models';
import { GroupService } from '../../services/group.service';
import { ChannelService } from '../../services/channel.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    imports: [RouterLink],
    selector: 'app-home',
    styleUrl: './home.css',
    templateUrl: './home.html',
})

export class HomePage implements OnInit {
    groups: Group[] = [];

    channelsByGroup = new Map<string, Channel[]>();
    // mapStructure = [ 
    //  { groupId : ch1 }, 
    //  { groupId : ch2 }, 
    //  { groupId : ch3 } 
    //]

    // temporarily, while no AuthService,
    private readonly testUserId = '1';
    private readonly testGroupIds = ['1', '2', '3', '4']; // после фикса seed возьмёшь из user

    constructor(
        private groupService: GroupService,
        private channelService: ChannelService,
        private auth: AuthService,
		private router: Router,
    ) { }

    // run services on init
    ngOnInit(): void {
        const current = this.auth.currentUser();
		if (!current) {
			this.router.navigate(['/login']);
			return;
		}

        // get user groups
        this.groups = this.groupService.getGroupsForUser(current.id, current.groupIds);
        
        // get each channel for each group
        for (const group of this.groups) {
            this.channelsByGroup.set(
                group.id,
                this.channelService.getByGroupId(group.id),
            );
        }
    }
}

