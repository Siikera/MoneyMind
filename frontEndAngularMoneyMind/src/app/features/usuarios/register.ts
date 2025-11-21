import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService, UsuarioDTO } from '../../core/user.service';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  nomeUsuario = '';
  emailUsuario = '';
  senhaUsuario = '';
  dataNascimento = '';
  error = '';
  loading = false;
  success = false;

  constructor(public router: Router, private userService: UserService, public auth: AuthService) {}
  isLoggedIn(): boolean {
    return !!this.auth.getToken();
  }

  onSubmit() {
    this.error = '';
    this.success = false;

    // Validações de frontend
    if (!this.nomeUsuario || !this.nomeUsuario.trim()) {
      this.error = 'Informe o nome.';
      return;
    }
    if (!this.emailUsuario || !this.emailUsuario.includes('@')) {
      this.error = 'Informe um e-mail válido.';
      return;
    }
    if (!this.dataNascimento) {
      this.error = 'Informe a data de nascimento.';
      return;
    }
    if (!this.senhaUsuario || this.senhaUsuario.length < 8) {
      this.error = 'A senha deve ter pelo menos 8 caracteres.';
      return;
    }

    this.loading = true;
    // Converter dataNascimento para dd/MM/yyyy
    let dataFormatada = '';
    if (this.dataNascimento) {
      const [yyyy, mm, dd] = this.dataNascimento.split('-');
      dataFormatada = `${dd}/${mm}/${yyyy}`;
    }
    const usuario: any = {
      nomeUsuario: this.nomeUsuario,
      emailUsuario: this.emailUsuario,
      senhaUsuario: this.senhaUsuario,
      dataNascimento: dataFormatada
    };
    this.userService.register(usuario).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = true;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        if (err?.error && typeof err.error === 'string') {
          // Respostas de texto simples
          this.error = err.error;
        } else if (err?.error?.message) {
          // Erros de regra de negócio (ex.: e-mail já cadastrado)
          this.error = err.error.message;
        } else if (Array.isArray(err?.error?.errors) && err.error.errors.length > 0) {
          // Erros de validação de campos do backend (ValidationError)
          this.error = err.error.errors[0].menssage || 'Verifique os dados informados.';
        } else if (err?.status === 0) {
          this.error = 'Não foi possível conectar ao servidor.';
        } else {
          this.error = 'Erro ao registrar usuário.';
        }
      }
    });
  }
}