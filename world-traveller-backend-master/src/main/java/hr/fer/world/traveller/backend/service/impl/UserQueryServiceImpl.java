package hr.fer.world.traveller.backend.service.impl;

import com.auth0.jwt.interfaces.DecodedJWT;
import hr.fer.world.traveller.backend.command.EditUserProfileCommand;
import hr.fer.world.traveller.backend.controller.response.AuthenticatedUserResponse;
import hr.fer.world.traveller.backend.mapper.UserAuthenticatedUserResponseMapper;
import hr.fer.world.traveller.backend.model.user.Role;
import hr.fer.world.traveller.backend.model.user.RoleName;
import hr.fer.world.traveller.backend.model.user.User;
import hr.fer.world.traveller.backend.model.user.UserProfile;
import hr.fer.world.traveller.backend.repository.user.RefreshTokenRepository;
import hr.fer.world.traveller.backend.repository.user.RoleRepository;
import hr.fer.world.traveller.backend.repository.user.UserProfileRepository;
import hr.fer.world.traveller.backend.repository.user.UserRepository;
import hr.fer.world.traveller.backend.service.UserQueryService;
import hr.fer.world.traveller.backend.util.JwtUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class UserQueryServiceImpl implements UserQueryService {

    private final UserRepository userRepository;

    private final UserProfileRepository userProfileRepository;

    private final RoleRepository roleRepository;

    private final RefreshTokenRepository refreshTokenRepository;

    private final JwtUtil jwtUtil;

    private final UserAuthenticatedUserResponseMapper userAuthenticatedUserResponseMapper;

    public UserQueryServiceImpl(UserRepository userRepository, UserProfileRepository userProfileRepository,
                                RoleRepository roleRepository, RefreshTokenRepository refreshTokenRepository, JwtUtil jwtUtil,
                                UserAuthenticatedUserResponseMapper userAuthenticatedUserResponseMapper) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.roleRepository = roleRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtUtil = jwtUtil;
        this.userAuthenticatedUserResponseMapper = userAuthenticatedUserResponseMapper;
    }

    @Override
    @Transactional
    public AuthenticatedUserResponse getCurrentUser(String authorization) {
        final DecodedJWT jwt = jwtUtil.getDecodedFromAuthHeader(authorization);
        final User user = userRepository.getByUsername(jwt.getClaim(JwtUtil.USERNAME).asString());

        return userAuthenticatedUserResponseMapper.map(user);
    }

    @Override
    @Transactional
    public void edit(EditUserProfileCommand command, Long userId) {
        User user = userRepository.getUserById(userId);
        UserProfile userProfile = user.getUserProfile();

        userProfile.setProfileImage(command.getImage());
        userProfile.setPublic(command.getPublicProfile());
        user.setName(command.getName());
        user.setSurname(command.getSurname());
        user.setEmail(command.getEmail());

        userProfileRepository.save(userProfile);
        userRepository.save(user);
    }

    @Override
    public List<AuthenticatedUserResponse> getAllUsers(Long userId) {
        return userRepository.findAll().stream()
                .filter(user -> !user.getId().equals(userId))
                .map(userAuthenticatedUserResponseMapper::map)
                .toList();
    }

    @Override
    public void activateUser(Long userId) {
        User user = userRepository.getUserById(userId);
        user.setActive(true);
        userRepository.save(user);
    }

    @Override
    public void deactivateUser(Long userId) {
        User user = userRepository.getUserById(userId);
        user.setActive(false);
        userRepository.save(user);
    }

    @Override
    public void assignRole(Long userId, String roleName) {
        User user = userRepository.getUserById(userId);

        Role role = roleRepository.findByName(RoleName.valueOf(roleName))
                .orElseThrow(() -> new EntityNotFoundException(String.format("Role %s not found", roleName)));

        user.getRoles().add(role);
        userRepository.save(user);
    }

    @Override
    public void removeRole(Long userId, String roleName) {
        User user = userRepository.getUserById(userId);

        Role role = roleRepository.findByName(RoleName.valueOf(roleName))
                .orElseThrow(() -> new EntityNotFoundException(String.format("Role %s not found", roleName)));

        user.getRoles().remove(role);
        userRepository.save(user);
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.getUserById(userId);

        refreshTokenRepository.deleteAll(user.getRefreshTokens());
        userProfileRepository.delete(user.getUserProfile());
        userRepository.delete(user);
    }
}
