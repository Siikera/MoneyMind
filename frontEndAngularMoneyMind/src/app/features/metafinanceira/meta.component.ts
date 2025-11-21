import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MetaFinanceiraService, MetaFinanceiraDTO } from './meta.service';
import { NgIf, CommonModule } from '@angular/common';
import { SelectedContaService } from '../../core/selected-conta.service';

@Component({
 selector: 'app-meta',
 standalone: true,
 imports: [FormsModule, NgIf, CommonModule],
 templateUrl: './meta.html',
 styleUrls: ['./meta.css']
})
export class MetaFinanceiraCadastroComponent implements OnInit {
 metaEditando: MetaFinanceiraDTO | null = null;
    
     // PROPRIEDADES DE ESTADO DA EDIÇÃO
    // statusMeta representa o valor do enum do backend (1 = Em andamento, 2 = Concluída)
    statusMeta: number = 1;
    // NOVO: Propriedade para armazenar o ID da Conta sendo editada
    idConta: number | undefined; 
     
 editarMetaFinanceira(meta: MetaFinanceiraDTO) {
  this.metaEditando = { ...meta };
  this.descricaoMeta = meta.descricaoMeta;
  this.prazo = meta.prazo;
  this.valor = meta.valor;
     
       // Converte valor vindo do backend — forçar Number e manter 1/2
      this.statusMeta = Number(meta.statusMeta ?? 1);
       // O backend pode retornar a conta como `idconta` ou como `conta: { idConta }`.
       if ((meta as any).idconta) {
          this.idConta = (meta as any).idconta;
       } else if ((meta as any).conta) {
          this.idConta = (meta as any).conta.idConta ?? (meta as any).conta.id;
       } else {
          this.idConta = undefined;
       }
  }
 
  salvarAlteracao(meta: MetaFinanceiraDTO) {
   if (!this.descricaoMeta.trim()) {
    this.error = 'Descrição da Meta é obrigatória.';
    return;
   }
   this.loading = true;

   // determina id a atualizar (prefere metaEditando)
   const idToUpdate = (this.metaEditando?.idMeta ?? meta?.idMeta) ?? 0;
   if (!idToUpdate || idToUpdate <= 0) {
     this.error = 'ID da meta inválido para alteração.';
     this.loading = false;
     return;
   }

   // monta payload de atualização (envia status como número e conta como id)
   const updateDto: any = {
     descricaoMeta: this.descricaoMeta,
     prazo: this.prazo,
     valor: this.valor,
     statusMeta: Number(this.statusMeta)
   };

   // tenta obter idConta do estado (selected) ou do próprio objeto meta
   let contaId = this.idConta ?? this.extractContaId(meta);
   if (contaId == null) {
     // tenta procurar na lista local caso meta seja incompleto
     const local = this.metas.find(m => m.idMeta === idToUpdate);
     contaId = local ? this.extractContaId(local) : undefined;
   }
   if (contaId == null) {
     this.error = 'Conta da meta não encontrada. Impossível alterar (campo conta obrigatório).';
     this.loading = false;
     return;
   }
   updateDto.conta = contaId;

   console.log('Salvar alteração id:', idToUpdate, 'payload:', updateDto);

   this.metaService.updateMetaFinanceira(idToUpdate, updateDto).subscribe({
    next: () => {
     this.loading = false;
     this.success = true;
     this.metaEditando = null;
     this.descricaoMeta = '';
     this.prazo = '';
     this.valor = 0;
     this.statusMeta = 1;
     this.idConta = this.selectedConta.getSelectedContaId() ?? undefined;
     this.error = '';
     
     // Recarrega a lista após salvar
     this.listarMetaFinanceiras();
     
     setTimeout(() => {
      this.success = false;
      this.cdr.detectChanges();
     }, 2000);
    },
    error: (err: any) => {
     this.error = err?.error?.message || err?.error || 'Erro ao alterar meta.';
     this.loading = false;
     console.error('Erro ao salvar alteração:', err);
    }
   });
  }

  cancelarEdicao() {
   this.metaEditando = null;
   this.descricaoMeta = '';
   this.prazo = '';
   this.valor = 0;
      this.statusMeta = 1; // restaura padrão UI (1 = Em andamento)
      this.idConta = undefined;    // NOVO: Limpa o idConta
   this.error = '';
  }

 excluirMetaFinanceira(id: number) {
  if (confirm('Tem certeza que deseja excluir esta meta finaceira?')) {
   this.metaService.excluirMetaFinanceira(id).subscribe({
    next: () => {
     this.listarMetaFinanceiras();
     this.cdr.detectChanges();
    },
    error: () => {
     alert('Erro ao excluir meta finaceira.');
    }
   });
  }
 }

 cadastrarMetaFinanceira(meta: MetaFinanceiraDTO) {
  // Aqui você pode redirecionar para uma tela de cadastro de meta ou abrir um modal
  alert('Funcionalidade de cadastro de meta para: ' + meta.descricaoMeta);
 }
 descricaoMeta = '';
 prazo = '';
 valor = 0;
 error = '';
 success = false;
 loading = false;
 metas: MetaFinanceiraDTO[] = [];
 mostrarLista = false;

 constructor(
      private metaService: MetaFinanceiraService,
      private cdr: ChangeDetectorRef,
      private selectedConta: SelectedContaService
 ) {
    // não listar imediatamente — vamos aguardar a conta selecionada globalmente
 }

 ngOnInit(): void {
   // Observa a conta selecionada globalmente e carrega metas quando definida
   this.selectedConta.selectedConta$().subscribe((id) => {
     this.idConta = id ?? undefined;
     // Carrega metas (pode filtrar no backend se necessário)
     this.listarMetaFinanceiras();
     this.cdr.detectChanges();
   });
 }

