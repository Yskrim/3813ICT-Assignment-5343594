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

		const ok = this.auth.login(this.username, this.password);

		if (!ok) {
			alert('Invalid creds')
			this.form.reset();
			return
		}


		this.router.navigate(['/home']);
	}
}