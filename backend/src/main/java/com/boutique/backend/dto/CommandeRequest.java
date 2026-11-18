package com.boutique.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CommandeRequest(
        @NotBlank(message = "L'adresse de livraison est obligatoire")
        @Size(max = 255, message = "L'adresse ne doit pas dépasser 255 caractères")
        String adresseLivraison,

        @NotEmpty(message = "La commande doit contenir au moins un article")
        List<@Valid LigneCommandeRequest> lignes
) {
}
