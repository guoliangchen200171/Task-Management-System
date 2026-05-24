package taskmanagementsystem.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import taskmanagementsystem.dto.Login;
import taskmanagementsystem.dto.Register;
import taskmanagementsystem.model.User;
import taskmanagementsystem.security.AuthResponse;
import taskmanagementsystem.service.AuthService;

import java.util.Optional;

@RestController
@RequestMapping("api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody Register register){
        return ResponseEntity.ok(authService.register(register));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody Login login){
        // #region agent log
        debugLog("AuthController.login", "entry", java.util.Map.of("username", login.getUsername(), "hypothesisId", "H-E"), "H-E");
        // #endregion
        Optional<User> user = authService.login(login);
        if (user.isPresent()){
            User presentUser = user.get();
            // #region agent log
            debugLog("AuthController.login", "success", java.util.Map.of("userId", presentUser.getId(), "role", presentUser.getRole(), "hypothesisId", "H-E"), "H-E");
            // #endregion
            return ResponseEntity.ok(new AuthResponse(presentUser.getId(), presentUser.getUsername(), presentUser.getRole()));
        }
        // #region agent log
        debugLog("AuthController.login", "unauthorized", java.util.Map.of("hypothesisId", "H-C"), "H-C");
        // #endregion
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // #region agent log
    private static void debugLog(String location, String message, java.util.Map<String, Object> data, String hypothesisId) {
        try {
            String line = String.format(
                "{\"sessionId\":\"c6bb02\",\"location\":\"%s\",\"message\":\"%s\",\"data\":%s,\"timestamp\":%d,\"hypothesisId\":\"%s\",\"runId\":\"pre-fix\"}%n",
                location, message, new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(data), System.currentTimeMillis(), hypothesisId
            );
            java.nio.file.Files.writeString(java.nio.file.Path.of("debug-c6bb02.log"), line, java.nio.file.StandardOpenOption.CREATE, java.nio.file.StandardOpenOption.APPEND);
        } catch (Exception ignored) {}
    }
    // #endregion
}