package hr.fer.world.traveller.backend.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import hr.fer.world.traveller.backend.model.user.Role;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public final class JwtUtil {

    public static final String AUTH_PREFIX = "Bearer ";

    public static final String USERNAME = "username";

    public static final String ROLES = "roles";

    public static final String REFRESH_TOKEN = "refreshToken";

    private final String issuer;

    private final Algorithm algorithm;

    // 30 minutes
    private final long accessExpiresAfter = 30 * 60 * 1000L;

    // 30 days
    private final long refreshExpiresAfter = 30 * 24 * 60 * 60 * 1000L;

    public JwtUtil(@Value("${spring.security.jwt.secret}") String secret,
                   @Value("${spring.security.jwt.issuer}") String issuer) {
        this.issuer = issuer;
        this.algorithm = Algorithm.HMAC256(secret);
    }

    public String createToken(String username, Collection<Role> roles) throws JWTCreationException {
        Map<String, String> payload = new HashMap<>();
        payload.put(USERNAME, username);
        payload.put(ROLES, roles.stream().map(role -> role.getName().name()).collect(Collectors.joining(",")));

        return JWT.create()
                .withIssuer(issuer)
                .withIssuedAt(JwtClockUtil.now())
                .withExpiresAt(JwtClockUtil.now().plus(accessExpiresAfter, ChronoUnit.MILLIS))
                .withNotBefore(JwtClockUtil.now())
                .withPayload(payload)
                .sign(algorithm);
    }

    public Optional<DecodedJWT> validate(String token) throws JWTVerificationException {
        JWTVerifier verifier = JWT.require(algorithm)
                .withIssuer(issuer)
                .build();

        try {
            return Optional.of(verifier.verify(token));
        } catch (JWTVerificationException e) {
            return Optional.empty();
        }
    }

    public String getFromAuthHeader(String authorization) {
        return authorization.replace(AUTH_PREFIX, "").trim();
    }

    public DecodedJWT getDecodedFromAuthHeader(String authorization) {
        return JWT.decode(getFromAuthHeader(authorization));
    }

    public long getAccessExpiresAt() {
        return JwtClockUtil.now().plus(accessExpiresAfter, ChronoUnit.MILLIS).toEpochMilli();
    }

    public long getRefreshExpiresAt() {
        return JwtClockUtil.now().plus(refreshExpiresAfter, ChronoUnit.MILLIS).toEpochMilli();
    }
}
