import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
	imports: [FormsModule],
	selector: 'app-login',
	styleUrl: './login.css',
	templateUrl: './login.html',
})

export class LoginPage {
	username = '';
	password = '';
	error = '';
	loading = false;

	form = new FormGroup({
		username: new FormControl('', Validators.required),
		password: new FormControl('', Validators.required)
	})

	constructor(
		private auth: AuthService,
		private router: Router,
	) { }

	onSubmit(): void {
		this.error = '';
		this.loading = true;

		this.auth.login(this.username, this.password).subscribe({
			next: (user) => {
				this.loading = false;
				if (!user) {
					this.error = 'Invalid credentials';
					this.form.reset();
					return;
				}
				this.router.navigate(['/home']);
			},
			error: () => {
				this.loading = false;
				this.error = 'Invalid credentials';
				this.form.reset();
			},
		});
	}
}