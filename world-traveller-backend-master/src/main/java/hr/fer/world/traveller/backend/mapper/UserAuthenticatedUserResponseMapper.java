package hr.fer.world.traveller.backend.mapper;

import hr.fer.world.traveller.backend.controller.response.AuthenticatedUserResponse;
import hr.fer.world.traveller.backend.model.user.User;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class UserAuthenticatedUserResponseMapper implements Mapper<User, AuthenticatedUserResponse> {

    private final GenericMapper genericMapper;

    public UserAuthenticatedUserResponseMapper(GenericMapper genericMapper) {
        this.genericMapper = genericMapper;
    }

    @Override
    public AuthenticatedUserResponse map(User from) {
        AuthenticatedUserResponse authenticatedUserResponse = genericMapper.map(from, AuthenticatedUserResponse.class);

        authenticatedUserResponse.setRoles(from.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet()));

        return authenticatedUserResponse;
    }
}
