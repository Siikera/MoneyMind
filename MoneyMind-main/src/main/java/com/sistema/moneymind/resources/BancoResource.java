package com.sistema.moneymind.resources;


import com.sistema.moneymind.domains.Banco;
import com.sistema.moneymind.domains.Usuario;
import com.sistema.moneymind.domains.dtos.BancoDTO;
import com.sistema.moneymind.domains.dtos.UsuarioDTO;
import com.sistema.moneymind.services.BancoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
        import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(value = "/banco")
public class BancoResource {

    @Autowired
    private BancoService bancoService;

    @GetMapping
    public ResponseEntity<List<BancoDTO>> findAll(){
        return ResponseEntity.ok().body(bancoService.findAll());
    }

    @GetMapping(value = "{id}")
    public ResponseEntity<BancoDTO> findById(@PathVariable Long id){
        Banco obj = this.bancoService.findbyId(id);
        return ResponseEntity.ok().body(new BancoDTO(obj));
    }


    @GetMapping(value = "/razaoSocial/{razaoSocial}")
    public ResponseEntity<BancoDTO> findByRazaoSocial(@PathVariable String razaoSocial){
        Banco obj = this.bancoService.findByRazaoSocial(razaoSocial);
        return ResponseEntity.ok().body(new BancoDTO(obj));
    }

    @PostMapping
    public ResponseEntity<BancoDTO> create(@Valid @RequestBody BancoDTO dto){
        Banco banco = bancoService.create(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(banco.getIdBanco()).toUri();
        return  ResponseEntity.created(uri).build();
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<BancoDTO> update(@PathVariable Long id, @Valid @RequestBody BancoDTO objDTO){
        Banco Obj = bancoService.update(id, objDTO);
        return ResponseEntity.ok().body(new BancoDTO(Obj));
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<BancoDTO> delete(@PathVariable Long id){
        bancoService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
