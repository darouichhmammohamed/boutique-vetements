package com.boutique.backend.repository;

import com.boutique.backend.entity.Commande;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommandeRepository extends JpaRepository<Commande, Long> {

    List<Commande> findByUtilisateurIdOrderByDateCommandeDesc(Long utilisateurId);

    List<Commande> findAllByOrderByDateCommandeDesc();
}
