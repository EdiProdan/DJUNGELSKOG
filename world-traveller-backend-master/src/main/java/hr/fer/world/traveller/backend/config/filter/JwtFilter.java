package hr.fer.world.traveller.backend.config.filter;

import com.auth0.jwt.interfaces.DecodedJWT;
import hr.fer.world.traveller.backend.model.principal.UserPrincipal;
import hr.fer.world.traveller.backend.service.UserPrincipalDetailsService;
import hr.fer.world.traveller.backend.util.JwtUtil;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    private final UserPrincipalDetailsService userPrincipalDetailsService;

    public JwtFilter(JwtUtil jwtUtil, UserPrincipalDetailsService userPrincipalDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userPrincipalDetailsService = userPrincipalDetailsService;
    }

    @Override
    @Transactional
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        final String auth = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (auth == null || !auth.startsWith(JwtUtil.AUTH_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = jwtUtil.getFromAuthHeader(auth);
        Optional<DecodedJWT> jwt = jwtUtil.validate(token);
        if (jwt.isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }

        final UserPrincipal userPrincipal = userPrincipalDetailsService.loadUserByUsername(
                jwt.get().getClaim(JwtUtil.USERNAME).asString());

        final UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userPrincipal, null, userPrincipal.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        filterChain.doFilter(request, response);
    }
}
