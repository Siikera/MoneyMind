package com.sistema.moneymind.domains;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sistema.moneymind.domains.dtos.MetaFinanceiraDTO;
import com.sistema.moneymind.domains.enums.StatusMeta;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.Meta;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "metafinanceira")
public class MetaFinanceira {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_meta")
    private Long idMeta;

    @NotNull@NotBlank
    private String descricaoMeta;

    @NotBlank @NotNull
    private String prazo;

    @NotNull
    private Double valor;

    @Column(name = "status_meta")
    private int statusMeta;

    @ManyToOne
    @JoinColumn(name = "idconta")
    private Conta conta;

    public MetaFinanceira(){

    }

    public MetaFinanceira(Long idMeta, String descricaoMeta, String prazo, Double valor, Integer statusMeta, Conta conta) {
        this.idMeta = idMeta;
        this.descricaoMeta = descricaoMeta;
        this.prazo = prazo;
        this.valor = valor;
        this.statusMeta = statusMeta;
        this.conta = conta;
    }

    public MetaFinanceira(MetaFinanceiraDTO dto){
        this.idMeta = dto.getIdMeta();
        this.descricaoMeta = dto.getDescricaoMeta();
        this.prazo = dto.getPrazo();
        this.valor = dto.getValor();
        this.statusMeta = dto.getStatusMeta();
        this.conta = new Conta();
        this.conta.setIdConta(dto.getConta());
    }

    public Long getIdMeta() {
        return idMeta;
    }

    public void setIdMeta(Long idMeta) {
        this.idMeta = idMeta;
    }

    public @NotNull @NotBlank String getDescricaoMeta() {
        return descricaoMeta;
    }

    public void setDescricaoMeta(@NotNull @NotBlank String descricaoMeta) {
        this.descricaoMeta = descricaoMeta;
    }

    public @NotBlank @NotNull String getPrazo() {
        return prazo;
    }

    public void setPrazo(@NotBlank @NotNull String prazo) {
        this.prazo = prazo;
    }

    public @NotNull Double getValor() {
        return valor;
    }

    public void setValor(@NotNull Double valor) {
        this.valor = valor;
    }

    // Getter que retorna o enum para uso no domínio
    public StatusMeta getStatusMeta() {
        return StatusMeta.toEnum(this.statusMeta);
    }

    // Setter que aceita o enum e grava o código
    public void setStatusMeta(StatusMeta statusMeta) {
        this.statusMeta = (statusMeta == null) ? null : statusMeta.getId();
    }

    // Getter/Setter direto do código (usado por DTOs / serialização)
    public Integer getStatusMetaCode() {
        return this.statusMeta;
    }

    public void setStatusMetaCode(Integer statusMetaCode) {
        this.statusMeta = statusMetaCode;
    }

    public Conta getConta() {
        return conta;
    }

    public void setConta(Conta conta) {
        this.conta = conta;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MetaFinanceira that = (MetaFinanceira) o;
        return Objects.equals(idMeta, that.idMeta) && Objects.equals(descricaoMeta, that.descricaoMeta) && Objects.equals(prazo, that.prazo) && Objects.equals(valor, that.valor) && statusMeta == that.statusMeta;
    }

    @Override
    public int hashCode() {
        return Objects.hash(idMeta, descricaoMeta, prazo, valor, statusMeta);
    }
}
