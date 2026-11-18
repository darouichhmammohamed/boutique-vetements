package com.boutique.backend.exception;

import java.time.LocalDateTime;
import java.util.Map;

public record ErreurValidationResponse(
        int status,
        String message,
        Map<String, String> erreurs,
        LocalDateTime date
) {
}
