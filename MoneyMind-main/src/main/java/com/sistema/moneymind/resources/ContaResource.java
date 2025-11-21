package com.sistema.moneymind.resources;

import com.sistema.moneymind.domains.Conta;
import com.sistema.moneymind.domains.dtos.ContaDTO;
import com.sistema.moneymind.services.ContaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(value = "/conta")
public class ContaResource {

    @Autowired
    private ContaService contaService;

    @GetMapping
    public ResponseEntity<List<ContaDTO>> findAll(){
        return ResponseEntity.ok().body(contaService.findAll());
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<ContaDTO> findById(@PathVariable Long id){
        Conta obj = this.contaService.findbyId(id);
        return ResponseEntity.ok().body(new ContaDTO(obj));
    }

    @GetMapping(value = "/descricao/{descricao}")
    public ResponseEntity<ContaDTO> findByDescricao(@PathVariable String descricao){
        Conta obj = this.contaService.findbyDescricao(descricao);
        return ResponseEntity.ok().body(new ContaDTO(obj));
    }

    @PostMapping
    public ResponseEntity<ContaDTO> create(@Valid @RequestBody ContaDTO dto){
        Conta conta = contaService.create(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(conta.getIdConta()).toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<ContaDTO> update(@PathVariable Long id, @Valid @RequestBody ContaDTO objDto){
        Conta Obj = contaService.update(id, objDto);
        return  ResponseEntity.ok().body(new ContaDTO(Obj));
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<ContaDTO> delete(@PathVariable Long id){
        contaService.delete(id);
        return  ResponseEntity.noContent().build();
    }


    @GetMapping(value = "/usuario/{id}")
    public ResponseEntity<List<ContaDTO>> findByUsuario(@PathVariable Long id) {
        List<ContaDTO> list = contaService.findByUsuario(id);
        return ResponseEntity.ok().body(list);
    }

    @PatchMapping(value = "/{id}/saldo")
    public ResponseEntity<ContaDTO> updateSaldo(@PathVariable Long id, @RequestBody Double novoSaldo) {
        Conta conta = contaService.updateSaldo(id, novoSaldo);
        return ResponseEntity.ok().body(new ContaDTO(conta));
    }
}