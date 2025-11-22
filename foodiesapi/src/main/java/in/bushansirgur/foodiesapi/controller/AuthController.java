package in.bushansirgur.foodiesapi.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import in.bushansirgur.foodiesapi.io.AuthenticationRequest;
import in.bushansirgur.foodiesapi.io.AuthenticationResponse;
import in.bushansirgur.foodiesapi.entity.UserEntity;
import in.bushansirgur.foodiesapi.repository.UserRepository;
import in.bushansirgur.foodiesapi.service.AppUserDetailsService;
import in.bushansirgur.foodiesapi.util.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@AllArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    private static final String GOOGLE_CLIENT_ID = "776825484594-3mnnhvoklubkc1m840d1qq7dfn1i0fl7.apps.googleusercontent.com";

    // ----------------- Email/Password Login -----------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) {
        try {
            authenticationManager.authenticate(
                //returns an authentication object
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            final String jwtToken = jwtUtil.generateToken(userDetails);

            String role = userDetails.getAuthorities().stream()
                    .findFirst()
                    .map(GrantedAuthority::getAuthority)
                    .orElse("ROLE_USER");

            return ResponseEntity.ok(new AuthenticationResponse(request.getEmail(), jwtToken, role));

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Login failed: " + e.getMessage());
            return ResponseEntity.status(401).body(error);
        }
    }

    // ----------------- Google Login -----------------
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleTokenRequest tokenRequest) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance()
            ).setAudience(Collections.singletonList(GOOGLE_CLIENT_ID)).build();

            GoogleIdToken idToken = verifier.verify(tokenRequest.getToken());
            if (idToken == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid Google ID token");
                return ResponseEntity.status(401).body(error);
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");

            // Check if user exists in DB
            UserEntity user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                user = new UserEntity();
                user.setEmail(email);
                user.setName(name);
                user.setPassword(""); // OAuth users
                user.setRole("USER"); // default role
                userRepository.save(user);
            }

            // Generate JWT
            final UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            final String jwtToken = jwtUtil.generateToken(userDetails);

            String role = userDetails.getAuthorities().stream()
                    .findFirst()
                    .map(GrantedAuthority::getAuthority)
                    .orElse("ROLE_USER");

            return ResponseEntity.ok(new AuthenticationResponse(email, jwtToken, role));

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", "Google login failed: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // ----------------- Google Token Request DTO -----------------
    public static class GoogleTokenRequest {
        private String token;
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
    }
}