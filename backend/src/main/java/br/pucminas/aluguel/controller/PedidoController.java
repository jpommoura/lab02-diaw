package br.pucminas.aluguel.controller;

import br.pucminas.aluguel.dto.Dtos.*;
import br.pucminas.aluguel.model.Usuario;
import br.pucminas.aluguel.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {
    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    @PostMapping @ResponseStatus(HttpStatus.CREATED) @PreAuthorize("hasRole('CLIENTE')")
    public PedidoResponse criar(@AuthenticationPrincipal Usuario u, @Valid @RequestBody PedidoRequest r) {
        return service.criar(u, r);
    }

    @GetMapping
    public List<PedidoResponse> listar(@AuthenticationPrincipal Usuario u) {
        return service.listar(u);
    }

    @GetMapping("/{id}")
    public PedidoResponse buscar(@AuthenticationPrincipal Usuario u, @PathVariable Long id) {
        return service.buscar(u, id);
    }

    @PutMapping("/{id}")
    public PedidoResponse modificar(@AuthenticationPrincipal Usuario u, @PathVariable Long id,
                                    @Valid @RequestBody PedidoRequest r) {
        return service.modificar(u, id, r);
    }

    @DeleteMapping("/{id}") @PreAuthorize("hasRole('CLIENTE')")
    public PedidoResponse cancelar(@AuthenticationPrincipal Usuario u, @PathVariable Long id) {
        return service.cancelar(u, id);
    }

    @PatchMapping("/{id}/avaliacao") @PreAuthorize("hasAnyRole('EMPRESA','BANCO')")
    public PedidoResponse avaliar(@AuthenticationPrincipal Usuario u, @PathVariable Long id,
                                  @Valid @RequestBody AvaliacaoRequest r) {
        return service.avaliar(u, id, r);
    }

    @PatchMapping("/{id}/contrato") @PreAuthorize("hasAnyRole('EMPRESA','BANCO')")
    public PedidoResponse contratar(@AuthenticationPrincipal Usuario u, @PathVariable Long id) {
        return service.contratar(u, id);
    }
}
