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
    this.auth.currentUser.set(user); // pass to auth
    localStorage.setItem('currentUser', JSON.stringify(user)); // save to storage
    this.loadFormFromUser();
  }

  saveDisplayName(): void {
    if (!this.user) return;
    this.userService
      .updateUser(this.user.id, { displayName: this.displayName })
      .subscribe((user) => this.applyUpdatedUser(user)); // sub for possible new changes
  }

  saveUsername(): void {
    if (!this.user) return;
    this.userService
      .updateUser(this.user.id, { username: this.username })
      .subscribe((user) => this.applyUpdatedUser(user)); // sub for possible new changes
  }

  savePassword(): void {
    if (!this.user) return;
    this.userService
      .updateUser(this.user.id, { password: this.password })
      .subscribe((user) => this.applyUpdatedUser(user)); // sub for possible new changes
  }

  saveAvatar(): void {
    if (!this.user) return;
    this.userService
      .updateUser(this.user.id, { avatarUrl: this.avatarUrl })
      .subscribe((user) => this.applyUpdatedUser(user)); // sub for possible new changes
  }

  saveDateOfBirth(): void {
    if (!this.user) return;
    this.userService
      .updateUser(this.user.id, { dateOfBirth: this.dateOfBirth })
      .subscribe((user) => this.applyUpdatedUser(user)); // sub for possible new changes
  }

  deleteAccount(): void {
    if (!this.user) return;

    // Phase 1: простая проверка роли (superAdmin не удаляет себя)
    if (this.user.role === 'superAdmin') {
      alert('SuperAdmin cannot delete account');
      return;
    }

    this.userService.deleteUser(this.user.id).subscribe((deleted) => {
      if (!deleted) return; // cancel deletion
      this.auth.logout();
      this.router.navigate(['/login']);
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
