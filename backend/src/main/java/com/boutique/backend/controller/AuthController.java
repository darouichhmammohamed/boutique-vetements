package com.boutique.backend.controller;

import com.boutique.backend.dto.AuthResponse;
import com.boutique.backend.dto.ConnexionRequest;
import com.boutique.backend.dto.InscriptionRequest;
import com.boutique.backend.dto.UtilisateurResponse;
import com.boutique.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/inscription")
    public ResponseEntity<AuthResponse> inscription(@Valid @RequestBody InscriptionRequest requete) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.inscrire(requete));
    }

    @PostMapping("/connexion")
    public AuthResponse connexion(@Valid @RequestBody ConnexionRequest requete) {
        return authService.connecter(requete);
    }

    @GetMapping("/moi")
    public UtilisateurResponse moi(@AuthenticationPrincipal Jwt jwt) {
        return UtilisateurResponse.depuis(authService.getParEmail(jwt.getSubject()));
    }
}
