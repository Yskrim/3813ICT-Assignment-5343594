import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Channel } from './pages/channel/channel';
import { Login } from './pages/login/login';
import { Group } from './pages/group/group';
import { ChannelInfo } from './pages/channel-info/channel-info';
import { GroupInfo } from './pages/group-info/group-info';
import { UserProfile } from './pages/user-profile/user-profile';
import { UserProfileSettings } from './pages/user-profile-settings/user-profile-settings';
import { AdminPanel } from './pages/admin-panel/admin-panel';

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
