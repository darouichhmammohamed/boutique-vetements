package com.boutique.backend.dto;

import com.boutique.backend.entity.StatutCommande;
import jakarta.validation.constraints.NotNull;

public record StatutRequest(
        @NotNull(message = "Le statut est obligatoire")
        StatutCommande statut
) {
}
