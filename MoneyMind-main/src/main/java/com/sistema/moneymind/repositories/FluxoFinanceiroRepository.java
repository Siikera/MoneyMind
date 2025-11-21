package com.sistema.moneymind.repositories;

import com.sistema.moneymind.domains.FluxoFinanceiro;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FluxoFinanceiroRepository extends JpaRepository<FluxoFinanceiro, Long> {

    Optional<FluxoFinanceiro> findByDescricaoOperacao(String descricaoOperacao);


    @Query("SELECT f FROM FluxoFinanceiro f WHERE YEAR(f.dataOperacao) = :ano AND MONTH(f.dataOperacao) = :mes ORDER BY f.dataOperacao ASC")
    List<FluxoFinanceiro> findByAnoAndMes(@Param("ano") int ano, @Param("mes") int mes);

    @Query("SELECT f FROM FluxoFinanceiro f WHERE f.conta.idConta = :idConta AND YEAR(f.dataOperacao) = :ano AND MONTH(f.dataOperacao) = :mes")
    List<FluxoFinanceiro> findByContaAndAnoAndMes(@Param("idConta") Long idConta, @Param("ano") int ano, @Param("mes") int mes);

    @Query("SELECT f FROM FluxoFinanceiro f WHERE f.conta.idConta = :idConta ORDER BY f.dataOperacao DESC")
    List<FluxoFinanceiro> findByContaId(@Param("idConta") Long idConta);

}
