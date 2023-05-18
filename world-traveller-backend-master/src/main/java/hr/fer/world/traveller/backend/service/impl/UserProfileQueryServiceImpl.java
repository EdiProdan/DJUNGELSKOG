package hr.fer.world.traveller.backend.service.impl;

import hr.fer.world.traveller.backend.controller.response.UserProfileResponse;
import hr.fer.world.traveller.backend.mapper.UserProfileUserProfileResponseMapper;
import hr.fer.world.traveller.backend.model.user.UserProfile;
import hr.fer.world.traveller.backend.repository.user.UserProfileRepository;
import hr.fer.world.traveller.backend.service.UserProfileQueryService;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserProfileQueryServiceImpl implements UserProfileQueryService {

    private final UserProfileRepository userProfileRepository;

    private final UserProfileUserProfileResponseMapper userProfileUserProfileResponseMapper;

    public UserProfileQueryServiceImpl(UserProfileRepository userProfileRepository,
                                       UserProfileUserProfileResponseMapper userProfileUserProfileResponseMapper) {
        this.userProfileRepository = userProfileRepository;
        this.userProfileUserProfileResponseMapper = userProfileUserProfileResponseMapper;
    }

    @Override
    public UserProfileResponse getUserProfileById(Long userId) {
        final UserProfile userProfile = userProfileRepository.findById(userId).orElseThrow();

        return userProfileUserProfileResponseMapper.map(userProfile);
    }

    @Override
    public String getUserProfilePictureById(Long id) {
        byte[] image = userProfileRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User profile with the given id not found."))
                .getProfileImage();

        if (image == null) {
            return null;
        }

        return Base64.getEncoder().encodeToString(image);
    }

    @Override
    public List<UserProfileResponse> getAllUserProfiles() {
        return userProfileRepository.findAll().stream()
                .map(userProfileUserProfileResponseMapper::map)
                .collect(Collectors.toList());
    }

    @Override
    public List<Long> getAllFriendRequests(Long userId) {
        UserProfile userProfileFrom = userProfileRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with the given id not found"));

        return userProfileFrom.getFriendsSent().stream()
                .map(f -> f.getToUser().getUserId())
                .collect(Collectors.toList());
    }

}
