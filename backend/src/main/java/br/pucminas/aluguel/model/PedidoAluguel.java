package br.pucminas.aluguel.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pedido_aluguel")
public class PedidoAluguel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false) @JoinColumn(name = "cliente_id")
    private Cliente cliente;
    @ManyToOne(optional = false) @JoinColumn(name = "automovel_id")
    private Automovel automovel;
    @Column(name = "data_inicio", nullable = false) private LocalDate dataInicio;
    @Column(name = "data_fim", nullable = false) private LocalDate dataFim;
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private StatusPedido status;
    @Column(length = 1000) private String parecer;
    @Column(name = "criado_em", nullable = false) private LocalDateTime criadoEm;
    @OneToOne(cascade = CascadeType.ALL) @JoinColumn(name = "contrato_credito_id")
    private ContratoCredito contratoCredito;

    public Long getId() { return id; }
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    public Automovel getAutomovel() { return automovel; }
    public void setAutomovel(Automovel automovel) { this.automovel = automovel; }
    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate d) { this.dataInicio = d; }
    public LocalDate getDataFim() { return dataFim; }
    public void setDataFim(LocalDate d) { this.dataFim = d; }
    public StatusPedido getStatus() { return status; }
    public void setStatus(StatusPedido status) { this.status = status; }
    public String getParecer() { return parecer; }
    public void setParecer(String parecer) { this.parecer = parecer; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
    public ContratoCredito getContratoCredito() { return contratoCredito; }
    public void setContratoCredito(ContratoCredito c) { this.contratoCredito = c; }
}
