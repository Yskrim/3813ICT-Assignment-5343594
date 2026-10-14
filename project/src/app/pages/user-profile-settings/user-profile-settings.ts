import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

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
	user?: User;

	// copies before setting up the values
	displayName = '';
	username = '';
	password = '';
	avatarUrl = '';
	dateOfBirth = '';

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
		this.dateOfBirth = this.formatDate(this.user.dateOfBirth);
	}

	private formatDate(d: Date | string): string {
		const date = d instanceof Date ? d : new Date(d);
		return date.toISOString().slice(0, 10);
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

	saveUsername(): void {
		if (!this.user) return;
		this.userService.update(this.user.id, { username: this.username }).subscribe((user) => this.applyUpdatedUser(user));
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

	deleteAccount(): void {
		if (!this.user) return;

		if (this.user.role === 'superAdmin') {
			alert('SuperAdmin cannot delete account');
			return;
		}

		this.userService.delete(this.user.id).subscribe({
			next: () => {
				this.auth.logout();
				this.router.navigate(['/login']);
			},
			error: () => alert('Could not delete account'),
		});
	}

	logout(): void {
		this.auth.logout();
		this.router.navigate(['/login']);
	}
}
