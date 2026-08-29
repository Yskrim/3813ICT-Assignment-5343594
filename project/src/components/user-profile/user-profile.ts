import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterLink, RouterOutlet],
  selector: 'app-user-profile',
  styleUrl: './user-profile.css',
  templateUrl: './user-profile.html',
})
export class UserProfile {}


