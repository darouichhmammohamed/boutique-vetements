package com.boutique.backend.exception;

import java.time.LocalDateTime;

public record ErreurResponse(
        int status,
        String message,
        LocalDateTime date
) {}
