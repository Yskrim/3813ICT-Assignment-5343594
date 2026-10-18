import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
	imports: [FormsModule],
	selector: 'app-login',
	styleUrl: './login.css',
	templateUrl: './login.html',
})
export class LoginPage {
	private auth = inject(AuthService);
	private router = inject(Router);

	// form fields (ngModel) ---
	username = '';
	displayName = '';
	password = '';

	// page state ---
	mode = signal<'login' | 'register'>('login');
	error = signal('');
	loading = signal(false);

	// switch login <-> register, clear old error
	toggleMode(): void {
		this.mode.set(this.mode() === 'login' ? 'register' : 'login');
		this.error.set('');
	}

	onSubmit(): void {
		this.error.set('');

		// client side validation, server checks same rules again
		if (!this.username.trim() || !this.password.trim()) {
			this.error.set('Username and password are required');
			return;
		}
		if (this.mode() === 'register' && !this.displayName.trim()) {
			this.error.set('Display name is required');
			return;
		}

		this.loading.set(true);
		const request$ =
			this.mode() === 'login'
				? this.auth.login(this.username.trim(), this.password)
				: this.auth.register(this.username.trim(), this.displayName.trim(), this.password);

		request$.subscribe({
			next: (user) => {
				this.loading.set(false);
				if (!user) {
					this.error.set('Invalid credentials');
					this.password = '';
					return;
				}
				this.router.navigate(['/home']);
			},
			// register errors: show server message (taken username, bad format)
			error: (err: HttpErrorResponse) => {
				this.loading.set(false);
				this.error.set(err.error?.error ?? 'Something went wrong. Try again.');
			},
		});
	}
}
