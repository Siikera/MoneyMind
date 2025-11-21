import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { SelectedContaService } from '../../core/selected-conta.service';
import { NgIf } from '@angular/common';
import { TimeoutError } from 'rxjs';
import { finalize, take, timeout } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  login = '';
  password = '';
  error = '';
  loading = false;
  showError = false;

  constructor(
    public router: Router,
    private auth: AuthService,
    private selected: SelectedContaService,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit() {
    this.error = '';
    this.showError = false;
    if (!this.login.includes('@')) {
      this.error = 'Digite um e-mail válido.';
      this.showError = true;
      return;
    }

    this.loading = true;
    this.auth
      .login(this.login, this.password)
      .pipe(
        timeout(3000),
        take(1),
        finalize(() => {
          this.loading = false;
          try { this.cdr.detectChanges(); } catch {}
        })
      )
      .subscribe({
        next: () => {
          console.log('[Login] Sucesso no login');
          // Se já existe uma conta selecionada, vai direto ao dashboard; senão, vai para seleção
          const id = this.selected.getSelectedContaId();
          if (id) this.router.navigate(['/dashboard']);
          else this.router.navigate(['/selecionar-conta']);
        },
        error: (err) => {
          console.warn('[Login] Erro no login', err);
          // Segurança extra: garante que o loading pare mesmo antes do finalize
          this.loading = false;
          if (err instanceof TimeoutError || err?.name === 'TimeoutError') {
            this.error = 'Tempo esgotado. Tente novamente.';
            this.showError = true;
            const msg = this.error;
            setTimeout(() => { alert(msg); this.refreshLoginView(); }, 50);
          } else if (err?.status === 401) {
            this.error = (err?.error && typeof err.error === 'object' && err.error?.message)
              ? err.error.message
              : 'Conta não existe ou email/senha incorretos.';
            this.showError = true;
            const msg = this.error;
            setTimeout(() => { alert(msg); this.refreshLoginView(); }, 50);
          } else if (err?.error && typeof err.error === 'string') {
            this.error = err.error;
            this.showError = true;
            const msg = this.error;
            setTimeout(() => { alert(msg); this.refreshLoginView(); }, 50);
          } else if (err?.status === 0) {
            this.error = 'Não foi possível conectar ao servidor.';
            this.showError = true;
            const msg = this.error;
            setTimeout(() => { alert(msg); this.refreshLoginView(); }, 50);
          } else {
            this.error = 'Usuário ou senha inválidos.';
            this.showError = true;
            const msg = this.error;
            setTimeout(() => { alert(msg); this.refreshLoginView(); }, 50);
          }
          try { this.cdr.detectChanges(); } catch {}
        }
      });
  }

  private refreshLoginView() {
    // Recarrega a rota de login sem alterar o histórico
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/login']);
    });
  }
}