package com.sistema.moneymind.domains;

import com.sistema.moneymind.domains.dtos.FluxoFinanceiroDTO;
import com.sistema.moneymind.domains.enums.Situacao;
import com.sistema.moneymind.domains.enums.TipoOperacao;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "fluxofinanceiro")
public class FluxoFinanceiro {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_fluxofinanceiro")
    private Long idOperacao;

    @NotNull
    private Double valorOperacao;

    @NotBlank @NotNull
    private String descricaoOperacao;

    @NotNull
    @Temporal(TemporalType.DATE)
    private Date dataOperacao;

    @Temporal(TemporalType.DATE)
    private Date dataVencimento;

    private String parcela;

    @Enumerated(EnumType.STRING)
    private Situacao situacao;

    @Enumerated(EnumType.STRING)
    private TipoOperacao tipoOperacao;

    @ManyToOne
    @JoinColumn(name = "idconta")
    private Conta conta;

    @ManyToOne
    @JoinColumn(name = "idcentrocusto")
    private CentroCusto centroCusto;

    @ManyToOne
    @JoinColumn(name = "idpessoa")
    private Pessoa pessoa;

    public FluxoFinanceiro() {
        this.situacao = Situacao.ABERTO;
    }

    public FluxoFinanceiro(Long idOperacao, Double valorOperacao, String descricaoOperacao, Date dataOperacao,
                           Date dataVencimento, String parcela, Situacao situacao, TipoOperacao tipoOperacao,
                           Conta conta, CentroCusto centroCusto, Pessoa pessoa) {
        this.idOperacao = idOperacao;
        this.valorOperacao = valorOperacao;
        this.descricaoOperacao = descricaoOperacao;
        this.dataOperacao = dataOperacao;
        this.dataVencimento = dataVencimento;
        this.parcela = parcela;
        this.situacao = situacao;
        this.tipoOperacao = tipoOperacao;
        this.conta = conta;
        this.centroCusto = centroCusto;
        this.pessoa = pessoa;
    }

    public FluxoFinanceiro(FluxoFinanceiroDTO dto) {
        this.idOperacao = dto.getIdOperacao();
        this.valorOperacao = dto.getValorOperacao();
        this.descricaoOperacao = dto.getDescricaoOperacao();
        this.dataOperacao = dto.getDataOperacao();
        this.dataVencimento = dto.getDataVencimento();
        this.parcela = dto.getParcela();
        this.situacao = Situacao.toEnum(dto.getSituacao());
        this.tipoOperacao = TipoOperacao.toEnum(dto.getTipoOperacao());

        this.conta = new Conta();
        this.conta.setIdConta(dto.getConta());

        this.centroCusto = new CentroCusto();
        this.centroCusto.setIdCentro(dto.getCentroCusto());

        this.pessoa = new Pessoa();
        this.pessoa.setIdPessoa(dto.getPessoa());
    }

    public Long getIdOperacao() {
        return idOperacao;
    }

    public void setIdOperacao(Long idOperacao) {
        this.idOperacao = idOperacao;
    }

    public Double getValorOperacao() {
        return valorOperacao;
    }

    public void setValorOperacao(Double valorOperacao) {
        this.valorOperacao = valorOperacao;
    }

    public String getDescricaoOperacao() {
        return descricaoOperacao;
    }

    public void setDescricaoOperacao(String descricaoOperacao) {
        this.descricaoOperacao = descricaoOperacao;
    }

    public Date getDataOperacao() {
        return dataOperacao;
    }

    public void setDataOperacao(Date dataOperacao) {
        this.dataOperacao = dataOperacao;
    }

    public Date getDataVencimento() {
        return dataVencimento;
    }

    public void setDataVencimento(Date dataVencimento) {
        this.dataVencimento = dataVencimento;
    }

    public String getParcela() {
        return parcela;
    }

    public void setParcela(String parcela) {
        this.parcela = parcela;
    }

    public Situacao getSituacao() {
        return situacao;
    }

    public void setSituacao(Situacao situacao) {
        this.situacao = situacao;
    }

    public TipoOperacao getTipoOperacao() {
        return tipoOperacao;
    }

    public void setTipoOperacao(TipoOperacao tipoOperacao) {
        this.tipoOperacao = tipoOperacao;
    }

    public Conta getConta() {
        return conta;
    }

    public void setConta(Conta conta) {
        this.conta = conta;
    }

    public CentroCusto getCentroCusto() {
        return centroCusto;
    }

    public void setCentroCusto(CentroCusto centroCusto) {
        this.centroCusto = centroCusto;
    }

    public Pessoa getPessoa() {
        return pessoa;
    }

    public void setPessoa(Pessoa pessoa) {
        this.pessoa = pessoa;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FluxoFinanceiro that)) return false;
        return Objects.equals(idOperacao, that.idOperacao);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idOperacao);
    }








}
