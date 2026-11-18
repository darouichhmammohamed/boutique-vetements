package com.boutique.backend.exception;

public class IdentifiantsInvalidesException extends RuntimeException {

    public IdentifiantsInvalidesException() {
        super("Email ou mot de passe incorrect");
    }
}
