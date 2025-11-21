import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInfoService } from '../../core/user-info.service';
import { ContaService, ContaDTO } from '../../core/conta.service';
import { SelectedContaService } from '../../core/selected-conta.service';
import { BancoService, BancoDTO } from '../bancos/banco.service';

// Enum TipoConta para o frontend (deve coincidir com o backend)
export interface TipoContaOption {
  id: number;
  descricao: string;
}

@Component({
  selector: 'app-selecionar-conta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-selection.component.html',
  styleUrls: ['./account-selection.component.css']
})
export class AccountSelectionComponent implements OnInit {
  contas: ContaDTO[] = [];
  bancos: BancoDTO[] = [];
  loading = false;
  error = '';
  
  // Opções de TipoConta (deve coincidir com enum do backend)
  tiposContaOpcoes: TipoContaOption[] = [
    { id: 1, descricao: 'Conta Corrente' },
    { id: 2, descricao: 'Conta Investimento' },
    { id: 3, descricao: 'Cartão de Crédito' },
    { id: 4, descricao: 'Ticket de Alimentação' },
    { id: 5, descricao: 'Poupança' }
  ];

  // campos para criar conta
  descricao = '';
  tipoConta = 1; // padrão: Conta Corrente
  agencia = '';
  numero = '';
  saldo: number = 0;
  limite: number = 0;
  bancoId: number | null = null;
  usuarioId: number | null = null;

  constructor(
    private userInfo: UserInfoService,
    private contaService: ContaService,
    private bancoService: BancoService,
    private selected: SelectedContaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBancos();
    this.loadUsuarioEContas();
  }

  private loadBancos() {
    this.bancoService.getBancos().subscribe({
      next: (bancos) => {
        this.bancos = bancos;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar bancos', err);
      }
    });
  }

  private loadUsuarioEContas() {
    this.loading = true;
    this.userInfo.getMe().subscribe({
      next: (me) => {
        const idUsuario = (me as any)?.idUsuario;
        if (!idUsuario) {
          this.error = 'Usuário não identificado.';
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }
        this.usuarioId = idUsuario;
        
        this.contaService.getContasByUsuario(idUsuario).subscribe({
          next: (contas) => {
            this.contas = contas;
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Erro ao carregar contas', err);
            this.error = 'Erro ao carregar contas.';
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: () => {
        this.error = 'Erro ao identificar usuário.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  selecionarConta(id: number | undefined) {
    if (id == null) {
      this.error = 'ID da conta inválido.';
      return;
    }
    this.selected.setSelectedContaId(id);
    this.router.navigate(['/dashboard']);
  }

  criarConta() {
    this.error = '';
    
    // Validações
    if (!this.descricao || !this.descricao.trim()) {
      this.error = 'Descrição é obrigatória.';
      return;
    }
    if (!this.agencia || !this.agencia.trim()) {
      this.error = 'Agência é obrigatória.';
      return;
    }
    if (!this.numero || !this.numero.trim()) {
      this.error = 'Número da conta é obrigatório.';
      return;
    }
    if (this.saldo == null) {
      this.error = 'Saldo é obrigatório.';
      return;
    }
    if (this.limite == null) {
      this.error = 'Limite é obrigatório.';
      return;
    }
    if (!this.bancoId) {
      this.error = 'Selecione um banco.';
      return;
    }
    if (!this.usuarioId) {
      this.error = 'Usuário não identificado. Faça login novamente.';
      return;
    }
    
    // Monta DTO conforme esperado pelo backend
    const dto: any = {
      descricao: this.descricao,
      tipoConta: this.tipoConta,
      agencia: this.agencia,
      numero: this.numero,
      saldo: this.saldo,
      limite: this.limite,
      banco: this.bancoId,      // Backend espera "banco" (minúsculo) via getter/setter
      usuario: this.usuarioId   // Backend espera "usuario" (minúsculo) via getter/setter
    };
    
    console.log('Criando conta com DTO:', dto);
    
    this.contaService.createConta(dto).subscribe({
      next: () => {
        // Limpa formulário
        this.descricao = '';
        this.tipoConta = 1;
        this.agencia = '';
        this.numero = '';
        this.saldo = 0;
        this.limite = 0;
        this.bancoId = null;
        this.error = '';
        
        // Recarrega lista
        this.loadUsuarioEContas();
      },
      error: (err) => {
        console.error('Erro ao criar conta', err);
        this.error = err?.error?.message || err?.error || 'Erro ao criar conta.';
        this.cdr.detectChanges();
      }
    });
  }
}
