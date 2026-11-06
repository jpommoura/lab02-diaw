package br.pucminas.aluguel.service;

import br.pucminas.aluguel.dto.Dtos.*;
import br.pucminas.aluguel.model.*;
import br.pucminas.aluguel.repository.AutomovelRepository;
import br.pucminas.aluguel.repository.ClienteRepository;
import br.pucminas.aluguel.repository.PedidoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PedidoService {
    private final PedidoRepository pedidos;
    private final ClienteRepository clientes;
    private final AutomovelRepository automoveis;

    public PedidoService(PedidoRepository pedidos, ClienteRepository clientes, AutomovelRepository automoveis) {
        this.pedidos = pedidos;
        this.clientes = clientes;
        this.automoveis = automoveis;
    }

    private static boolean agente(Usuario u) {
        return u.getRole() != Role.CLIENTE;
    }

    private static ResponseStatusException erro(HttpStatus s, String msg) {
        return new ResponseStatusException(s, msg);
    }

    private PedidoAluguel carregar(Usuario u, Long id) {
        PedidoAluguel p = pedidos.findById(id).orElseThrow(() -> erro(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
        if (!agente(u) && !p.getCliente().getUsuario().getId().equals(u.getId()))
            throw erro(HttpStatus.NOT_FOUND, "Pedido não encontrado");
        return p;
    }

    private void validar(PedidoRequest r) {
        if (r.dataFim().isBefore(r.dataInicio()))
            throw erro(HttpStatus.BAD_REQUEST, "A data final não pode ser anterior à data inicial");
    }

    private Automovel automovel(Long id) {
        return automoveis.findById(id).orElseThrow(() -> erro(HttpStatus.NOT_FOUND, "Automóvel não encontrado"));
    }

    @Transactional
    public PedidoResponse criar(Usuario u, PedidoRequest r) {
        Cliente c = clientes.findByUsuario(u)
                .orElseThrow(() -> erro(HttpStatus.BAD_REQUEST, "Complete seu cadastro de cliente antes de criar um pedido"));
        validar(r);
        PedidoAluguel p = new PedidoAluguel();
        p.setCliente(c);
        p.setAutomovel(automovel(r.automovelId()));
        p.setDataInicio(r.dataInicio());
        p.setDataFim(r.dataFim());
        p.setStatus(StatusPedido.PENDENTE);
        p.setCriadoEm(LocalDateTime.now());
        return toResponse(pedidos.save(p));
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listar(Usuario u) {
        List<PedidoAluguel> lista;
        if (agente(u)) {
            lista = pedidos.findAllByOrderByCriadoEmDesc();
        } else {
            lista = clientes.findByUsuario(u).map(pedidos::findByClienteOrderByCriadoEmDesc).orElse(List.of());
        }
        return lista.stream().map(PedidoService::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponse buscar(Usuario u, Long id) {
        return toResponse(carregar(u, id));
    }

    @Transactional
    public PedidoResponse modificar(Usuario u, Long id, PedidoRequest r) {
        PedidoAluguel p = carregar(u, id);
        boolean permitido = agente(u)
                ? (p.getStatus() == StatusPedido.PENDENTE || p.getStatus() == StatusPedido.APROVADO)
                : p.getStatus() == StatusPedido.PENDENTE;
        if (!permitido) throw erro(HttpStatus.CONFLICT, "Pedido não pode mais ser modificado (status " + p.getStatus() + ")");
        validar(r);
        p.setAutomovel(automovel(r.automovelId()));
        p.setDataInicio(r.dataInicio());
        p.setDataFim(r.dataFim());
        return toResponse(p);
    }

    @Transactional
    public PedidoResponse cancelar(Usuario u, Long id) {
        PedidoAluguel p = carregar(u, id);
        if (p.getStatus() != StatusPedido.PENDENTE && p.getStatus() != StatusPedido.APROVADO)
            throw erro(HttpStatus.CONFLICT, "Pedido não pode ser cancelado (status " + p.getStatus() + ")");
        p.setStatus(StatusPedido.CANCELADO);
        return toResponse(p);
    }

    @Transactional
    public PedidoResponse avaliar(Usuario u, Long id, AvaliacaoRequest r) {
        PedidoAluguel p = carregar(u, id);
        if (p.getStatus() != StatusPedido.PENDENTE)
            throw erro(HttpStatus.CONFLICT, "Apenas pedidos PENDENTES podem ser avaliados");
        p.setParecer(r.parecer());
        if (r.aprovado()) {
            p.setStatus(StatusPedido.APROVADO);
            if (u.getRole() == Role.BANCO && r.valorCredito() != null) {
                ContratoCredito cc = new ContratoCredito();
                cc.setBanco(u);
                cc.setValor(r.valorCredito());
                p.setContratoCredito(cc);
            }
        } else {
            p.setStatus(StatusPedido.REPROVADO);
        }
        return toResponse(p);
    }

    @Transactional
    public PedidoResponse contratar(Usuario u, Long id) {
        PedidoAluguel p = carregar(u, id);
        if (p.getStatus() != StatusPedido.APROVADO)
            throw erro(HttpStatus.CONFLICT, "Apenas pedidos APROVADOS podem virar contrato");
        p.setStatus(StatusPedido.CONTRATADO);
        return toResponse(p);
    }

    static PedidoResponse toResponse(PedidoAluguel p) {
        ContratoCredito cc = p.getContratoCredito();
        return new PedidoResponse(p.getId(), p.getCliente().getId(), p.getCliente().getNome(),
                AutomovelService.toResponse(p.getAutomovel()), p.getDataInicio(), p.getDataFim(), p.getStatus(),
                p.getParecer(), cc == null ? null : cc.getValor(), cc == null ? null : cc.getBanco().getUsername(),
                p.getCriadoEm());
    }
}
