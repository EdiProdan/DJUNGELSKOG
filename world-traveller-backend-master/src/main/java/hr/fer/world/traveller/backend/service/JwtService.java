package hr.fer.world.traveller.backend.service;

import hr.fer.world.traveller.backend.command.LoginCommand;
import hr.fer.world.traveller.backend.command.RegisterCommand;
import hr.fer.world.traveller.backend.controller.response.JwtAuthenticatedResponse;
import org.springframework.security.authentication.BadCredentialsException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface JwtService {

    JwtAuthenticatedResponse register(RegisterCommand command, HttpServletResponse response);

    JwtAuthenticatedResponse login(LoginCommand command, HttpServletResponse response) throws BadCredentialsException;

    void logout(HttpServletRequest request, HttpServletResponse response);

    JwtAuthenticatedResponse refreshToken(String authorization, String refreshTokenUUID,
                                                          HttpServletRequest request, HttpServletResponse response);

    void deleteInactiveRefreshTokens();
}
