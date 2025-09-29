package com.sistema.moneymind.domains;

import com.sistema.moneymind.domains.dtos.PessoaDTO;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.br.CPF;

import java.util.Objects;

@Entity
@Table(name= "pessoa")
public class Pessoa {


    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_pessoa")
    private Long idPessoa;

    @NotBlank @NotNull
    @Column(unique = true)
    private String razaoSocial;



    public Pessoa() {
    }

    public Pessoa(Long idPessoa, String razaoSocial) {
        this.idPessoa = idPessoa;
        this.razaoSocial = razaoSocial;

    }


    public Pessoa(PessoaDTO dto){
        this.idPessoa = dto.getIdPessoa();
        this.razaoSocial = dto.getRazaoSocial();

    }


    public Long getIdPessoa() {
        return idPessoa;
    }

    public void setIdPessoa(Long idPessoa) {
        this.idPessoa = idPessoa;
    }

    public @NotBlank @NotNull String getRazaoSocial() {
        return razaoSocial;
    }

    public void setRazaoSocial(@NotBlank @NotNull String razaoSocial) {
        this.razaoSocial = razaoSocial;
    }



    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Pessoa pessoa = (Pessoa) o;
        return Objects.equals(idPessoa, pessoa.idPessoa) && Objects.equals(razaoSocial, pessoa.razaoSocial);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idPessoa, razaoSocial);
    }
}
