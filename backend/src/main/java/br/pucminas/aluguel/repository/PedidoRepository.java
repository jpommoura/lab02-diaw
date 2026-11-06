package br.pucminas.aluguel.repository;

import br.pucminas.aluguel.model.Cliente;
import br.pucminas.aluguel.model.PedidoAluguel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PedidoRepository extends JpaRepository<PedidoAluguel, Long> {
    List<PedidoAluguel> findByClienteOrderByCriadoEmDesc(Cliente cliente);
    List<PedidoAluguel> findAllByOrderByCriadoEmDesc();
    boolean existsByCliente(Cliente cliente);
}
