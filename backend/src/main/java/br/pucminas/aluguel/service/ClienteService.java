package br.pucminas.aluguel.service;

import br.pucminas.aluguel.dto.Dtos.*;
import br.pucminas.aluguel.model.Cliente;
import br.pucminas.aluguel.model.Rendimento;
import br.pucminas.aluguel.model.Usuario;
import br.pucminas.aluguel.repository.ClienteRepository;
import br.pucminas.aluguel.repository.PedidoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ClienteService {
    private final ClienteRepository clientes;
    private final PedidoRepository pedidos;

    public ClienteService(ClienteRepository clientes, PedidoRepository pedidos) {
        this.clientes = clientes;
        this.pedidos = pedidos;
    }

    @Transactional
    public ClienteResponse criar(Usuario u, ClienteRequest r) {
        if (clientes.findByUsuario(u).isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Você já possui cadastro de cliente");
        if (clientes.existsByCpf(r.cpf()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "CPF já cadastrado");
        Cliente c = new Cliente();
        c.setUsuario(u);
        aplicar(c, r);
        return toResponse(clientes.save(c));
    }

    @Transactional(readOnly = true)
    public ClienteResponse meu(Usuario u) {
        return toResponse(doUsuario(u));
    }

    @Transactional
    public ClienteResponse atualizar(Usuario u, ClienteRequest r) {
        Cliente c = doUsuario(u);
        if (!c.getCpf().equals(r.cpf()) && clientes.existsByCpf(r.cpf()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "CPF já cadastrado");
        aplicar(c, r);
        return toResponse(clientes.save(c));
    }

    @Transactional
    public void excluir(Usuario u) {
        Cliente c = doUsuario(u);
        if (pedidos.existsByCliente(c))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cliente possui pedidos de aluguel; cancele/mantenha o histórico");
        clientes.delete(c);
    }

    @Transactional(readOnly = true)
    public List<ClienteResponse> listar() {
        return clientes.findAll().stream().map(ClienteService::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ClienteResponse buscar(Long id) {
        return toResponse(clientes.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado")));
    }

    private Cliente doUsuario(Usuario u) {
        return clientes.findByUsuario(u)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cadastro de cliente não encontrado"));
    }

    private void aplicar(Cliente c, ClienteRequest r) {
        c.setRg(r.rg());
        c.setCpf(r.cpf());
        c.setNome(r.nome());
        c.setEndereco(r.endereco());
        c.setProfissao(r.profissao());
        c.getRendimentos().clear();
        if (r.rendimentos() != null) {
            for (RendimentoDto d : r.rendimentos()) {
                Rendimento rend = new Rendimento();
                rend.setEntidadeEmpregadora(d.entidadeEmpregadora());
                rend.setValor(d.valor());
                rend.setCliente(c);
                c.getRendimentos().add(rend);
            }
        }
    }

    static ClienteResponse toResponse(Cliente c) {
        return new ClienteResponse(c.getId(), c.getRg(), c.getCpf(), c.getNome(), c.getEndereco(), c.getProfissao(),
                c.getRendimentos().stream()
                        .map(x -> new RendimentoDto(x.getEntidadeEmpregadora(), x.getValor())).toList());
    }
}
