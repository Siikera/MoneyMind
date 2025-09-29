import { booleanAttribute, Component, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { SideMenuComponent } from './shared/side-menu/side-menu.component';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, SideMenuComponent, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontEndAngular');
  protected isMenuOpen = booleanAttribute('false');
  protected isOpen = booleanAttribute('false');

  constructor(private auth: AuthService) {}

  isLoggedIn(): boolean {
    return !!this.auth.getToken();
  }
}
