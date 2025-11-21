package com.sistema.moneymind.domains.dtos;

import com.sistema.moneymind.domains.Conta;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ContaDTO {



    private Long idConta;

    @NotNull(message = "O campo descricao não pode ser nulo")
    @NotBlank(message = "O campo descircao não pode ser vazio")
    private String descricao;

    private int tipoConta;

    @NotNull(message = "O campo agencia não pode ser nulo")
    @NotBlank(message = "O campo agencia não pode ser vazio")
    private String agencia;

    @NotNull(message = "O campo numero não pode ser nulo")
    @NotBlank(message = "O campo numero não pode ser vazio")
    private String numero;

    @NotNull(message = "O campo saldo não pode ser nulo")
    private Double saldo;

    @NotNull(message = "O campo limite não pode ser nulo")
    private Double limite;

    @NotNull(message = "O campo usuario é requirido")
    private Long Usuario;

    @NotNull(message = "O campo banco é requirido")
    private Long Banco;


    public ContaDTO() {
    }

    public ContaDTO(Conta conta) {
        this.idConta = conta.getIdConta();
        this.descricao = conta.getDescricao();
        this.tipoConta = conta.getTipoConta().getId();
        this.agencia = conta.getAgencia();
        this.numero = conta.getNumero();
        this.saldo = conta.getSaldo();
        this.limite = conta.getLimite();

        Usuario = conta.getUsuario().getIdUsuario();
        Banco = conta.getBanco().getIdBanco();
    }

    public Long getIdConta() {
        return idConta;
    }

    public void setIdConta(Long idConta) {
        this.idConta = idConta;
    }

    public @NotNull(message = "O campo descricao não pode ser nulo") @NotBlank(message = "O campo descircao não pode ser vazio") String getDescricao() {
        return descricao;
    }

    public void setDescricao(@NotNull(message = "O campo descricao não pode ser nulo") @NotBlank(message = "O campo descircao não pode ser vazio") String descricao) {
        this.descricao = descricao;
    }

    public int getTipoConta() {
        return tipoConta;
    }

    public void setTipoConta(int tipoConta) {
        this.tipoConta = tipoConta;
    }

    public @NotNull(message = "O campo agencia não pode ser nulo") @NotBlank(message = "O campo agencia não pode ser vazio") String getAgencia() {
        return agencia;
    }

    public void setAgencia(@NotNull(message = "O campo agencia não pode ser nulo") @NotBlank(message = "O campo agencia não pode ser vazio") String agencia) {
        this.agencia = agencia;
    }

    public @NotNull(message = "O campo numero não pode ser nulo") @NotBlank(message = "O campo numero não pode ser vazio") String getNumero() {
        return numero;
    }

    public void setNumero(@NotNull(message = "O campo numero não pode ser nulo") @NotBlank(message = "O campo numero não pode ser vazio") String numero) {
        this.numero = numero;
    }

    public @NotNull(message = "O campo saldo não pode ser nulo") Double getSaldo() {
        return saldo;
    }

    public void setSaldo(@NotNull(message = "O campo saldo não pode ser nulo") Double saldo) {
        this.saldo = saldo;
    }

    public @NotNull(message = "O campo limite não pode ser nulo") Double getLimite() {
        return limite;
    }

    public void setLimite(@NotNull(message = "O campo limite não pode ser nulo") Double limite) {
        this.limite = limite;
    }

    public @NotNull(message = "O campo usuario é requirido") Long getUsuario() {
        return Usuario;
    }

    public void setUsuario(@NotNull(message = "O campo usuario é requirido") Long usuario) {
        Usuario = usuario;
    }

    public @NotNull(message = "O campo banco é requirido") Long getBanco() {
        return Banco;
    }

    public void setBanco(@NotNull(message = "O campo banco é requirido") Long banco) {
        Banco = banco;
    }
}
