package hr.fer.world.traveller.backend.controller.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtAuthenticatedResponse {

    private String token;

    private String refreshToken;

    private Long refreshExpires;
}
