import { booleanAttribute, Component, signal, OnInit, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { SideMenuComponent } from './shared/side-menu/side-menu.component';
import { AuthService } from './core/auth.service';
import { SelectedContaService } from './core/selected-conta.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, SideMenuComponent, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('frontEndAngular');
  protected isMenuOpen = booleanAttribute('false');
  protected isOpen = booleanAttribute('false');
  hasSelectedConta = false;
  private sub: Subscription | null = null;

  constructor(private auth: AuthService, private selectedConta: SelectedContaService) {}

  ngOnInit(): void {
    this.hasSelectedConta = this.selectedConta.getSelectedContaId() != null;
    this.sub = this.selectedConta.selectedConta$().subscribe((id) => {
      this.hasSelectedConta = id != null;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  isLoggedIn(): boolean {
    return !!this.auth.getToken();
  }
}
