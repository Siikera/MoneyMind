package com.sistema.moneymind.services;

import com.sistema.moneymind.domains.Conta;
import com.sistema.moneymind.domains.CentroCusto;
import com.sistema.moneymind.domains.FluxoFinanceiro;
import com.sistema.moneymind.domains.Pessoa;
import com.sistema.moneymind.domains.dtos.FluxoFinanceiroDTO;
import com.sistema.moneymind.domains.dtos.ResumoMensalDTO;
import com.sistema.moneymind.domains.enums.TipoOperacao;
import com.sistema.moneymind.repositories.ContaRepository;
import com.sistema.moneymind.repositories.CentroCustoRepository;
import com.sistema.moneymind.repositories.FluxoFinanceiroRepository;
import com.sistema.moneymind.repositories.PessoaRepository;
import com.sistema.moneymind.services.exceptions.DataIntegrityViolationException;
import com.sistema.moneymind.services.exceptions.ObjectNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FluxoFinanceiroService {

    @Autowired
    private ContaRepository contaRepo;

    @Autowired
    private CentroCustoRepository centroRepo;

    @Autowired
    private PessoaRepository pessoaRepo;

    @Autowired
    private FluxoFinanceiroRepository fluxoRepo;

    public List<FluxoFinanceiroDTO> findAll() {
    return fluxoRepo.findAll().stream().map(FluxoFinanceiroDTO::new).collect(Collectors.toList());
    }

    public List<FluxoFinanceiroDTO> findByConta(Long idConta) {
    return fluxoRepo.findByContaId(idConta).stream()
        .map(FluxoFinanceiroDTO::new)
        .collect(Collectors.toList());
    }

    public FluxoFinanceiro findById(Long id) {
        Optional<FluxoFinanceiro> obj = fluxoRepo.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Fluxo Financeiro não encontrado Id: " + id));
    }

    public List<FluxoFinanceiroDTO> findByMes(int ano, int mes) {
        // Validação simples para garantir que o mês é válido
        if (mes <1 || mes> 12) {
            throw new IllegalArgumentException("O mês deve ser um valor entre 1 e 12.");
        }

        List<FluxoFinanceiro> listaDeEntidades = fluxoRepo.findByAnoAndMes(ano, mes);

        // Converte a lista de entidades para uma lista de DTOs
        return listaDeEntidades.stream()
                .map(FluxoFinanceiroDTO::new)
                .collect(Collectors.toList());
    }

    public FluxoFinanceiro findbyDescricaoOperacao(String descricao) {
        Optional<FluxoFinanceiro> obj = fluxoRepo.findByDescricaoOperacao(descricao);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Fluxo Financeiro não encontrado Descricao: " + descricao));
    }

    // --- MeTODO CREATE MODIFICADO ---
    @Transactional // 1. Adiciona a anotação para garantir a consistência da operação
    public FluxoFinanceiro create(FluxoFinanceiroDTO dto) {
        dto.setIdOperacao(null); // Boa prática para garantir que é uma criação

        // 2. Valida as entidades e, mais importante, OBTÉM a conta gerenciada pelo JPA
        Conta conta = validaFluxoEBuscaConta(dto);

        // 3. Cria a nova operação financeira
        FluxoFinanceiro novaOperacao = new FluxoFinanceiro(dto);
        novaOperacao.setConta(conta); // Associa a entidade Conta completa, não uma nova instância

        // 4. Lógica para atualizar o saldo da conta
        Double valorOperacao = novaOperacao.getValorOperacao();
        TipoOperacao tipoOperacao = novaOperacao.getTipoOperacao();
        Double saldoAtual = conta.getSaldo();
        Double novoSaldo;

        if (tipoOperacao == TipoOperacao.CREDITO) {
            novoSaldo = saldoAtual + valorOperacao;
        } else if (tipoOperacao == TipoOperacao.DEBITO) {
            novoSaldo = saldoAtual - valorOperacao;
        } else {
            throw new IllegalArgumentException("Tipo de operação desconhecido: " + tipoOperacao);
        }

        // 5. Define o novo saldo na entidade Conta
        conta.setSaldo(novoSaldo);

        // 6. Salva a nova operação. A conta será atualizada automaticamente
        //    pelo @Transactional ao final do metodo.
        return fluxoRepo.save(novaOperacao);
    }

    // --- MeTODO DE VALIDAÇÃO AJUSTADO ---
    // Agora ele retorna a Conta para não precisarmos buscar duas vezes
    private Conta validaFluxoEBuscaConta(FluxoFinanceiroDTO dto) {
        // Valida e busca a Conta
        Optional<Conta> conta = contaRepo.findById(dto.getConta());
        if (conta.isEmpty()) { // Usar .isEmpty() é a prática mais moderna
            throw new DataIntegrityViolationException("Conta - " + dto.getConta() + " não está cadastrada");
        }

        // Valida Centro de Custo
        Optional<CentroCusto> centroCusto = centroRepo.findById(dto.getCentroCusto());
        if (centroCusto.isEmpty()) {
            throw new DataIntegrityViolationException("Centro de Custo - " + dto.getCentroCusto() + " não está cadastrado");
        }

        // Valida Pessoa
        Optional<Pessoa> pessoa = pessoaRepo.findById(dto.getPessoa());
        if (pessoa.isEmpty()) {
            throw new DataIntegrityViolationException("Pessoa - " + dto.getPessoa() + " não está cadastrada");
        }

        // Retorna a conta que já foi encontrada
        return conta.get();
    }

    // --- ATENÇÃO AO MeTODO UPDATE ---
    // O metodo de atualização também precisará de uma lógica para REVERTER a operação antiga
    // e APLICAR a nova, ou recalcular o saldo do zero. Por enquanto, vamos focar no create.
    public FluxoFinanceiro update(Long id, FluxoFinanceiroDTO dto) {
        dto.setIdOperacao(id);
        FluxoFinanceiro oldObj = findById(id);
        // CUIDADO: A lógica de atualização de saldo aqui é mais complexa.
        // Por enquanto, esta implementação não recalcula o saldo.
        validaFluxoEBuscaConta(dto);
        oldObj = new FluxoFinanceiro(dto);
        return fluxoRepo.save(oldObj);
    }



    public ResumoMensalDTO getResumoPorMes(int ano, int mes, Long idConta) {
        // 1. Decide qual lista de transações buscar
        List<FluxoFinanceiro> transacoesDoMes;

        if (idConta != null) {
            // Se um ID de conta foi fornecido, busca apenas as transações daquela conta
            transacoesDoMes = fluxoRepo.findByContaAndAnoAndMes(idConta, ano, mes);
        } else {
            // Se nenhum ID de conta foi fornecido, busca TODAS as transações do mês
            transacoesDoMes = fluxoRepo.findByAnoAndMes(ano, mes);
        }

        // 2. O resto da lógica de cálculo é EXATAMENTE A MESMA!
        double totalEntradas = 0.0;
        double totalSaidas = 0.0;

        for (FluxoFinanceiro transacao : transacoesDoMes) {
            if (transacao.getTipoOperacao() == TipoOperacao.DEBITO) {
                totalEntradas += transacao.getValorOperacao();
            } else if (transacao.getTipoOperacao() == TipoOperacao.CREDITO) {
                totalSaidas += transacao.getValorOperacao();
            }
        }

        totalSaidas = -totalSaidas; // Aplica o sinal negativo para saídas
        double resultadoFinal = totalEntradas + totalSaidas;

        return new ResumoMensalDTO(totalEntradas, totalSaidas, resultadoFinal);
    }

    public void delete(Long id) {
        // CUIDADO: A lógica de deleção também precisará reverter o efeito da operação no saldo.
        findById(id);
        fluxoRepo.deleteById(id);
    }
}