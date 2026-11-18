package com.boutique.backend.dto;

import com.boutique.backend.entity.Role;
import com.boutique.backend.entity.Utilisateur;

public record UtilisateurResponse(Long id, String nom, String email, Role role) {

    public static UtilisateurResponse depuis(Utilisateur utilisateur) {
        return new UtilisateurResponse(
                utilisateur.getId(),
                utilisateur.getNom(),
                utilisateur.getEmail(),
                utilisateur.getRole());
    }
}
