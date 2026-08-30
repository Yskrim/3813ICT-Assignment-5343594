import { Component, OnInit } from '@angular/core';
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
  user?: User;

  // copies before setting up the values
  displayName = '';
  username = '';
  password = '';
  avatarUrl = '';
  dateOfBirth = '';

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private router: Router,
  ) { }

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
    this.password = this.user.password;
    this.avatarUrl = this.user.avatarUrl ?? '';
    this.dateOfBirth = this.formatDate(this.user.dateOfBirth);
  }

  private formatDate(d: Date | string): string {
    const date = d instanceof Date ? d : new Date(d);
    return date.toISOString().slice(0, 10); // yyyy-mm-dd
  }

  saveDisplayName(): void {
    if (!this.user) return;
    this.user = this.userService.updateUser(this.user.id, { displayName: this.displayName });
    this.auth.currentUser.set(this.user!);
  }

  saveUsername(): void {
    if (!this.user) return;
    this.user = this.userService.updateUser(this.user.id, { username: this.username });
    this.auth.currentUser.set(this.user!);
  }

  savePassword(): void {
    if (!this.user) return;
    this.user = this.userService.updateUser(this.user.id, { password: this.password });
    this.auth.currentUser.set(this.user!);
  }

  saveAvatar(): void {
    if (!this.user) return;
    this.user = this.userService.updateUser(this.user.id, { avatarUrl: this.avatarUrl });
    this.auth.currentUser.set(this.user!);
  }

  saveDateOfBirth(): void {
    if (!this.user) return;
    this.user = this.userService.updateUser(this.user.id, {
      dateOfBirth: new Date(this.dateOfBirth),
    });
    this.auth.currentUser.set(this.user!);
  }

  deleteAccount(): void {
    if (!this.user) return;

    // Phase 1: простая проверка роли (superAdmin не удаляет себя)
    if (this.user.role === 'superAdmin') {
      alert('SuperAdmin cannot delete account');
      return;
    }
    this.userService.deleteUser(this.user.id);
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}