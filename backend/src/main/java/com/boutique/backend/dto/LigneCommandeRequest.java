package com.boutique.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LigneCommandeRequest(
        @NotNull(message = "Le produit est obligatoire")
        Long produitId,

        @NotNull(message = "La quantité est obligatoire")
        @Min(value = 1, message = "La quantité doit être au moins 1")
        @Max(value = 20, message = "La quantité ne peut pas dépasser 20")
        Integer quantite,

        @NotBlank(message = "La taille est obligatoire")
        String taille
) {
}
