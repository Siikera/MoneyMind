package com.sistema.moneymind.repositories;

import com.sistema.moneymind.domains.MetaFinanceira;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MetaFinanceiraRepository  extends JpaRepository<MetaFinanceira, Long> {

    Optional<MetaFinanceira> findByDescricaoMeta(String descricaoMeta);

    @Query("SELECT m FROM MetaFinanceira m WHERE m.conta.idConta = :idConta")
    List<MetaFinanceira> findByContaId(@Param("idConta") Long idConta);
}
