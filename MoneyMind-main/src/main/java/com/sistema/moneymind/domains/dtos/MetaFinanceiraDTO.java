package com.sistema.moneymind.domains.dtos;


import com.sistema.moneymind.domains.MetaFinanceira;
import com.sistema.moneymind.domains.enums.StatusMeta;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Objects;

public class MetaFinanceiraDTO {


    private Long idMeta;

    @NotBlank(message = "O campo Descrição Meta não pode ser vazio")
    @NotNull(message = "O campo Descrição Meta  não pode ser nulo")
    private String descricaoMeta;



    @NotBlank(message = "O campo prazo não pode ser vazio")
    @NotNull(message = "O campo prazo não pode ser nulo")
    private String prazo;

    @NotNull(message = "O valor nome não pode ser nulo")
    private Double valor;

    private int statusMeta;

    @NotNull(message = "O campo conta é requirido")
    private Long conta;


    public MetaFinanceiraDTO() {
    }

    public MetaFinanceiraDTO(MetaFinanceira metaFinanceira) {
        this.idMeta = metaFinanceira.getIdMeta();
        this.descricaoMeta = metaFinanceira.getDescricaoMeta();
        this.prazo = metaFinanceira.getPrazo();
        this.valor = metaFinanceira.getValor();
        this.statusMeta = metaFinanceira.getStatusMeta().getId();
        this.conta = metaFinanceira.getConta().getIdConta();

    }

    public Long getIdMeta() {
        return idMeta;
    }

    public void setIdMeta(Long idMeta) {
        this.idMeta = idMeta;
    }

    public @NotBlank(message = "O campo Descrição Meta não pode ser vazio") @NotNull(message = "O campo Descrição Meta  não pode ser nulo") String getDescricaoMeta() {
        return descricaoMeta;
    }

    public void setDescricaoMeta(@NotBlank(message = "O campo Descrição Meta não pode ser vazio") @NotNull(message = "O campo Descrição Meta  não pode ser nulo") String descricaoMeta) {
        this.descricaoMeta = descricaoMeta;
    }

    public @NotBlank(message = "O campo prazo não pode ser vazio") @NotNull(message = "O campo prazo não pode ser nulo") String getPrazo() {
        return prazo;
    }

    public void setPrazo(@NotBlank(message = "O campo prazo não pode ser vazio") @NotNull(message = "O campo prazo não pode ser nulo") String prazo) {
        this.prazo = prazo;
    }

    public @NotNull(message = "O valor nome não pode ser nulo") Double getValor() {
        return valor;
    }

    public void setValor(@NotNull(message = "O valor nome não pode ser nulo") Double valor) {
        this.valor = valor;
    }

    public int getStatusMeta() {
        return statusMeta;
    }

    public void setStatusMeta(int statusMeta) {
        this.statusMeta = statusMeta;
    }

    public Long getConta() {
        return conta;
    }

    public void setConta(Long conta) {
        this.conta = conta;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MetaFinanceiraDTO that = (MetaFinanceiraDTO) o;
        return statusMeta == that.statusMeta && Objects.equals(idMeta, that.idMeta) && Objects.equals(descricaoMeta, that.descricaoMeta) && Objects.equals(prazo, that.prazo) && Objects.equals(valor, that.valor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idMeta, descricaoMeta, prazo, valor, statusMeta);
    }
}
