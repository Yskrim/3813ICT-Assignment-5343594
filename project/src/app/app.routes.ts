import { Routes } from '@angular/router';
import { Home } from '../components/home/home';
import { Channel } from '../components/channel/channel';
import { Login } from '../components/login/login';
import { Group } from '../components/group/group';
import { ChannelInfo } from '../components/channel-info/channel-info';
import { GroupInfo } from '../components/group-info/group-info';
import { UserProfile } from '../components/user-profile/user-profile';
import { UserProfileSettings } from '../components/user-profile-settings/user-profile-settings';
import { AdminPanel } from '../components/admin-panel/admin-panel';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'channel', component: Channel },
    { path: 'channel-info', component: ChannelInfo },
    { path: 'group', component: Group },
    { path: 'group-info', component: GroupInfo },
    { path: 'user-profile', component: UserProfile },
    { path: 'user-profile-settings', component: UserProfileSettings },
    { path: 'login', component: Login },
    { path: 'admin-panel', component: AdminPanel },

];
