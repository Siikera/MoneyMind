package com.sistema.moneymind.domains;


import com.sistema.moneymind.domains.dtos.ContaDTO;
import com.sistema.moneymind.domains.enums.TipoConta;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Objects;

@Entity
@Table(name = "conta")
public class Conta {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_conta")
    private Long idConta;

    @NotBlank @NotNull
    private String descricao;

    @Enumerated(EnumType.ORDINAL)
    @JoinColumn(name = "tipoConta")
    private TipoConta tipoConta;

    @NotBlank @NotNull
    private String agencia;

    @NotBlank @NotNull
    private String numero;

    @NotNull
    private Double saldo;

    @NotNull
    private Double limite;

    @ManyToOne
    @JoinColumn(name = "idusuario")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "idbanco")
    private Banco banco;


    public Conta() {

        this.tipoConta = TipoConta.CONTACORRENTE;

    }

    public Conta(Long idConta, String descricao, TipoConta tipoConta, String agencia, String numero, Double saldo, Double limite, Usuario usuario, Banco banco) {
        this.idConta = idConta;
        this.descricao = descricao;
        this.tipoConta = tipoConta;
        this.agencia = agencia;
        this.numero = numero;
        this.saldo = saldo;
        this.limite = limite;
        this.usuario = usuario;
        this.banco = banco;
    }


    public Conta(ContaDTO dto){
        this.idConta = dto.getIdConta();
        this.descricao = dto.getDescricao();

        this.tipoConta = TipoConta.toEnum(dto.getTipoConta());

        this.agencia = dto.getAgencia();
        this.numero =  dto.getNumero();
        this.saldo = dto.getSaldo();
        this.limite = dto.getLimite();


        this.usuario = new Usuario();
        this.usuario.setIdUsuario(dto.getUsuario());

        this.banco = new Banco();
        this.banco.setIdBanco(dto.getBanco());

    }


    public Long getIdConta() {
        return idConta;
    }

    public void setIdConta(Long idConta) {
        this.idConta = idConta;
    }

    public @NotBlank @NotNull String getDescricao() {
        return descricao;
    }

    public void setDescricao(@NotBlank @NotNull String descricao) {
        this.descricao = descricao;
    }

    public TipoConta getTipoConta() {
        return tipoConta;
    }

    public void setTipoConta(TipoConta tipoConta) {
        this.tipoConta = tipoConta;
    }

    public @NotBlank @NotNull String getAgencia() {
        return agencia;
    }

    public void setAgencia(@NotBlank @NotNull String agencia) {
        this.agencia = agencia;
    }

    public @NotBlank @NotNull String getNumero() {
        return numero;
    }

    public void setNumero(@NotBlank @NotNull String numero) {
        this.numero = numero;
    }

    public @NotNull Double getSaldo() {
        return saldo;
    }

    public void setSaldo(@NotNull Double saldo) {
        this.saldo = saldo;
    }

    public @NotNull Double getLimite() {
        return limite;
    }

    public void setLimite(@NotNull Double limite) {
        this.limite = limite;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Banco getBanco() {
        return banco;
    }

    public void setBanco(Banco banco) {
        this.banco = banco;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Conta conta = (Conta) o;
        return Objects.equals(idConta, conta.idConta) && Objects.equals(descricao, conta.descricao) && tipoConta == conta.tipoConta && Objects.equals(agencia, conta.agencia) && Objects.equals(numero, conta.numero) && Objects.equals(saldo, conta.saldo) && Objects.equals(limite, conta.limite) && Objects.equals(usuario, conta.usuario) && Objects.equals(banco, conta.banco);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idConta, descricao, tipoConta, agencia, numero, saldo, limite, usuario, banco);
    }
}