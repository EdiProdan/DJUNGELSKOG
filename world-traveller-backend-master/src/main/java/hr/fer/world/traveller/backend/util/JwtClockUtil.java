package hr.fer.world.traveller.backend.util;

import com.auth0.jwt.interfaces.DecodedJWT;
import hr.fer.world.traveller.backend.model.user.RefreshToken;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public final class JwtClockUtil {

    public static Instant now() {
        return ZonedDateTime.now(ZoneId.of("UTC")).toInstant();
    }

    public static boolean tokenExpired(DecodedJWT jwt) {
        return jwt.getExpiresAtAsInstant() != null && jwt.getExpiresAtAsInstant().toEpochMilli() < now().toEpochMilli();
    }

    public static boolean refreshTokenExpired(RefreshToken refreshToken) {
        return refreshToken.getExpires() < now().toEpochMilli();
    }

}
