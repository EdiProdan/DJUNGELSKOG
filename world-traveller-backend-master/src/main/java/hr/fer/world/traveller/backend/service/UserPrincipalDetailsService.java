package hr.fer.world.traveller.backend.service;

import hr.fer.world.traveller.backend.model.principal.UserPrincipal;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface UserPrincipalDetailsService extends UserDetailsService {

    UserPrincipal loadUserByUsername(String username) throws UsernameNotFoundException;
}
