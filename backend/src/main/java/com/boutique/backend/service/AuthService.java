package com.boutique.backend.service;

import com.boutique.backend.dto.AuthResponse;
import com.boutique.backend.dto.ConnexionRequest;
import com.boutique.backend.dto.InscriptionRequest;
import com.boutique.backend.dto.UtilisateurResponse;
import com.boutique.backend.entity.Role;
import com.boutique.backend.entity.Utilisateur;
import com.boutique.backend.exception.IdentifiantsInvalidesException;
import com.boutique.backend.exception.RessourceIntrouvableException;
import com.boutique.backend.repository.UtilisateurRepository;
import com.boutique.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse inscrire(InscriptionRequest requete) {
        String email = requete.email().trim().toLowerCase();
        if (utilisateurRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Un compte existe déjà avec cet email");
        }
        Utilisateur utilisateur = new Utilisateur(
                requete.nom().trim(),
                email,
                passwordEncoder.encode(requete.motDePasse()),
                Role.CLIENT);
        return reponse(utilisateurRepository.save(utilisateur));
    }

    public AuthResponse connecter(ConnexionRequest requete) {
        Utilisateur utilisateur = utilisateurRepository.findByEmailIgnoreCase(requete.email().trim())
                .orElseThrow(IdentifiantsInvalidesException::new);
        if (!passwordEncoder.matches(requete.motDePasse(), utilisateur.getMotDePasse())) {
            throw new IdentifiantsInvalidesException();
        }
        return reponse(utilisateur);
    }

    public Utilisateur getParEmail(String email) {
        return utilisateurRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RessourceIntrouvableException("Utilisateur introuvable"));
    }

    private AuthResponse reponse(Utilisateur utilisateur) {
        return new AuthResponse(jwtService.genererToken(utilisateur), UtilisateurResponse.depuis(utilisateur));
    }
}
