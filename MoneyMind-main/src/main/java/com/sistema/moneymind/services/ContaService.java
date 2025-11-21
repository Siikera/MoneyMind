package com.sistema.moneymind.services;


import com.sistema.moneymind.domains.Banco;
import com.sistema.moneymind.domains.Conta;
import com.sistema.moneymind.domains.MetaFinanceira;
import com.sistema.moneymind.domains.Usuario;
import com.sistema.moneymind.domains.dtos.ContaDTO;
import com.sistema.moneymind.repositories.BancoRepository;
import com.sistema.moneymind.repositories.ContaRepository;
import com.sistema.moneymind.repositories.MetaFinanceiraRepository;
import com.sistema.moneymind.repositories.UsuarioRepository;
import com.sistema.moneymind.services.exceptions.DataIntegrityViolationException;
import com.sistema.moneymind.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ContaService {

    @Autowired
    private UsuarioRepository usuRepo;

    @Autowired
    private BancoRepository bancoRepo;

    @Autowired
    private MetaFinanceiraRepository metaRepo;

    @Autowired
    private ContaRepository contaRepo;


    public List<ContaDTO> findAll(){
        return contaRepo.findAll().stream().map(obj -> new ContaDTO(obj)).collect(Collectors.toList());
    }

    public Conta findbyId(Long id){
        Optional<Conta> obj = contaRepo.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Conta não encontrado Id:" + id));
    }

    public Conta findbyDescricao(String descricao){
        Optional<Conta> obj = contaRepo.findByDescricao(descricao);
        return obj.orElseThrow(() -> new  ObjectNotFoundException("Conta não encontrado Descricao:" + descricao));
    }

    public Conta create(ContaDTO dto){
        dto.setIdConta(null);
        validaConta(dto);
        Conta obj = new Conta(dto);
        return contaRepo.save(obj);
    }

    private void validaConta(ContaDTO dto){
        Optional<Conta> obj = contaRepo.findByDescricao(dto.getDescricao());
        if(obj.isPresent() && obj.get().getIdConta() != dto.getIdConta()){
            throw new DataIntegrityViolationException("Descrição já cadastrada");
        }


        Optional<Usuario> usuario = usuRepo.findById(dto.getUsuario());
        if(!usuario.isPresent()){
            throw new DataIntegrityViolationException("Usuario - " + dto.getUsuario() + "não esta cadastrado");
        }

        Optional<Banco> banco = bancoRepo.findById(dto.getBanco());
        if(!banco.isPresent()){
            throw new DataIntegrityViolationException("Banco - " + dto.getBanco() + "não esta cadastrado");
        }
    }

    public Conta update(Long id, ContaDTO objDto){
        objDto.setIdConta(id);
        Conta oldObj = findbyId(id);
        oldObj = new Conta(objDto);
        validaConta(objDto);
        return  contaRepo.save(oldObj);
    }

    public void delete(Long id){
        Conta obj = findbyId(id);
        contaRepo.deleteById(id);
    }

    public List<ContaDTO> findByUsuario(Long idUsuario) {
        return contaRepo.findByUsuario_IdUsuario(idUsuario)
                .stream()
                .map(ContaDTO::new)
                .collect(Collectors.toList());
    }

    public Conta updateSaldo(Long id, Double novoSaldo) {
        Conta conta = findbyId(id);
        conta.setSaldo(novoSaldo);
        return contaRepo.save(conta);
    }






}

