import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { User, AdminRequest, Group, Channel } from './models'
import { AuthService } from './services/auth.service';


@Component({
  imports: [ RouterLink, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})

export class App implements OnInit{
  protected readonly title = signal('project');

  user: User | null = null;

  constructor(
    protected auth: AuthService,
    private router: Router,

  ) {}

  ngOnInit(): void {
    const currentUser = this.auth.currentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }
  }
}
