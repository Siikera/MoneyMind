import { Component, OnInit, OnDestroy } from '@angular/core';
import { Register } from '../usuarios/register';
import { UserInfoService, UsuarioInfo } from '../../core/user-info.service';
import { UserService, UsuarioDTO } from '../../core/user.service';
import { AuthService } from '../../core/auth.service';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Register, NgIf, NgFor, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit, OnDestroy {
  saldo = 0;
  contas = [];
  lancamentos = [];
  usuario: UsuarioInfo | undefined;
  usuarioLoading = false;
  usuarioError = '';
  showUser = false;
  editMode = false;
  editUsuario: UsuarioInfo | undefined;
  editSenha: string = '';
  editError = '';
  userServiceUpdateLoading = false;
  updateSuccess = false;
  private routerSub?: Subscription;

  constructor(
    private userInfo: UserInfoService,
    private userService: UserService,
    private auth: AuthService,
    private router: Router
  ) {}
  onShowUser() {
    this.showUser = !this.showUser; 
    this.editMode = false;
    this.editError = "";
   if (this.showUser) {
      this.loadUser();
    }
  }

  onEditUser() {
    if (this.usuario) {
      this.editUsuario = { ...this.usuario };
      this.editSenha = '';
      this.editMode = true;
      this.editError = '';
    }
  }

  onCancelEdit() {
    this.editMode = false;
    this.editError = '';
  }

  onSaveEdit() {
    if (!this.editUsuario) return;
    if (!this.editSenha) {
      this.editError = 'Informe sua senha para confirmar a alteração.';
      return;
    }
    let dataFormatada = this.editUsuario.dataNascimento;
    if (dataFormatada && dataFormatada.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [yyyy, mm, dd] = dataFormatada.split('-');
      dataFormatada = `${dd}/${mm}/${yyyy}`;
    }
    const dto: any = {
      idUsuario: this.editUsuario.idUsuario,
      nomeUsuario: this.editUsuario.nomeUsuario,
      emailUsuario: this.editUsuario.emailUsuario,
      dataNascimento: dataFormatada,
      senhaUsuario: this.editSenha
    };
    this.userServiceUpdate(dto);
  this.updateSuccess = false;
  }

  private userServiceUpdate(dto: any) {
    if (!dto.idUsuario) return;
    this.userServiceUpdateLoading = true;
    this.userService.update(dto.idUsuario, dto).subscribe({
      next: (_res: any) => {
        this.editMode = false;
        this.editError = '';
        this.updateSuccess = true;
        this.loadUser();
        this.userServiceUpdateLoading = false;
        setTimeout(() => { this.updateSuccess = false; }, 2000);
      },
      error: (err: any) => {
        this.editError = 'Erro ao atualizar usuário.';
        this.updateSuccess = false;
        this.userServiceUpdateLoading = false;
      }
    });
  }

  onDeleteUser() {
    if (!this.usuario?.idUsuario) return;
    if (!confirm('Tem certeza que deseja excluir sua conta?')) return;
    this.userService.delete(this.usuario.idUsuario).subscribe({
      next: () => {
        this.logout();
      },
      error: (_err: any) => {
        this.usuarioError = 'Erro ao excluir usuário.';
      }
    });
  }

  logout() {
    this.auth.logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  ngOnInit() {
    this.loadUser();
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.router.url.startsWith('/dashboard')) {
        this.loadUser();
      }
    });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  private loadUser() {
    this.userInfo.getMe().subscribe({
      next: (user) => {
        this.usuario = user;
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.logout();
        } else {
          this.usuarioError = 'Erro ao carregar dados do usuário.';
          console.error('[DEBUG] Erro ao buscar usuário:', err);
        }
      }
    });
  }
}