 toggleLista() {
  this.mostrarLista = !this.mostrarLista;
 }

 listarMetaFinanceiras() {
  // Verifica se há conta selecionada para filtrar
  if (!this.idConta) {
    console.warn('Nenhuma conta selecionada. Não é possível listar metas.');
    this.metas = [];
    this.mostrarLista = false;
    this.cdr.detectChanges();
    return;
  }

  this.metaService.getMetaFinanceirasByConta(this.idConta).subscribe({
   next: (data) => {
    console.log('Dados recebidos do backend:', data);
    // normaliza statusMeta como number (evita problemas de comparação no template)
    this.metas = (data || []).map((m: any) => ({ ...m, statusMeta: Number(m.statusMeta) }));
    // garante que a lista esteja visível quando houver dados
    this.mostrarLista = true;
    this.cdr.detectChanges();
   },
   error: (err) => {
    console.error('Erro ao buscar metas:', err);
    this.metas = [];
    // esconder lista se erro (opcional)
    this.mostrarLista = false;
    this.cdr.detectChanges();
   }
  });
 }

 onSubmit() {
  this.error = '';
  this.success = false;
  if (!this.descricaoMeta.trim()) {
   this.error = 'Descrição da Meta é obrigatória.';
   return;
  }
  this.loading = true;
   if (this.metaEditando && this.metaEditando.idMeta) {
     const updateDto: any = {
        descricaoMeta: this.descricaoMeta,
        prazo: this.prazo,
        valor: this.valor,
        // envia diretamente o número do enum esperado pelo backend (1 ou 2)
        statusMeta: Number(this.statusMeta)
     };
     if (this.idConta != null) {
        updateDto.conta = this.idConta;
     }
 
     this.metaService.updateMetaFinanceira(this.metaEditando.idMeta, updateDto).subscribe({
     next: () => {
     this.loading = false;
     this.success = true;
     this.descricaoMeta = '';
     this.metaEditando = null;
     this.listarMetaFinanceiras();
     this.mostrarLista = true;
     this.statusMeta = 1; // restaura padrão UI
     this.idConta = undefined;    // NOVO: Limpa o idConta
     this.cdr.detectChanges();
     setTimeout(() => {
      const input = document.getElementById('descricaoMeta') as HTMLInputElement;
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
     this.error = err?.error?.message || err?.error || 'Erro ao alterar meta.';
     this.loading = false;
    }
   });
  } else {
   // Cadastro
      const createDto: any = {
         descricaoMeta: this.descricaoMeta,
         prazo: this.prazo,
         valor: this.valor,
         // sempre cadastrar como 1 (Em andamento)
         statusMeta: 1
      };
      if (this.idConta != null) {
         createDto.conta = this.idConta;
      }

      // DEBUG: mostra o JSON que será enviado ao backend
      console.log('Create payload:', JSON.stringify(createDto));

      this.metaService.createMetaFinanceira(createDto).subscribe({
     next: () => {
     this.loading = false;
     this.success = true;
     this.descricaoMeta = '';
     this.listarMetaFinanceiras();
     // garante que a lista fique visível após criar
     this.mostrarLista = true;
     this.cdr.detectChanges();
     setTimeout(() => {
      const input = document.getElementById('descricaoMeta') as HTMLInputElement;
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
     if (typeof err?.error === 'string' && err.error.includes('Descrição da Meta já cadastrado')) {
      this.error = err.error;
     } else if (err?.error?.message && err.error.message.includes('Descrição da Meta já cadastrado')) {
      this.error = err.error.message;
     } else if (err?.status === 409) {
      this.error = 'Descrição da Meta já cadastrada.';
     } else {
      this.error = err?.error?.message || err?.error || 'Erro ao cadastrar meta.';
     }
     this.loading = false;
    }
   });
  }
 }

 // NOVO: marca a meta como finalizada (status = 2)
 finalizarMetaFinanceira(id: number) {
    if (!id || id <= 0) {
      alert('ID da meta inválido.');
      return;
    }
    if (!confirm('Marcar esta meta como finalizada?')) return;

    console.log('Finalizando meta id:', id);

    this.metaService.updateStatus(id, 2).subscribe({
      next: () => {
        this.listarMetaFinanceiras();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        alert('Erro ao finalizar meta.');
        console.error('Erro finalizar meta:', err);
      }
    });
  }

 // helper: obtém id da conta a partir de diferentes formatos possíveis
 private extractContaId(obj: any): number | undefined {
  if (obj == null) return undefined;
  // já é número
  if (typeof obj === 'number' && !isNaN(obj)) return obj;
  // propriedade direta
  if ((obj as any).idConta != null) {
    const n = Number((obj as any).idConta);
    return isNaN(n) ? undefined : n;
  }
  if ((obj as any).idconta != null) {
    const n = Number((obj as any).idconta);
    return isNaN(n) ? undefined : n;
  }
  if ((obj as any).id != null) {
    const n = Number((obj as any).id);
    return isNaN(n) ? undefined : n;
  }
  // conta pode ser um objeto dentro
  if ((obj as any).conta) {
    const conta = (obj as any).conta;
    if (typeof conta === 'number' && !isNaN(conta)) return conta;
    if (conta.idConta != null) {
      const n = Number(conta.idConta);
      return isNaN(n) ? undefined : n;
    }
    if (conta.id != null) {
      const n = Number(conta.id);
      return isNaN(n) ? undefined : n;
    }
  }
  return undefined;
 }
}