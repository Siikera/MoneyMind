import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BancoService, BancoDTO } from './banco.service';
import { NgIf, CommonModule } from '@angular/common';

@Component({
  selector: 'app-banco-cadastro',
  standalone: true,
  imports: [FormsModule, NgIf, CommonModule],
  templateUrl: './banco.html',
  styleUrls: ['./banco.css']
})
export class BancoCadastroComponent {
  bancoEditando: BancoDTO | null = null;
  editarBanco(banco: BancoDTO) {
    this.bancoEditando = { ...banco };
    this.razaoSocial = banco.razaoSocial;
  }

    salvarAlteracao(banco: BancoDTO) {
      if (!this.razaoSocial.trim()) {
        this.error = 'Razão Social é obrigatória.';
        return;
      }
      this.loading = true;
      this.bancoService.updatBanco(banco.idBanco!, { razaoSocial: this.razaoSocial }).subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
          this.bancoEditando = null;
          this.razaoSocial = '';
          this.listarBancos();
          this.cdr.detectChanges();
          setTimeout(() => {
            this.success = false;
            this.cdr.detectChanges();
          }, 2000);
        },
        error: (err: any) => {
          this.error = err?.error?.message || err?.error || 'Erro ao alterar banco.';
          this.loading = false;
        }
      });
    }

    cancelarEdicao() {
      this.bancoEditando = null;
      this.razaoSocial = '';
      this.error = '';
    }

  excluirBanco(id: number) {
    if (confirm('Tem certeza que deseja excluir esta razão social?')) {
      this.bancoService.excluirBanco(id).subscribe({
        next: () => {
          this.listarBancos();
        },
        error: () => {
          alert('Erro ao excluir razão social.');
        }
      });
    }
  }

  cadastrarBanco(banco: BancoDTO) {
    // Aqui você pode redirecionar para uma tela de cadastro de pessoa ou abrir um modal
    alert('Funcionalidade de cadastro de banco para: ' + banco.razaoSocial);
  }
  razaoSocial = '';
  error = '';
  success = false;
  loading = false;
  bancos: BancoDTO[] = [];
  mostrarLista = false;

  constructor(private bancoService: BancoService, private cdr: ChangeDetectorRef) {
    this.listarBancos();
  }

  toggleLista() {
    this.mostrarLista = !this.mostrarLista;
  }

  listarBancos() {
    this.bancoService.getBancos().subscribe({
      next: (data) => {
        console.log('Dados recebidos do backend:', data);
        this.bancos = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar bancos:', err);
        this.bancos = [];
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit() {
    this.error = '';
    this.success = false;
    if (!this.razaoSocial.trim()) {
      this.error = 'Razão Social é obrigatória.';
      return;
    }
    this.loading = true;
    if (this.bancoEditando && this.bancoEditando.idBanco) {
      // Alteração
      this.bancoService.updatBanco(this.bancoEditando.idBanco, { razaoSocial: this.razaoSocial }).subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
          this.razaoSocial = '';
          this.bancoEditando = null;
          this.listarBancos();
          this.cdr.detectChanges();
          setTimeout(() => {
            const input = document.getElementById('razaoSocial') as HTMLInputElement;
            if (input) {
              input.value = '';
              input.focus();
            }
          }, 0);
          setTimeout(() => {
            this.success = false;
            this.cdr.detectChanges();
          }, 2500);
        },
  error: (err: any) => {
          this.error = err?.error?.message || err?.error || 'Erro ao alterar banco.';
          this.loading = false;
        }
      });
    } else {
      // Cadastro
      this.bancoService.createBanco({ razaoSocial: this.razaoSocial }).subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
          this.razaoSocial = '';
          this.listarBancos();
          this.cdr.detectChanges();
          setTimeout(() => {
            const input = document.getElementById('razaoSocial') as HTMLInputElement;
            if (input) {
              input.value = '';
              input.focus();
            }
          }, 0);
          setTimeout(() => {
            this.success = false;
            this.cdr.detectChanges();
          }, 2500); // mensagem some após 2,5 segundos
        },
        error: (err) => {
          // Trata diferentes formatos de erro do backend
          if (typeof err?.error === 'string' && err.error.includes('Razão Social já cadastrado')) {
            this.error = err.error;
          } else if (err?.error?.message && err.error.message.includes('Razão Social já cadastrado')) {
            this.error = err.error.message;
          } else if (err?.status === 409) {
            this.error = 'Razão Social já cadastrada.';
          } else {
            this.error = err?.error?.message || err?.error || 'Erro ao cadastrar Banco.';
          }
          this.loading = false;
        }
      });
    }
  }
}
