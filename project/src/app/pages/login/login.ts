import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

	constructor(
		private auth: AuthService,
		private router: Router,
	) { }
	
	onSubmit(): void {
		this.error = '';
		const ok = this.auth.login();
		
		// if (!ok) {
		// 	this.error = 'Invalid username or password';
		// 	return;
		// }
		this.router.navigate(['/home']);
	}
}