package hr.fer.world.traveller.backend.service.impl;

import com.auth0.jwt.interfaces.DecodedJWT;
import hr.fer.world.traveller.backend.command.LoginCommand;
import hr.fer.world.traveller.backend.command.RegisterCommand;
import hr.fer.world.traveller.backend.controller.response.JwtAuthenticatedResponse;
import hr.fer.world.traveller.backend.exception.EntityFoundException;
import hr.fer.world.traveller.backend.mapper.GenericMapper;
import hr.fer.world.traveller.backend.model.principal.UserPrincipal;
import hr.fer.world.traveller.backend.model.user.RefreshToken;
import hr.fer.world.traveller.backend.model.user.Role;
import hr.fer.world.traveller.backend.model.user.User;
import hr.fer.world.traveller.backend.model.user.UserProfile;
import hr.fer.world.traveller.backend.repository.user.RefreshTokenRepository;
import hr.fer.world.traveller.backend.repository.user.RoleRepository;
import hr.fer.world.traveller.backend.repository.user.UserProfileRepository;
import hr.fer.world.traveller.backend.repository.user.UserRepository;
import hr.fer.world.traveller.backend.service.JwtService;
import hr.fer.world.traveller.backend.util.JwtClockUtil;
import hr.fer.world.traveller.backend.util.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class JwtServiceImpl implements JwtService {

    private static final String CREDENTIALS_EXPIRED = "Credentials expired";

    private final AuthenticationManager authenticationManager;

    private final PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;

    private final UserProfileRepository userProfileRepository;

    private final RefreshTokenRepository refreshTokenRepository;

    private final RoleRepository roleRepository;

    private final JwtUtil jwtUtil;

    private final GenericMapper genericMapper;

    public JwtServiceImpl(AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder,
                          UserRepository userRepository, UserProfileRepository userProfileRepository, RefreshTokenRepository refreshTokenRepository,
                          RoleRepository roleRepository, JwtUtil jwtUtil, GenericMapper genericMapper) {
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.roleRepository = roleRepository;
        this.jwtUtil = jwtUtil;
        this.genericMapper = genericMapper;
    }

    @Override
    @Transactional
    public JwtAuthenticatedResponse register(RegisterCommand command, HttpServletResponse response) {
        final Optional<User> existingUser = userRepository.findByUsername(command.getUsername());
        if (existingUser.isPresent()) {
            throw new EntityFoundException(User.class, "username", command.getUsername());
        }

        final User user = genericMapper.map(command, User.class);
        user.setPassword(passwordEncoder.encode(command.getPassword()));
        user.setActive(true);
        user.setRefreshTokens(new HashSet<>());

        final Set<Role> defaultRoles = roleRepository.findByNameIn(User.getDefaultRoles());
        user.setRoles(defaultRoles);
        final RefreshToken refreshToken = createNewRefreshToken(user, response);
        user.getRefreshTokens().add(refreshToken);
        userRepository.save(user);
        refreshTokenRepository.save(refreshToken);

        UserProfile userProfile = new UserProfile();
        userProfile.setUserId(user.getId());
        userProfile.setPublic(true);
        userProfileRepository.save(userProfile);

        return new JwtAuthenticatedResponse(
                jwtUtil.createToken(user.getUsername(), defaultRoles),
                refreshToken.getUUID(),
                refreshToken.getExpires()
        );
    }

    @Override
    @Transactional
    public JwtAuthenticatedResponse login(LoginCommand command, HttpServletResponse response)
            throws BadCredentialsException {
        final Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(command.getUsername(), command.getPassword()));
        UserPrincipal userPrincipal = (UserPrincipal) authenticate.getPrincipal();

        final User user = userRepository.getByUsername(userPrincipal.getUsername());

        final RefreshToken refreshToken = createNewRefreshToken(user, response);
        refreshTokenRepository.save(refreshToken);

        return new JwtAuthenticatedResponse(
                jwtUtil.createToken(user.getUsername(), user.getRoles()),
                refreshToken.getUUID(),
                refreshToken.getExpires()
        );
    }

    @Override
    @Transactional
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        SecurityContextHolder.clearContext();

        // probably unnecessary
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        if (request.getCookies() == null) {
            return;
        }
        for (Cookie cookie : request.getCookies()) {
            cookie.setMaxAge(0);
            if (cookie.getName().equals(JwtUtil.REFRESH_TOKEN)) {
                refreshTokenRepository.deleteByUUID(cookie.getValue());
            }
            response.addCookie(cookie);
        }
    }

    @Override
    @Transactional
    public JwtAuthenticatedResponse refreshToken(String authorization, String refreshTokenUUID,
                                                 HttpServletRequest request,
                                                 HttpServletResponse response) {
        Optional<RefreshToken> persistedToken = refreshTokenRepository.findByUUID(refreshTokenUUID);
        if (persistedToken.isEmpty()) {
            throw new CredentialsExpiredException(CREDENTIALS_EXPIRED);
        }
        RefreshToken refreshToken = persistedToken.get();
        if (JwtClockUtil.refreshTokenExpired(refreshToken)) {
            refreshTokenRepository.delete(refreshToken);
            throw new CredentialsExpiredException(CREDENTIALS_EXPIRED);
        }

        final User user = refreshToken.getUser();
        final RefreshToken newRefreshToken = createNewRefreshToken(user, response);

        refreshTokenRepository.delete(refreshToken);
        refreshTokenRepository.save(newRefreshToken);

        final Optional<DecodedJWT> decodedJWT = jwtUtil.validate(jwtUtil.getFromAuthHeader(authorization));
        if (decodedJWT.isEmpty()) {
            return new JwtAuthenticatedResponse(
                    jwtUtil.createToken(user.getUsername(), user.getRoles()),
                    newRefreshToken.getUUID(),
                    newRefreshToken.getExpires()
            );
        }

        DecodedJWT jwt = decodedJWT.get();

        return new JwtAuthenticatedResponse(
                // should not happen, just an additional measure to prevent generating excess JWTs
                JwtClockUtil.tokenExpired(jwt)
                        ? jwtUtil.createToken(user.getUsername(), user.getRoles())
                        : jwt.getToken(),
                newRefreshToken.getUUID(),
                newRefreshToken.getExpires()
        );
    }

    @Override
    @Transactional
    public void deleteInactiveRefreshTokens() {
        refreshTokenRepository.deleteAllInactive();
    }

    private RefreshToken createNewRefreshToken(User user, HttpServletResponse response) {
        final String tokenUUID = UUID.randomUUID().toString();

        final Cookie cookie = new Cookie(JwtUtil.REFRESH_TOKEN, tokenUUID);
        cookie.setHttpOnly(true);
        response.addCookie(cookie);

        return new RefreshToken(
                tokenUUID,
                jwtUtil.getRefreshExpiresAt(),
                jwtUtil.getAccessExpiresAt(),
                user
        );
    }
}
