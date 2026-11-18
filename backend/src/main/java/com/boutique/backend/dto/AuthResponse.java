package com.boutique.backend.dto;

public record AuthResponse(String token, UtilisateurResponse utilisateur) {
}
