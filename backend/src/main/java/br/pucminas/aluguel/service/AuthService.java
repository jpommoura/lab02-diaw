package br.pucminas.aluguel.service;

import br.pucminas.aluguel.dto.Dtos.*;
import br.pucminas.aluguel.model.Usuario;
import br.pucminas.aluguel.repository.UsuarioRepository;
import br.pucminas.aluguel.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UsuarioRepository usuarios;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(UsuarioRepository usuarios, PasswordEncoder encoder, JwtService jwt) {
        this.usuarios = usuarios;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    public AuthResponse register(RegisterRequest r) {
        if (usuarios.existsByUsername(r.username()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Usuário já cadastrado");
        Usuario u = new Usuario();
        u.setUsername(r.username());
        u.setSenhaHash(encoder.encode(r.senha()));
        u.setRole(r.role());
        usuarios.save(u);
        return new AuthResponse(jwt.gerar(u), u.getUsername(), u.getRole());
    }

    public AuthResponse login(LoginRequest r) {
        Usuario u = usuarios.findByUsername(r.username())
                .filter(x -> encoder.matches(r.senha(), x.getSenhaHash()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário ou senha inválidos"));
        return new AuthResponse(jwt.gerar(u), u.getUsername(), u.getRole());
    }
}
