import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { NgIf } from '@angular/common';

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

  constructor(public router: Router, private auth: AuthService) {}

  onSubmit() {
    this.error = '';
    if (!this.login.includes('@')) {
    this.error = 'Digite um e-mail válido.';
    return;
  }
    this.loading = true;
    this.auth.login(this.login, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        if (err?.error && typeof err.error === 'string') {
          this.error = err.error;
        } else if (err?.status === 0) {
          this.error = 'Não foi possível conectar ao servidor.';
        } else {
          this.error = 'Usuário ou senha inválidos.';
        }
      }
    });
  }
}