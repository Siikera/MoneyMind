import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PessoaService, PessoaDTO } from '../../core/pessoa.service';
import { NgIf, CommonModule } from '@angular/common';

@Component({
  selector: 'app-pessoa-cadastro',
  standalone: true,
  imports: [FormsModule, NgIf, CommonModule],
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent {
  pessoaEditando: PessoaDTO | null = null;
  editarPessoa(pessoa: PessoaDTO) {
    this.pessoaEditando = { ...pessoa };
    this.razaoSocial = pessoa.razaoSocial;
  }

    salvarAlteracao(pessoa: PessoaDTO) {
      if (!this.razaoSocial.trim()) {
        this.error = 'Razão Social é obrigatória.';
        return;
      }
      this.loading = true;
      this.pessoaService.updatePessoa(pessoa.idPessoa!, { razaoSocial: this.razaoSocial }).subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
          this.pessoaEditando = null;
          this.razaoSocial = '';
          this.listarPessoas();
          this.cdr.detectChanges();
          setTimeout(() => {
            this.success = false;
            this.cdr.detectChanges();
          }, 2000);
        },
        error: (err: any) => {
          this.error = err?.error?.message || err?.error || 'Erro ao alterar pessoa.';
          this.loading = false;
        }
      });
    }

    cancelarEdicao() {
      this.pessoaEditando = null;
      this.razaoSocial = '';
      this.error = '';
    }

  excluirPessoa(id: number) {
    if (confirm('Tem certeza que deseja excluir esta razão social?')) {
      this.pessoaService.deletePessoa(id).subscribe({
        next: () => {
          this.listarPessoas();
        },
        error: () => {
          alert('Erro ao excluir razão social.');
        }
      });
    }
  }

  cadastrarPessoa(pessoa: PessoaDTO) {
    // Aqui você pode redirecionar para uma tela de cadastro de pessoa ou abrir um modal
    alert('Funcionalidade de cadastro de pessoa para: ' + pessoa.razaoSocial);
  }
  razaoSocial = '';
  error = '';
  success = false;
  loading = false;
  pessoas: PessoaDTO[] = [];
  mostrarLista = false;

  constructor(private pessoaService: PessoaService, private cdr: ChangeDetectorRef) {
    this.listarPessoas();
  }

  toggleLista() {
    this.mostrarLista = !this.mostrarLista;
  }

  listarPessoas() {
    this.pessoaService.getPessoas().subscribe({
      next: (data: any) => {
        console.log('Dados recebidos do backend:', data);
        this.pessoas = [...data];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erro ao buscar pessoas:', err);
        this.pessoas = [];
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
    if (this.pessoaEditando && this.pessoaEditando.idPessoa) {
      // Alteração
      this.pessoaService.updatePessoa(this.pessoaEditando.idPessoa, { razaoSocial: this.razaoSocial }).subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
          this.razaoSocial = '';
          this.pessoaEditando = null;
          this.listarPessoas();
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
          this.error = err?.error?.message || err?.error || 'Erro ao alterar pessoa.';
          this.loading = false;
        }
      });
    } else {
      // Cadastro
      this.pessoaService.createPessoa({ razaoSocial: this.razaoSocial }).subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
          this.razaoSocial = '';
          this.listarPessoas();
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
        error: (err: any) => {
          // Trata diferentes formatos de erro do backend
          if (typeof err?.error === 'string' && err.error.includes('Razão Social já cadastrado')) {
            this.error = err.error;
          } else if (err?.error?.message && err.error.message.includes('Razão Social já cadastrado')) {
            this.error = err.error.message;
          } else if (err?.status === 409) {
            this.error = 'Razão Social já cadastrada.';
          } else {
            this.error = err?.error?.message || err?.error || 'Erro ao cadastrar pessoa.';
          }
          this.loading = false;
        }
      });
    }
  }
}
