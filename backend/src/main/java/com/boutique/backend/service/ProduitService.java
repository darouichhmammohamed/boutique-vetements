package com.boutique.backend.service;

import com.boutique.backend.entity.Categorie;
import com.boutique.backend.entity.Produit;
import com.boutique.backend.exception.RessourceIntrouvableException;
import com.boutique.backend.repository.CategorieRepository;
import com.boutique.backend.repository.ProduitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProduitService {

    private final ProduitRepository produitRepository;
    private final CategorieRepository categorieRepository;

    public List<Produit> getAllProduits() {
        return produitRepository.findAll();
    }

    public Produit getProduitById(Long id) {
        return produitRepository.findById(id)
                .orElseThrow(() -> new RessourceIntrouvableException("Produit introuvable : " + id));
    }

    public List<Produit> getProduitsByCategorieId(Long categorieId) {
        if (!categorieRepository.existsById(categorieId)) {
            throw new RessourceIntrouvableException("Catégorie introuvable : " + categorieId);
        }
        return produitRepository.findByCategorieId(categorieId);
    }

    public List<Produit> getProduitsByMotCle(String motCle) {
        return produitRepository.findByNomContainingIgnoreCase(motCle.trim());
    }

    public Produit createProduit(Produit produit) {
        produit.setId(null);
        produit.setCategorie(trouverCategorie(produit));
        produit.setTailles(normaliserTailles(produit.getTailles()));
        return produitRepository.save(produit);
    }

    public Produit updateProduit(Long id, Produit nouvellesDonnees) {
        Produit produit = getProduitById(id);
        produit.setNom(nouvellesDonnees.getNom());
        produit.setDescription(nouvellesDonnees.getDescription());
        produit.setPrix(nouvellesDonnees.getPrix());
        produit.setStock(nouvellesDonnees.getStock());
        produit.setTailles(normaliserTailles(nouvellesDonnees.getTailles()));
        produit.setImageUrl(nouvellesDonnees.getImageUrl());
        produit.setCategorie(trouverCategorie(nouvellesDonnees));
        return produitRepository.save(produit);
    }

    @Transactional
    public void deleteProduit(Long id) {
        getProduitById(id);
        produitRepository.deleteById(id);
        produitRepository.flush();
    }

    private Categorie trouverCategorie(Produit produit) {
        if (produit.getCategorie() == null || produit.getCategorie().getId() == null) {
            throw new IllegalArgumentException("La catégorie est obligatoire");
        }
        Long categorieId = produit.getCategorie().getId();
        return categorieRepository.findById(categorieId)
                .orElseThrow(() -> new RessourceIntrouvableException("Catégorie introuvable : " + categorieId));
    }

    private String normaliserTailles(String tailles) {
        return String.join(",", List.of(tailles.split(",")).stream()
                .map(String::trim)
                .filter(t -> !t.isEmpty())
                .map(String::toUpperCase)
                .distinct()
                .toList());
    }
}
