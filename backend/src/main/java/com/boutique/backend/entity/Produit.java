package com.boutique.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "produits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Produit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    @NotBlank(message = "Le nom du produit est obligatoire")
    @Size(max = 150, message = "Le nom ne doit pas dépasser 150 caractères")
    private String nom;

    @Column(length = 1000)
    @NotBlank(message = "La description du produit est obligatoire")
    @Size(max = 1000, message = "La description ne doit pas dépasser 1000 caractères")
    private String description;

    @Column(nullable = false)
    @NotNull(message = "Le prix du produit est obligatoire")
    @Positive(message = "Le prix doit être un nombre positif")
    private Double prix;

    @Column(nullable = false)
    @NotNull(message = "Le stock du produit est obligatoire")
    @Min(value = 0, message = "Le stock doit être un nombre positif ou nul")
    private Integer stock;

    @NotBlank(message = "Les tailles du produit sont obligatoires")
    private String tailles;

    @Size(max = 255, message = "Le lien de l'image ne doit pas dépasser 255 caractères")
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "categorie_id", nullable = false)
    @NotNull(message = "La catégorie du produit est obligatoire")
    private Categorie categorie;
}
