import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { User } from '../../models';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { UtilsService } from '../../services/utils.service';


@Component({
  imports: [RouterLink],
  selector: 'app-user-profile',
  styleUrl: './user-profile.css',
  templateUrl: './user-profile.html',
})

export class UserProfile implements OnInit {

  user: User | undefined;

  displayName = '';
  username = '';
  avatarUrl = '';
  bio = '';
  dateOfBirth = '';
  age= '';

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private utils: UtilsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const current = this.auth.currentUser()
    if (!current) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = { ...current }
    this.loadFormFromUser();
    this.age = this.userService.calculateAge(this.user.dateOfBirth);
  }

  private loadFormFromUser(): void {
    if (!this.user) return;

    this.displayName = this.user.displayName;
    this.username = this.user.username;
    this.avatarUrl = this.user.avatarUrl || "https://placehold.co/200x200";
    this.bio = 'Nulla est ullamco ut irure incididunt nulla Lorem Lorem minim irure officia enim reprehenderit.'
    this.dateOfBirth = this.utils.formatDate(this.user.dateOfBirth);
  }

}


