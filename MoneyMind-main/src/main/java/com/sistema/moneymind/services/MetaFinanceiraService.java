package com.sistema.moneymind.services;


import com.sistema.moneymind.domains.MetaFinanceira;
import com.sistema.moneymind.domains.dtos.MetaFinanceiraDTO;
import com.sistema.moneymind.repositories.MetaFinanceiraRepository;
import com.sistema.moneymind.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MetaFinanceiraService {

    @Autowired
    private MetaFinanceiraRepository metaRepo;

    public List<MetaFinanceiraDTO> findAll(){
    return metaRepo.findAll().stream().map(obj -> new MetaFinanceiraDTO(obj)).collect(Collectors.toUnmodifiableList());
    }

    public List<MetaFinanceiraDTO> findByConta(Long idConta){
    return metaRepo.findByContaId(idConta).stream()
        .map(obj -> new MetaFinanceiraDTO(obj))
        .collect(Collectors.toUnmodifiableList());
    }

    public MetaFinanceira findbyId(Long id){
        Optional<MetaFinanceira> obj = metaRepo.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException("Meta financeira  não encontrado! Id: " + id));
    }

    public MetaFinanceira findByDescricaoMeta (String descricaoMeta){
        Optional<MetaFinanceira> obj = metaRepo.findByDescricaoMeta (descricaoMeta);
        return obj.orElseThrow(() -> new ObjectNotFoundException(" Deescriçao da meta financeira não encontrado! Meta Fianceira: " + descricaoMeta));
    }


    public MetaFinanceira create(MetaFinanceiraDTO dto){
        dto.setIdMeta(null);
        MetaFinanceira obj = new MetaFinanceira(dto);
        return metaRepo.save(obj);
    }

    public MetaFinanceira update(Long id, MetaFinanceiraDTO objDto){
        MetaFinanceira oldObj = findbyId(id);
        
        // Atualiza apenas os campos fornecidos
        if (objDto.getDescricaoMeta() != null) {
            oldObj.setDescricaoMeta(objDto.getDescricaoMeta());
        }
        if (objDto.getPrazo() != null) {
            oldObj.setPrazo(objDto.getPrazo());
        }
        if (objDto.getValor() != null) {
            oldObj.setValor(objDto.getValor());
        }
        // Atualiza status usando o código direto
        oldObj.setStatusMetaCode(objDto.getStatusMeta());
        
        // Atualiza conta se fornecida
        if (objDto.getConta() != null) {
            oldObj.getConta().setIdConta(objDto.getConta());
        }
        
        return metaRepo.save(oldObj);
    }
    
    // Método específico para atualizar apenas o status
    public MetaFinanceira updateStatus(Long id, Integer novoStatus){
        MetaFinanceira meta = findbyId(id);
        meta.setStatusMetaCode(novoStatus);
        return metaRepo.save(meta);
    }

    public void delete(Long id){
        findbyId(id); // Valida se existe antes de deletar
        metaRepo.deleteById(id);
    }

}
