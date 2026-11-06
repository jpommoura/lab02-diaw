package br.pucminas.aluguel.controller;

import br.pucminas.aluguel.dto.Dtos.*;
import br.pucminas.aluguel.service.AutomovelService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/automoveis")
public class AutomovelController {
    private final AutomovelService service;

    public AutomovelController(AutomovelService service) {
        this.service = service;
    }

    @GetMapping
    public List<AutomovelResponse> listar() {
        return service.listar();
    }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public AutomovelResponse criar(@Valid @RequestBody AutomovelRequest r) {
        return service.criar(r);
    }
}
