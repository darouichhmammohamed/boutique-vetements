package com.boutique.backend.repository;

import com.boutique.backend.entity.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategorieRepository extends JpaRepository<Categorie, Long> {

    boolean existsByNomIgnoreCase(String nom);

    Optional<Categorie> findByNomIgnoreCase(String nom);
}
