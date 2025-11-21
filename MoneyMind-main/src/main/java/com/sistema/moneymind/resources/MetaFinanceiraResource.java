package com.sistema.moneymind.resources;


import com.sistema.moneymind.domains.MetaFinanceira;
import com.sistema.moneymind.domains.dtos.MetaFinanceiraDTO;
import com.sistema.moneymind.services.MetaFinanceiraService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(value = "/metafinanceira")
public class MetaFinanceiraResource {

    @Autowired
    private MetaFinanceiraService metaFinanceiraService;

    @GetMapping
    public ResponseEntity<List<MetaFinanceiraDTO>> findAll(){
        return ResponseEntity.ok().body(metaFinanceiraService.findAll());
    }

    @GetMapping(value = "/conta/{idConta}")
    public ResponseEntity<List<MetaFinanceiraDTO>> findByConta(@PathVariable Long idConta){
        return ResponseEntity.ok().body(metaFinanceiraService.findByConta(idConta));
    }


    @GetMapping(value = "/{id}")
    public ResponseEntity<MetaFinanceiraDTO> findById(@PathVariable Long id){
        MetaFinanceira obj = this.metaFinanceiraService.findbyId(id);
        return ResponseEntity.ok().body(new MetaFinanceiraDTO(obj));
    }

    @GetMapping(value = "/descricaoMeta/{descricaoMeta}")
    public ResponseEntity<MetaFinanceiraDTO> findByDescricaoMeta(@PathVariable String descricaoMeta){
        MetaFinanceira obj = this.metaFinanceiraService.findByDescricaoMeta(descricaoMeta);
        return ResponseEntity.ok().body(new MetaFinanceiraDTO(obj));
    }

    @PostMapping
    public ResponseEntity<MetaFinanceiraDTO> create(@Valid @RequestBody MetaFinanceiraDTO dto){
        MetaFinanceira metaFinanceira = metaFinanceiraService.create(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(metaFinanceira.getIdMeta()).toUri();
        return ResponseEntity.created(uri).build();
    }


    @PutMapping(value = "/{id}")
    public ResponseEntity<MetaFinanceiraDTO> update(@PathVariable Long id, @Valid @RequestBody MetaFinanceiraDTO objDto){
        MetaFinanceira Obj = metaFinanceiraService.update(id, objDto);
        return  ResponseEntity.ok().body(new MetaFinanceiraDTO(Obj));
    }

    @PatchMapping(value = "/{id}/status")
    public ResponseEntity<MetaFinanceiraDTO> updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, Integer> body){
        Integer novoStatus = body.get("statusMeta");
        if (novoStatus == null) {
            return ResponseEntity.badRequest().build();
        }
        MetaFinanceira obj = metaFinanceiraService.updateStatus(id, novoStatus);
        return ResponseEntity.ok().body(new MetaFinanceiraDTO(obj));
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<MetaFinanceiraDTO> delete(@PathVariable Long id){
        metaFinanceiraService.delete(id);
        return  ResponseEntity.noContent().build();
    }

}
