package br.pucminas.aluguel.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "contrato_credito")
public class ContratoCredito {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false) @JoinColumn(name = "banco_id")
    private Usuario banco;
    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal valor;

    public Long getId() { return id; }
    public Usuario getBanco() { return banco; }
    public void setBanco(Usuario banco) { this.banco = banco; }
    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }
}
