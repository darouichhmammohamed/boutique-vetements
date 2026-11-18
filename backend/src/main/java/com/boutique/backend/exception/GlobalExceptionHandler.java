package com.boutique.backend.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RessourceIntrouvableException.class)
    public ResponseEntity<ErreurResponse> handleIntrouvable(RessourceIntrouvableException ex) {
        return construire(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErreurResponse> handleInvalide(IllegalArgumentException ex) {
        return construire(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(IdentifiantsInvalidesException.class)
    public ResponseEntity<ErreurResponse> handleIdentifiants(IdentifiantsInvalidesException ex) {
        return construire(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErreurResponse> handleConflit(DataIntegrityViolationException ex) {
        return construire(HttpStatus.CONFLICT,
                "Opération impossible : cette donnée est liée à d'autres données");
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErreurResponse> handleJsonIllisible(HttpMessageNotReadableException ex) {
        return construire(HttpStatus.BAD_REQUEST, "Le corps de la requête est invalide");
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErreurResponse> handleParametreManquant(MissingServletRequestParameterException ex) {
        return construire(HttpStatus.BAD_REQUEST, "Paramètre manquant : " + ex.getParameterName());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErreurResponse> handleTypeInvalide(MethodArgumentTypeMismatchException ex) {
        return construire(HttpStatus.BAD_REQUEST, "Valeur invalide pour : " + ex.getName());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErreurValidationResponse> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> erreurs = new LinkedHashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            erreurs.putIfAbsent(fe.getField(), fe.getDefaultMessage());
        }
        ErreurValidationResponse reponse = new ErreurValidationResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Données invalides",
                erreurs,
                LocalDateTime.now());
        return ResponseEntity.badRequest().body(reponse);
    }

    private ResponseEntity<ErreurResponse> construire(HttpStatus status, String message) {
        ErreurResponse erreur = new ErreurResponse(status.value(), message, LocalDateTime.now());
        return ResponseEntity.status(status).body(erreur);
    }
}
