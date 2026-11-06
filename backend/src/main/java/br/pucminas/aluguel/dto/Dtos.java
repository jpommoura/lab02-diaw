package br.pucminas.aluguel.dto;

import br.pucminas.aluguel.model.Role;
import br.pucminas.aluguel.model.StatusPedido;
import br.pucminas.aluguel.model.TipoProprietario;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public final class Dtos {
    private Dtos() {}

    public record RegisterRequest(@NotBlank @Size(min = 3, max = 50) String username,
                                  @NotBlank @Size(min = 6, max = 100) String senha,
                                  @NotNull Role role) {}
    public record LoginRequest(@NotBlank String username, @NotBlank String senha) {}
    public record AuthResponse(String token, String username, Role role) {}

    public record RendimentoDto(@NotBlank String entidadeEmpregadora,
                                @NotNull @PositiveOrZero BigDecimal valor) {}
    public record ClienteRequest(@NotBlank String rg, @NotBlank String cpf, @NotBlank String nome,
                                 @NotBlank String endereco, @NotBlank String profissao,
                                 @Valid @Size(max = 3, message = "máximo de 3 rendimentos") List<RendimentoDto> rendimentos) {}
    public record ClienteResponse(Long id, String rg, String cpf, String nome, String endereco,
                                  String profissao, List<RendimentoDto> rendimentos) {}

    public record AutomovelRequest(@NotBlank String matricula, @NotNull @Min(1900) Integer ano,
                                   @NotBlank String marca, @NotBlank String modelo, @NotBlank String placa,
                                   @NotNull TipoProprietario tipoProprietario) {}
    public record AutomovelResponse(Long id, String matricula, Integer ano, String marca, String modelo,
                                    String placa, TipoProprietario tipoProprietario) {}

    public record PedidoRequest(@NotNull Long automovelId, @NotNull LocalDate dataInicio,
                                @NotNull LocalDate dataFim) {}
    public record AvaliacaoRequest(@NotNull Boolean aprovado, String parecer, BigDecimal valorCredito) {}
    public record PedidoResponse(Long id, Long clienteId, String clienteNome, AutomovelResponse automovel,
                                 LocalDate dataInicio, LocalDate dataFim, StatusPedido status, String parecer,
                                 BigDecimal valorCredito, String banco, LocalDateTime criadoEm) {}
}
