package hr.fer.world.traveller.backend.service;

import hr.fer.world.traveller.backend.command.EditUserProfileCommand;
import hr.fer.world.traveller.backend.controller.response.AuthenticatedUserResponse;

import java.util.List;

public interface UserQueryService {

    AuthenticatedUserResponse getCurrentUser(String authorization);

    void edit(EditUserProfileCommand command, Long userId);

    List<AuthenticatedUserResponse> getAllUsers(Long userId);

    void activateUser(Long userId);

    void deactivateUser(Long userId);

    void assignRole(Long userId, String roleName);

    void removeRole(Long userId, String roleName);

    void deleteUser(Long userId);
}
