package br.pucminas.aluguel.controller;

import br.pucminas.aluguel.dto.Dtos.*;
import br.pucminas.aluguel.model.Usuario;
import br.pucminas.aluguel.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {
    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @PostMapping @ResponseStatus(HttpStatus.CREATED) @PreAuthorize("hasRole('CLIENTE')")
    public ClienteResponse criar(@AuthenticationPrincipal Usuario u, @Valid @RequestBody ClienteRequest r) {
        return service.criar(u, r);
    }

    @GetMapping("/me") @PreAuthorize("hasRole('CLIENTE')")
    public ClienteResponse meu(@AuthenticationPrincipal Usuario u) {
        return service.meu(u);
    }

    @PutMapping("/me") @PreAuthorize("hasRole('CLIENTE')")
    public ClienteResponse atualizar(@AuthenticationPrincipal Usuario u, @Valid @RequestBody ClienteRequest r) {
        return service.atualizar(u, r);
    }

    @DeleteMapping("/me") @ResponseStatus(HttpStatus.NO_CONTENT) @PreAuthorize("hasRole('CLIENTE')")
    public void excluir(@AuthenticationPrincipal Usuario u) {
        service.excluir(u);
    }

    @GetMapping @PreAuthorize("hasAnyRole('EMPRESA','BANCO')")
    public List<ClienteResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}") @PreAuthorize("hasAnyRole('EMPRESA','BANCO')")
    public ClienteResponse buscar(@PathVariable Long id) {
        return service.buscar(id);
    }
}
