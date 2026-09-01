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

import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    
    // public
    { path: 'login', component: LoginPage, canActivate: [guestGuard] },
    
    // auth only
    { path: 'home', component: HomePage, canActivate: [authGuard] },
    { path: 'groups/:gId/channels/:cId', component: ChannelPage, canActivate: [authGuard] },
    { path: 'groups/:gId/channels/:cId/info', component: ChannelInfo, canActivate: [authGuard] },
    { path: 'groups/:gId', component: GroupPage, canActivate: [authGuard] },
    { path: 'groups/:gId/info', component: GroupInfo, canActivate: [authGuard] },
    { path: 'user-profile', component: UserProfile, canActivate: [authGuard] },
    { path: 'user-profile-settings', component: UserProfileSettings, canActivate: [authGuard] },
    
    // auth + role
    { path: 'admin-panel', component: AdminPanelPage, canActivate: [authGuard, roleGuard('groupAdmin', 'superAdmin')] },
];