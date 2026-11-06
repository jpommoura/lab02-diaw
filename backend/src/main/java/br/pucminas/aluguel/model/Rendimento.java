package br.pucminas.aluguel.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "rendimento")
public class Rendimento {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "entidade_empregadora", nullable = false)
    private String entidadeEmpregadora;
    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal valor;
    @ManyToOne(optional = false) @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    public Long getId() { return id; }
    public String getEntidadeEmpregadora() { return entidadeEmpregadora; }
    public void setEntidadeEmpregadora(String e) { this.entidadeEmpregadora = e; }
    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
}
