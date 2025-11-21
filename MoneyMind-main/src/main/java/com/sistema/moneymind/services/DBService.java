package com.sistema.moneymind.services;


import com.sistema.moneymind.domains.*;
import com.sistema.moneymind.domains.enums.Situacao;
import com.sistema.moneymind.domains.enums.StatusMeta;
import com.sistema.moneymind.domains.enums.TipoConta;
import com.sistema.moneymind.domains.enums.TipoOperacao;
import com.sistema.moneymind.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

@Service
public class DBService {

    @Autowired
    private UsuarioRepository usRepo;

    @Autowired
    private BancoRepository bancoRepo;

    @Autowired
    private PessoaRepository pessoaRepo;

    @Autowired
    private MetaFinanceiraRepository metaRepo;

    @Autowired
    private CentroCustoRepository centroRepo;

    @Autowired
    private ContaRepository contaRepo;

    @Autowired
    private FluxoFinanceiroRepository fluxoRepo;

    @Autowired
    private PasswordEncoder encoder;

    public void initDB(){
        /*Usuario usuario1 = new Usuario(null, "Victor", "victor@gmail.com", encoder.encode("123"), LocalDate.now() );
        Usuario usuario2 = new Usuario(null, "Mateus", "mateus@gmail.com", encoder.encode("123"), LocalDate.now() );

        usRepo.save(usuario1);
        usRepo.save(usuario2);

        Banco banco01 = new Banco(null, "Nu Pagamentos S.A");
        Banco banco02 = new Banco(null, "Banco Santander (Brasil) S.A");

        bancoRepo.save(banco01);
        bancoRepo.save(banco02);


        CentroCusto centroCusto01 = new CentroCusto(null, "Centro01");
        CentroCusto centroCusto02 = new CentroCusto(null, "Centro02");

        centroRepo.save(centroCusto01);
        centroRepo.save(centroCusto02);


        Pessoa pessoa01 = new Pessoa(null, "Razao01");
        Pessoa pessoa02 = new Pessoa(null, "Razao02");

        pessoaRepo.save(pessoa01);
        pessoaRepo.save(pessoa02);


        Conta conta01 = new Conta(null, "Conta01", TipoConta.CONTACORRENTE, "Agencia01", "Numero : 1", 1000.0, 10000.0, usuario1, banco01 );
        Conta conta02 = new Conta(null, "Conta02", TipoConta.CONTACORRENTE, "Agencia02", "Numero : 2", 5000.0, 50000.0, usuario2, banco02 );

        contaRepo.save(conta01);
        contaRepo.save(conta02);

        FluxoFinanceiro fluxo01 = new FluxoFinanceiro(null,100.0,"Gastos Mensais", Date.from(LocalDate.of(2025, 8, 28).atStartOfDay(ZoneId.systemDefault()).toInstant()),Date.from(LocalDate.of(2025, 12, 28).atStartOfDay(ZoneId.systemDefault()).toInstant()),"0 parcelas", Situacao.ABERTO, TipoOperacao.CREDITO,conta01,centroCusto01,pessoa01);

        fluxoRepo.save(fluxo01);

        MetaFinanceira metaFinanceira01 = new MetaFinanceira(null, "Carro",  "10/08/2026", 60000.0, StatusMeta.EMANDAMENTO, conta01);
        MetaFinanceira metaFinanceira02 = new MetaFinanceira(null, "Moto",  "10/08/2025", 20000.0, StatusMeta.CONQUISTADA, conta01);

        metaRepo.save(metaFinanceira01);
        metaRepo.save(metaFinanceira02);*/

    }







}
