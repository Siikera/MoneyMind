import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [NgIf, RouterLink, RouterLinkActive],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent {
  collapsed = false;

  constructor(private router: Router, private auth: AuthService) {}

  toggleMenu() {
    this.collapsed = !this.collapsed;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
