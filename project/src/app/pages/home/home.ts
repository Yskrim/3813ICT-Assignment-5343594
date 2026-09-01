import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Group, Channel, User } from '../../models';
import { GroupService } from '../../services/group.service';
import { ChannelService } from '../../services/channel.service';
import { AuthService } from '../../services/auth.service';

@Component({
    imports: [RouterLink],
    selector: 'app-home',
    styleUrl: './home.css',
    templateUrl: './home.html',
})

export class HomePage implements OnInit {
    groups = signal<Group[]>([]);
    channelsByGroup = signal<Record<string, Channel[]>>({});

    constructor(
        private groupService: GroupService,
        private channelService: ChannelService,
        private auth: AuthService,
    ) { }

    ngOnInit(): void {
        const user = this.auth.currentUser()!;

        // get groups
        this.groupService.getGroupsForUser(user.id).subscribe(groups => {
            this.groups.set(groups);
            console.log('groups length:', groups.length);
            // For each group, fetch its channels and put in the map
            this.channelsByGroup.set({});

            groups.forEach(group => {
                this.channelService.getByGroupId(user.id, group.id).subscribe((channels: Channel[]) => {
                    this.channelsByGroup.update(current => ({
                        ...current,
                        [group.id]: channels,
                    }));
                });
            });
        });

        console.log("groups:", this.groups);
        console.log("channels:", this.channelsByGroup);
    }
}
