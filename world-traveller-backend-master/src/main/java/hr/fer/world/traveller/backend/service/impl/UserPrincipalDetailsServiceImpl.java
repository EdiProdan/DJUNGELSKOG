package hr.fer.world.traveller.backend.service.impl;

import hr.fer.world.traveller.backend.model.principal.UserPrincipal;
import hr.fer.world.traveller.backend.model.user.User;
import hr.fer.world.traveller.backend.repository.user.UserRepository;
import hr.fer.world.traveller.backend.service.UserPrincipalDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserPrincipalDetailsServiceImpl implements UserPrincipalDetailsService {

    private final UserRepository userRepository;

    public UserPrincipalDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserPrincipal loadUserByUsername(String username) throws UsernameNotFoundException {
        final User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));

        return new UserPrincipal(user);
    }
}
