package hr.fer.world.traveller.backend.controller;

import hr.fer.world.traveller.backend.command.LoginCommand;
import hr.fer.world.traveller.backend.command.RegisterCommand;
import hr.fer.world.traveller.backend.controller.response.JwtAuthenticatedResponse;
import hr.fer.world.traveller.backend.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

@RestController
@RequestMapping(path = "/api/auth")
public class AuthenticationController {

    private final JwtService jwtService;

    public AuthenticationController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.OK)
    public JwtAuthenticatedResponse register(@Valid @RequestBody RegisterCommand command,
                                             HttpServletResponse response) {
        return jwtService.register(command, response);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public JwtAuthenticatedResponse getJwt(@Valid @RequestBody LoginCommand command, HttpServletResponse response) {
        return jwtService.login(command, response);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.OK)
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        jwtService.logout(request, response);
    }

    @PostMapping("/refresh")
    @ResponseStatus(HttpStatus.OK)
    public JwtAuthenticatedResponse refreshJwt(@RequestHeader(required = false) String authorization,
                                               @CookieValue(required = false) String refreshToken,
                                               HttpServletRequest request, HttpServletResponse response) {
        return jwtService.refreshToken(authorization, refreshToken, request, response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/refresh/deleteInactive")
    @ResponseStatus(HttpStatus.OK)
    public void deleteInactiveRefreshTokens() {
        jwtService.deleteInactiveRefreshTokens();
    }
}
