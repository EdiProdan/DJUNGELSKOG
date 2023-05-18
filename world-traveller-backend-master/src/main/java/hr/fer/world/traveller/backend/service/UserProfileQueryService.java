package hr.fer.world.traveller.backend.service;

import hr.fer.world.traveller.backend.controller.response.UserProfileResponse;

import java.util.List;

public interface UserProfileQueryService {

    UserProfileResponse getUserProfileById(Long userId);

    String getUserProfilePictureById(Long id);

    List<Long> getAllFriendRequests(Long userId);

    List<UserProfileResponse> getAllUserProfiles();

}
