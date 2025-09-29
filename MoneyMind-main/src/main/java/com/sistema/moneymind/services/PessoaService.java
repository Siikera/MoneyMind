package com.sistema.moneymind.services;

import com.sistema.moneymind.domains.Banco;
import com.sistema.moneymind.domains.Pessoa;
import com.sistema.moneymind.domains.dtos.BancoDTO;
import com.sistema.moneymind.domains.dtos.PessoaDTO;
import com.sistema.moneymind.repositories.BancoRepository;
import com.sistema.moneymind.repositories.PessoaRepository;
import com.sistema.moneymind.services.exceptions.DataIntegrityViolationException;
import com.sistema.moneymind.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PessoaService {

    @Autowired
    private PessoaRepository pessoaRepo;

    public List<PessoaDTO> findAll(){
        return pessoaRepo.findAll().stream().map(obj -> new PessoaDTO(obj)).collect(Collectors.toUnmodifiableList());
    }

    public Pessoa findbyId(Long id){
        Optional<Pessoa> obj = pessoaRepo.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Pessoa não encontrado! Id: " + id));
    }


    public Pessoa findByRazaoSocial (String razaoSocial){
        Optional<Pessoa> obj = pessoaRepo.findByRazaoSocial (razaoSocial);
        return obj.orElseThrow(() -> new ObjectNotFoundException(" Razão Social não encontrado! Razão Social: " + razaoSocial));
    }


    public Pessoa create(PessoaDTO dto){
        dto.setIdPessoa(null);
        validaPessoa(dto);
        Pessoa obj = new Pessoa(dto);
        return pessoaRepo.save(obj);
    }




    private void validaPessoa(PessoaDTO dto){
        Optional<Pessoa> obj = pessoaRepo.findByRazaoSocial(dto.getRazaoSocial());
        if(obj.isPresent() && obj.get().getIdPessoa() != dto.getIdPessoa()){
            throw new DataIntegrityViolationException("Razão Social já cadastrado");
        }
    }


    public Pessoa update(Long id, PessoaDTO objDto){
        objDto.setIdPessoa(id);
        Pessoa oldObj = findbyId(id);
        oldObj = new Pessoa(objDto);
        return pessoaRepo.save(oldObj);
    }

    public void delete(Long id){
        Pessoa obj = findbyId(id);
        pessoaRepo.deleteById(id);
    }





}
