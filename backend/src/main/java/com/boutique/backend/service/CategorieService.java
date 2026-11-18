package com.boutique.backend.service;

import com.boutique.backend.entity.Categorie;
import com.boutique.backend.exception.RessourceIntrouvableException;
import com.boutique.backend.repository.CategorieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategorieService {

    private final CategorieRepository categorieRepository;

    public List<Categorie> getAll() {
        return categorieRepository.findAll();
    }

    public Categorie getById(Long id) {
        return categorieRepository.findById(id)
                .orElseThrow(() -> new RessourceIntrouvableException("Catégorie introuvable : " + id));
    }

    public Categorie create(Categorie categorie) {
        String nom = categorie.getNom().trim();
        if (categorieRepository.existsByNomIgnoreCase(nom)) {
            throw new IllegalArgumentException("Cette catégorie existe déjà : " + nom);
        }
        return categorieRepository.save(new Categorie(nom));
    }

    public Categorie update(Long id, Categorie nouvellesDonnees) {
        Categorie categorie = getById(id);
        String nom = nouvellesDonnees.getNom().trim();
        categorieRepository.findByNomIgnoreCase(nom)
                .filter(autre -> !autre.getId().equals(id))
                .ifPresent(autre -> {
                    throw new IllegalArgumentException("Cette catégorie existe déjà : " + nom);
                });
        categorie.setNom(nom);
        return categorieRepository.save(categorie);
    }

    @Transactional
    public void delete(Long id) {
        getById(id);
        categorieRepository.deleteById(id);
        categorieRepository.flush();
    }
}
