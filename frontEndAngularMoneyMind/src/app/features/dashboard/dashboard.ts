import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Register } from '../usuarios/register';
import { UserInfoService, UsuarioInfo } from '../../core/user-info.service';
import { UserService, UsuarioDTO } from '../../core/user.service';
import { AuthService } from '../../core/auth.service';
import { NgIf, NgFor, CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { FluxoFinanceiroService, FluxoFinanceiroDTO } from '../../core/fluxo-financeiro.service';
import { ContaService, ContaDTO } from '../../core/conta.service';
import { SelectedContaService } from '../../core/selected-conta.service';
import { CentroCustoService, CentroCustoDTO } from '../../core/centro-custo.service';
import { PessoaService, PessoaDTO } from '../../core/pessoa.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit, OnDestroy {
  saldo = 0;
  saldoCalculado = 0;
  contas: ContaDTO[] = [];
  contaAtiva: ContaDTO | null = null;
  lancamentos: FluxoFinanceiroDTO[] = [];
  centrosCusto: CentroCustoDTO[] = [];
  pessoas: PessoaDTO[] = [];

  // Enums para combos
  tiposOperacao = [
    { id: 1, descricao: 'Crédito (Entrada)' },
    { id: 2, descricao: 'Débito (Saída)' }
  ];
  
  situacoes = [
    { id: 1, descricao: 'Aberto' },
    { id: 2, descricao: 'Quitado' }
  ];
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

  // Lançamentos
  idContaSelecionada: number | undefined;
  tipoOperacao: number = 1;
  descricaoOperacao = '';
  valorOperacao = 0;
  dataOperacao = '';
  dataVencimento = '';
  parcela = '';
  situacao: number = 1;
  centroCustoId: number | null = null;
  pessoaId: number | null = null;
  fluxoError = '';
  fluxoSuccess = false;
  fluxoLoading = false;
  limiteExcedido = false;
  
  // Relatório
  mesRelatorio = '';
  relatorioError = '';

  constructor(
    private userInfo: UserInfoService,
    private userService: UserService,
    private auth: AuthService,
    private router: Router,
    private fluxoService: FluxoFinanceiroService,
    private contaService: ContaService,
    private selectedContaService: SelectedContaService,
    private centroCustoService: CentroCustoService,
    private pessoaService: PessoaService,
    private cdr: ChangeDetectorRef
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
    this.loadCentrosCusto();
    this.loadPessoas();
    
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.router.url.startsWith('/dashboard')) {
        this.loadUser();
      }
    });

    this.selectedContaService.selectedConta$().subscribe((id) => {
      this.idContaSelecionada = id ?? undefined;
      if (this.idContaSelecionada) {
        this.loadSaldo();
        this.loadLancamentos();
      }
      this.cdr.detectChanges();
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

  private loadSaldo() {
    if (!this.idContaSelecionada) return;
    this.contaService.getContaById(this.idContaSelecionada).subscribe({
      next: (conta) => {
        this.contaAtiva = conta;
        this.saldo = conta.saldo ?? 0;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar saldo:', err);
      }
    });
  }

  private loadLancamentos() {
    if (!this.idContaSelecionada) return;
    console.log('[Dashboard] Carregando lançamentos para conta:', this.idContaSelecionada);
    this.fluxoService.getFluxosByConta(this.idContaSelecionada).subscribe({
      next: (data) => {
        console.log('[Dashboard] Lançamentos recebidos:', data);
        this.lancamentos = (data || []).map((f: any) => ({
          ...f,
          tipoOperacao: Number(f.tipoOperacao),
          situacao: Number(f.situacao)
        })).sort((a, b) => {
          const dateA = new Date(a.dataOperacao).getTime();
          const dateB = new Date(b.dataOperacao).getTime();
          return dateB - dateA;
        });
        
        // Calcular saldo baseado nos lançamentos
        this.saldoCalculado = this.lancamentos.reduce((acc, lanc) => {
          if (lanc.tipoOperacao === 1) {
            return acc + lanc.valorOperacao;
          } else {
            return acc - lanc.valorOperacao;
          }
        }, 0);
        
        // Verificar se excedeu o limite
        this.verificarLimite();
        
        // Atualizar saldo da conta no banco de dados
        this.updateContaSaldo();
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[Dashboard] Erro ao carregar lançamentos:', err);
        console.error('[Dashboard] Status:', err.status);
        console.error('[Dashboard] Mensagem:', err.message);
      }
    });
  }

  private loadCentrosCusto() {
    this.centroCustoService.getCentrosCusto().subscribe({
      next: (data) => {
        this.centrosCusto = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar centros de custo:', err);
      }
    });
  }

  private loadPessoas() {
    this.pessoaService.getPessoas().subscribe({
      next: (data) => {
        this.pessoas = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar pessoas:', err);
      }
    });
  }

  private updateContaSaldo() {
    if (!this.idContaSelecionada) return;
    
    // Recalcula o saldo baseado nos lançamentos
    const saldoCalculado = this.lancamentos.reduce((acc, lanc) => {
      if (lanc.tipoOperacao === 1) {
        return acc + lanc.valorOperacao;
      } else {
        return acc - lanc.valorOperacao;
      }
    }, 0);
    
    // Atualiza o saldo da conta no backend
    this.contaService.updateSaldo(this.idContaSelecionada, saldoCalculado).subscribe({
      next: (contaAtualizada) => {
        console.log('[Dashboard] Saldo da conta atualizado:', contaAtualizada);
        if (this.contaAtiva) {
          this.contaAtiva.saldo = contaAtualizada.saldo;
        }
        // Verificar limite novamente após atualizar
        this.verificarLimite();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[Dashboard] Erro ao atualizar saldo da conta:', err);
      }
    });
  }

  private verificarLimite() {
    // Mostra alerta se o saldo for negativo
    if (this.saldoCalculado < 0) {
      this.limiteExcedido = true;
    } else {
      this.limiteExcedido = false;
    }
  }

  gerarRelatorio() {
    if (!this.mesRelatorio) {
      this.relatorioError = 'Selecione um mês para gerar o relatório.';
      return;
    }

    if (!this.idContaSelecionada) {
      this.relatorioError = 'Nenhuma conta selecionada.';
      return;
    }

    this.relatorioError = '';

    // Extrair ano e mês do input (formato: YYYY-MM)
    const [ano, mes] = this.mesRelatorio.split('-').map(Number);

    // Buscar lançamentos do mês
    this.fluxoService.getFluxosByMes(ano, mes).subscribe({
      next: (lancamentosMes: any) => {
        // Filtrar apenas os lançamentos da conta ativa
        const lancamentosConta = lancamentosMes.filter((l: any) => {
          const contaId = l.conta?.idConta || l.conta?.id || l.conta;
          return Number(contaId) === Number(this.idContaSelecionada);
        });

        // Abrir relatório em nova aba
        this.abrirRelatorio(ano, mes, lancamentosConta);
      },
      error: (err: any) => {
        console.error('Erro ao buscar lançamentos do mês:', err);
        this.relatorioError = 'Erro ao gerar relatório.';
      }
    });
  }

  private abrirRelatorio(ano: number, mes: number, lancamentos: any[]) {
    const entradas = lancamentos.filter(l => Number(l.tipoOperacao) === 1);
    const saidas = lancamentos.filter(l => Number(l.tipoOperacao) === 2);

    const totalEntradas = entradas.reduce((sum, l) => sum + l.valorOperacao, 0);
    const totalSaidas = saidas.reduce((sum, l) => sum + l.valorOperacao, 0);
    const saldoMes = totalEntradas - totalSaidas;

    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const nomeMes = meses[mes - 1];

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório Financeiro - ${nomeMes}/${ano}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
    .header-text { flex: 1; }
    .logo { width: 150px; height: auto; }
    h1 { color: #2c3e50; margin-bottom: 10px; }
    .subtitle { color: #7f8c8d; margin-bottom: 30px; }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .info-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; }
    .info-card h3 { font-size: 14px; opacity: 0.9; margin-bottom: 10px; }
    .info-card .value { font-size: 28px; font-weight: bold; }
    .chart-container { margin: 30px 0; }
    canvas { max-height: 400px; }
    table { width: 100%; border-collapse: collapse; margin-top: 30px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #667eea; color: white; font-weight: bold; }
    tr:hover { background: #f5f5f5; }
    .entrada { color: #27ae60; font-weight: bold; }
    .saida { color: #e74c3c; font-weight: bold; }
    @media print { body { background: white; } .container { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-text">
        <h1>📊 Relatório Financeiro</h1>
        <p class="subtitle">${nomeMes} de ${ano} - ${this.contaAtiva?.descricao || 'Conta'}</p>
      </div>
      <svg class="logo" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="25" fill="#10b981" opacity="0.2"/>
        <circle cx="30" cy="30" r="20" fill="none" stroke="#10b981" stroke-width="3"/>
        <text x="30" y="38" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#10b981" text-anchor="middle">$</text>
        <text x="65" y="25" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#1e293b">MONEY</text>
        <text x="65" y="45" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#10b981">MIND</text>
      </svg>
    </div>
    
    <div class="info-grid">
      <div class="info-card" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">
        <h3>Total de Entradas</h3>
        <div class="value">R$ ${totalEntradas.toFixed(2)}</div>
      </div>
      <div class="info-card" style="background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);">
        <h3>Total de Saídas</h3>
        <div class="value">R$ ${totalSaidas.toFixed(2)}</div>
      </div>
      <div class="info-card" style="background: linear-gradient(135deg, ${saldoMes >= 0 ? '#667eea 0%, #764ba2' : '#c94b4b 0%, #4b134f'} 100%);">
        <h3>Saldo do Mês</h3>
        <div class="value">R$ ${saldoMes.toFixed(2)}</div>
      </div>
      <div class="info-card" style="background: linear-gradient(135deg, #4776e6 0%, #8e54e9 100%);">
        <h3>Saldo Atual da Conta</h3>
        <div class="value">R$ ${this.contaAtiva?.saldo?.toFixed(2) || '0.00'}</div>
      </div>
    </div>

    <div class="chart-container">
      <canvas id="grafico"></canvas>
    </div>

    <h2 style="margin-top: 40px; color: #2c3e50;">Lançamentos do Período</h2>
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Descrição</th>
          <th>Tipo</th>
          <th>Valor</th>
          <th>Situação</th>
        </tr>
      </thead>
      <tbody>
        ${lancamentos.map(l => `
          <tr>
            <td>${new Date(l.dataOperacao).toLocaleDateString('pt-BR')}</td>
            <td>${l.descricaoOperacao}</td>
            <td>${Number(l.tipoOperacao) === 1 ? 'Entrada' : 'Saída'}</td>
            <td class="${Number(l.tipoOperacao) === 1 ? 'entrada' : 'saida'}">
              ${Number(l.tipoOperacao) === 1 ? '+' : '-'}R$ ${l.valorOperacao.toFixed(2)}
            </td>
            <td>${Number(l.situacao) === 1 ? 'Aberto' : 'Quitado'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <script>
    const ctx = document.getElementById('grafico').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Entradas', 'Saídas', 'Saldo'],
        datasets: [{
          label: 'Valores (R$)',
          data: [${totalEntradas}, ${totalSaidas}, ${Math.abs(saldoMes)}],
          backgroundColor: [
            'rgba(39, 174, 96, 0.8)',
            'rgba(231, 76, 60, 0.8)',
            '${saldoMes >= 0 ? 'rgba(102, 126, 234, 0.8)' : 'rgba(201, 75, 75, 0.8)'}'
          ],
          borderColor: [
            'rgba(39, 174, 96, 1)',
            'rgba(231, 76, 60, 1)',
            '${saldoMes >= 0 ? 'rgba(102, 126, 234, 1)' : 'rgba(201, 75, 75, 1)'}'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Resumo Financeiro - ${nomeMes}/${ano}',
            font: { size: 18 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return 'R$ ' + value.toFixed(2);
              }
            }
          }
        }
      }
    });
  </script>
</body>
</html>
    `;

    const novaAba = window.open('', '_blank');
    if (novaAba) {
      novaAba.document.write(html);
      novaAba.document.close();
    } else {
      this.relatorioError = 'Não foi possível abrir nova aba. Verifique o bloqueador de pop-ups.';
    }
  }

  onSubmitFluxo() {
    this.fluxoError = '';
    this.fluxoSuccess = false;

    if (!this.descricaoOperacao.trim()) {
      this.fluxoError = 'Descrição é obrigatória.';
      return;
    }
    if (!this.valorOperacao || this.valorOperacao <= 0) {
      this.fluxoError = 'Valor deve ser maior que zero.';
      return;
    }
    if (!this.dataOperacao) {
      this.fluxoError = 'Data da operação é obrigatória.';
      return;
    }
    if (!this.dataVencimento) {
      this.fluxoError = 'Data de vencimento é obrigatória.';
      return;
    }
    if (!this.parcela.trim()) {
      this.fluxoError = 'Parcela é obrigatória.';
      return;
    }
    if (!this.idContaSelecionada) {
      this.fluxoError = 'Nenhuma conta selecionada.';
      return;
    }

    this.fluxoLoading = true;

    const createDto: any = {
      valorOperacao: this.valorOperacao,
      descricaoOperacao: this.descricaoOperacao,
      dataOperacao: this.dataOperacao + 'T12:00:00',
      dataVencimento: this.dataVencimento + 'T12:00:00',
      parcela: this.parcela,
      situacao: Number(this.situacao),
      tipoOperacao: Number(this.tipoOperacao),
      conta: this.idContaSelecionada,
      centroCusto: this.centroCustoId,
      pessoa: this.pessoaId
    };

    console.log('[Dashboard] Criando lançamento:', createDto);

    this.fluxoService.createFluxo(createDto).subscribe({
      next: () => {
        this.fluxoLoading = false;
        this.fluxoSuccess = true;
        this.descricaoOperacao = '';
        this.valorOperacao = 0;
        this.dataOperacao = '';
        this.dataVencimento = '';
        this.parcela = '';
        this.tipoOperacao = 1;
        this.situacao = 1;
        this.centroCustoId = null;
        this.pessoaId = null;
        this.loadLancamentos(); // Isso já atualizará o saldo
        this.cdr.detectChanges();
        setTimeout(() => {
          this.fluxoSuccess = false;
          this.cdr.detectChanges();
        }, 2500);
      },
      error: (err) => {
        console.error('[Dashboard] Erro ao cadastrar lançamento:', err);
        console.error('[Dashboard] Status:', err.status);
        console.error('[Dashboard] Detalhes:', err.error);
        this.fluxoError = err?.error?.message || err?.error || 'Erro ao cadastrar lançamento.';
        this.fluxoLoading = false;
      }
    });
  }

  excluirFluxo(id: number) {
    if (confirm('Tem certeza que deseja excluir este lançamento?')) {
      this.fluxoService.deleteFluxo(id).subscribe({
        next: () => {
          this.loadLancamentos(); // Isso já atualizará o saldo
          this.cdr.detectChanges();
        },
        error: () => {
          alert('Erro ao excluir lançamento.');
        }
      });
    }
  }
}
