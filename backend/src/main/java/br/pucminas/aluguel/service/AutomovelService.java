package br.pucminas.aluguel.service;

import br.pucminas.aluguel.dto.Dtos.*;
import br.pucminas.aluguel.model.Automovel;
import br.pucminas.aluguel.repository.AutomovelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AutomovelService {
    private final AutomovelRepository automoveis;

    public AutomovelService(AutomovelRepository automoveis) {
        this.automoveis = automoveis;
    }

    @Transactional(readOnly = true)
    public List<AutomovelResponse> listar() {
        return automoveis.findAll().stream().map(AutomovelService::toResponse).toList();
    }

    @Transactional
    public AutomovelResponse criar(AutomovelRequest r) {
        Automovel a = new Automovel();
        a.setMatricula(r.matricula());
        a.setAno(r.ano());
        a.setMarca(r.marca());
        a.setModelo(r.modelo());
        a.setPlaca(r.placa());
        a.setTipoProprietario(r.tipoProprietario());
        return toResponse(automoveis.save(a));
    }

    static AutomovelResponse toResponse(Automovel a) {
        return new AutomovelResponse(a.getId(), a.getMatricula(), a.getAno(), a.getMarca(), a.getModelo(),
                a.getPlaca(), a.getTipoProprietario());
    }
}
