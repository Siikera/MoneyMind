package com.sistema.moneymind.domains.dtos;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.sistema.moneymind.domains.Usuario;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.Objects;

public class UsuarioDTO {

    private Long idUsuario;

    @NotBlank(message = "O campo nome não pode ser vazio")
    @NotNull(message = "O campo nome não pode ser nulo")
    private String nomeUsuario;

    @Email(message = "O campo e-mail deve ser um endereço de e-mail válido")
    @NotBlank(message = "O campo e-mail não pode ser vazio")
    @NotNull(message = "O campo e-mail não pode ser nulo")
    private String emailUsuario;

    @NotBlank(message = "O campo senha não pode ser vazio")
    @NotNull(message = "O campo senha não pode ser nulo")
    @Size(min = 8, message = "A senha deve ter pelo menos 8 caracteres")
    private String senhaUsuario;

    @JsonFormat(pattern = "dd/MM/yyyy")
    protected LocalDate dataNascimento = LocalDate.now();

    public UsuarioDTO() {
    }

    public UsuarioDTO(Usuario usuario) {
        this.idUsuario = usuario.getIdUsuario();
        this.nomeUsuario = usuario.getNomeUsuario();
        this.emailUsuario = usuario.getEmailUsuario();
        this.senhaUsuario = usuario.getSenhaUsuario();
        this.dataNascimento = usuario.getDataNascimento();
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public @NotBlank(message = "O campo nome não pode ser vazio") @NotNull(message = "O campo nome não pode ser nulo") String getNomeUsuario() {
        return nomeUsuario;
    }

    public void setNomeUsuario(@NotBlank(message = "O campo nome não pode ser vazio") @NotNull(message = "O campo nome não pode ser nulo") String nomeUsuario) {
        this.nomeUsuario = nomeUsuario;
    }

    public @Email(message = "O campo e-mail deve ser um endereço de e-mail válido") @NotBlank(message = "O campo e-mail não pode ser vazio") @NotNull(message = "O campo e-mail não pode ser nulo") String getEmailUsuario() {
        return emailUsuario;
    }

    public void setEmailUsuario(@Email(message = "O campo e-mail deve ser um endereço de e-mail válido") @NotBlank(message = "O campo e-mail não pode ser vazio") @NotNull(message = "O campo e-mail não pode ser nulo") String emailUsuario) {
        this.emailUsuario = emailUsuario;
    }

    public @NotBlank(message = "O campo senha não pode ser vazio") @NotNull(message = "O campo senha não pode ser nulo") @Size(min = 8, message = "A senha deve ter pelo menos 8 caracteres") String getSenhaUsuario() {
        return senhaUsuario;
    }

    public void setSenhaUsuario(@NotBlank(message = "O campo senha não pode ser vazio") @NotNull(message = "O campo senha não pode ser nulo") @Size(min = 8, message = "A senha deve ter pelo menos 8 caracteres") String senhaUsuario) {
        this.senhaUsuario = senhaUsuario;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UsuarioDTO that = (UsuarioDTO) o;
        return Objects.equals(idUsuario, that.idUsuario) && Objects.equals(nomeUsuario, that.nomeUsuario) && Objects.equals(emailUsuario, that.emailUsuario) && Objects.equals(senhaUsuario, that.senhaUsuario) && Objects.equals(dataNascimento, that.dataNascimento);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idUsuario, nomeUsuario, emailUsuario, senhaUsuario, dataNascimento);
    }
}
