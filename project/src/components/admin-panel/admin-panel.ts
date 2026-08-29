import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';


@Component({
  imports: [RouterLink, RouterOutlet],
  selector: 'app-admin-panel',
  styleUrl: './admin-panel.css',
  templateUrl: './admin-panel.html',
})
export class AdminPanel {}
