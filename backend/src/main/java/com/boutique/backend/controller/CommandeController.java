package com.boutique.backend.controller;

import com.boutique.backend.dto.CommandeRequest;
import com.boutique.backend.dto.StatutRequest;
import com.boutique.backend.entity.Commande;
import com.boutique.backend.service.CommandeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/commandes")
@RequiredArgsConstructor
public class CommandeController {

    private final CommandeService commandeService;

    @PostMapping
    public ResponseEntity<Commande> creer(@AuthenticationPrincipal Jwt jwt,
                                          @Valid @RequestBody CommandeRequest requete) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commandeService.creer(jwt.getSubject(), requete));
    }

    @GetMapping("/mes-commandes")
    public List<Commande> mesCommandes(@AuthenticationPrincipal Jwt jwt) {
        return commandeService.mesCommandes(jwt.getSubject());
    }

    @PutMapping("/{id}/annuler")
    public Commande annuler(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        return commandeService.annulerParClient(id, jwt.getSubject());
    }

    @GetMapping
    public List<Commande> toutes() {
        return commandeService.toutes();
    }

    @PutMapping("/{id}/statut")
    public Commande changerStatut(@PathVariable Long id, @Valid @RequestBody StatutRequest requete) {
        return commandeService.changerStatut(id, requete.statut());
    }
}
