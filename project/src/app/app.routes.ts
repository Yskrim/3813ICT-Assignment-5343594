import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home';
import { ChannelPage } from './pages/channel/channel';
import { LoginPage } from './pages/login/login';
import { ChannelInfo } from './pages/channel-info/channel-info';
import { GroupInfo } from './pages/group-info/group-info';
import { UserProfile } from './pages/user-profile/user-profile';
import { UserProfileSettings } from './pages/user-profile-settings/user-profile-settings';
import { AdminPanelPage } from './pages/admin-panel/admin-panel';
import { GroupPage } from './pages/group/group';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomePage },
    { path: 'groups/:gId/channels/:cId', component: ChannelPage },
    { path: 'groups/:gId/channels/:cId/info', component: ChannelInfo },
    { path: 'groups/:gId', component: GroupPage },
    { path: 'groups/:gId/info', component: GroupInfo },
    { path: 'user-profile', component: UserProfile },
    { path: 'user-profile-settings', component: UserProfileSettings },
    { path: 'login', component: LoginPage },
    { path: 'admin-panel', component: AdminPanelPage },
];
