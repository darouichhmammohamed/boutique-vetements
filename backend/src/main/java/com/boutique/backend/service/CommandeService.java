package com.boutique.backend.service;

import com.boutique.backend.dto.CommandeRequest;
import com.boutique.backend.dto.LigneCommandeRequest;
import com.boutique.backend.entity.Commande;
import com.boutique.backend.entity.LigneCommande;
import com.boutique.backend.entity.Produit;
import com.boutique.backend.entity.StatutCommande;
import com.boutique.backend.entity.Utilisateur;
import com.boutique.backend.exception.RessourceIntrouvableException;
import com.boutique.backend.repository.CommandeRepository;
import com.boutique.backend.repository.ProduitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommandeService {

    private final CommandeRepository commandeRepository;
    private final ProduitRepository produitRepository;
    private final AuthService authService;

    @Transactional
    public Commande creer(String email, CommandeRequest requete) {
        Utilisateur utilisateur = authService.getParEmail(email);
        Commande commande = new Commande();
        commande.setUtilisateur(utilisateur);
        commande.setAdresseLivraison(requete.adresseLivraison().trim());
        commande.setDateCommande(LocalDateTime.now());
        commande.setStatut(StatutCommande.EN_ATTENTE);

        double total = 0;
        for (LigneCommandeRequest ligneRequete : requete.lignes()) {
            Produit produit = produitRepository.findById(ligneRequete.produitId())
                    .orElseThrow(() -> new RessourceIntrouvableException(
                            "Produit introuvable : " + ligneRequete.produitId()));
            String taille = ligneRequete.taille().trim().toUpperCase();
            verifierTaille(produit, taille);
            if (produit.getStock() < ligneRequete.quantite()) {
                throw new IllegalArgumentException("Stock insuffisant pour « " + produit.getNom()
                        + " » (il en reste " + produit.getStock() + ")");
            }
            produit.setStock(produit.getStock() - ligneRequete.quantite());
            LigneCommande ligne = new LigneCommande(produit, taille, ligneRequete.quantite());
            commande.ajouterLigne(ligne);
            total += ligne.getPrixUnitaire() * ligne.getQuantite();
        }
        commande.setTotal(Math.round(total * 100.0) / 100.0);
        return commandeRepository.save(commande);
    }

    public List<Commande> mesCommandes(String email) {
        Utilisateur utilisateur = authService.getParEmail(email);
        return commandeRepository.findByUtilisateurIdOrderByDateCommandeDesc(utilisateur.getId());
    }

    public List<Commande> toutes() {
        return commandeRepository.findAllByOrderByDateCommandeDesc();
    }

    @Transactional
    public Commande changerStatut(Long id, StatutCommande nouveauStatut) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RessourceIntrouvableException("Commande introuvable : " + id));
        if (commande.getStatut() == StatutCommande.ANNULEE) {
            throw new IllegalArgumentException("Une commande annulée ne peut plus changer de statut");
        }
        if (nouveauStatut == StatutCommande.ANNULEE) {
            remettreEnStock(commande);
        }
        commande.setStatut(nouveauStatut);
        return commande;
    }

    @Transactional
    public Commande annulerParClient(Long id, String email) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RessourceIntrouvableException("Commande introuvable : " + id));
        if (!commande.getUtilisateur().getEmail().equalsIgnoreCase(email)) {
            throw new RessourceIntrouvableException("Commande introuvable : " + id);
        }
        if (commande.getStatut() != StatutCommande.EN_ATTENTE) {
            throw new IllegalArgumentException("Seule une commande en attente peut être annulée");
        }
        remettreEnStock(commande);
        commande.setStatut(StatutCommande.ANNULEE);
        return commande;
    }

    private void remettreEnStock(Commande commande) {
        for (LigneCommande ligne : commande.getLignes()) {
            Produit produit = ligne.getProduit();
            produit.setStock(produit.getStock() + ligne.getQuantite());
        }
    }

    private void verifierTaille(Produit produit, String taille) {
        boolean disponible = Arrays.stream(produit.getTailles().split(","))
                .map(String::trim)
                .anyMatch(t -> t.equalsIgnoreCase(taille));
        if (!disponible) {
            throw new IllegalArgumentException("La taille " + taille + " n'est pas disponible pour « "
                    + produit.getNom() + " »");
        }
    }
}
