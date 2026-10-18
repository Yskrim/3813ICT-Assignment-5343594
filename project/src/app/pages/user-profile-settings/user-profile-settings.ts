import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

import { UtilsService } from '../../services/utils.service';
import { AdminRequestService } from '../../services/admin-request.service';

@Component({
	imports: [FormsModule],
	selector: 'app-user-profile-settings',
	styleUrl: './user-profile-settings.css',
	templateUrl: './user-profile-settings.html',
})
export class UserProfileSettings implements OnInit {
	private auth = inject(AuthService);
	private userService = inject(UserService);
	private router = inject(Router);
	private utils = inject(UtilsService);
	private adminRequests = inject(AdminRequestService);
	user?: User;

	// copies before setting up the values
	displayName = '';
	username = '';
	password = '';
	avatarUrl = '';
	dateOfBirth = '';

	// delete request feedback
	deleteStatus = signal<'idle' | 'sent' | 'error'>('idle');

	constructor() {}

	ngOnInit(): void {
		const current = this.auth.currentUser();
		if (!current) {
			this.router.navigate(['/login']);
			return;
		}
		this.user = { ...current };
		this.loadFormFromUser();
	}

	private loadFormFromUser(): void {
		if (!this.user) return;
		this.displayName = this.user.displayName;
		this.username = this.user.username;
		this.password = this.user.password ?? ''; // if not empty
		this.avatarUrl = this.user.avatarUrl ?? ''; // if not empty
		this.dateOfBirth = this.utils.formatDate(this.user.dateOfBirth);
	}

	// apply saved changes
	private applyUpdatedUser(user: User | undefined): void {
		if (!user) return;

		this.user = user; // apply to current session
		this.auth.setUser(user); // pass to auth and storage
		this.loadFormFromUser();
	}

	saveDisplayName(): void {
		if (!this.user) return;
		this.userService.update(this.user.id, { displayName: this.displayName }).subscribe((user) => this.applyUpdatedUser(user));
	}

	savePassword(): void {
		if (!this.user) return;
		this.userService.update(this.user.id, { password: this.password }).subscribe((user) => this.applyUpdatedUser(user));
	}

	saveAvatar(): void {
		if (!this.user) return;
		this.userService.update(this.user.id, { avatarUrl: this.avatarUrl }).subscribe((user) => this.applyUpdatedUser(user));
	}

	saveDateOfBirth(): void {
		if (!this.user) return;
		this.userService.update(this.user.id, { dateOfBirth: this.dateOfBirth }).subscribe((user) => this.applyUpdatedUser(user));
	}

	// delete account -> request to superAdmin, not direct delete
	deleteAccount(): void {
		if (!this.user) return;

		if (this.user.role === 'superAdmin') {
			alert('SuperAdmin cannot delete account');
			return;
		}
		if (!confirm('Send account deletion request to super admin?')) return;

		this.adminRequests
			.create({
				type: 'deleteAccount',
				issuerId: this.user.id,
				targetUserId: this.user.id,
				note: 'user asked to delete own account',
			})
			.subscribe({
				next: () => this.deleteStatus.set('sent'),
				error: () => this.deleteStatus.set('error'),
			});
	}

	logout(): void {
		this.auth.logout();
		this.router.navigate(['/login']);
	}
}
