import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { SelectedContaService } from '../../core/selected-conta.service';

import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [NgIf, RouterLink, RouterLinkActive],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit, OnDestroy {
  collapsed = false;
  hasSelectedConta = false;
  private sub: Subscription | null = null;

  constructor(
    private router: Router,
    private auth: AuthService,
    private selectedConta: SelectedContaService
  ) {}

  ngOnInit(): void {
    this.hasSelectedConta = this.selectedConta.getSelectedContaId() != null;
    this.sub = this.selectedConta.selectedConta$().subscribe((id) => {
      this.hasSelectedConta = id != null;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggleMenu() {
    this.collapsed = !this.collapsed;
  }

  logout() {
    this.auth.logout();
    // limpa a conta selecionada ao deslogar
    try {
      this.selectedConta.setSelectedContaId(null);
    } catch (e) {
      // ignore
    }
    this.router.navigate(['/login']);
  }
}
