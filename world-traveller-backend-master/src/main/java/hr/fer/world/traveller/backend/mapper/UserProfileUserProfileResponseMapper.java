package hr.fer.world.traveller.backend.mapper;

import hr.fer.world.traveller.backend.controller.response.UserProfileResponse;
import hr.fer.world.traveller.backend.controller.response.UserResponse;
import hr.fer.world.traveller.backend.model.user.UserProfile;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class UserProfileUserProfileResponseMapper implements Mapper<UserProfile, UserProfileResponse> {

    private final GenericMapper genericMapper;

    public UserProfileUserProfileResponseMapper(GenericMapper genericMapper) {
        this.genericMapper = genericMapper;
    }

    @Override
    public UserProfileResponse map(UserProfile from) {
        UserResponse userResponse = genericMapper.map(from.getUser(), UserResponse.class);
        return new UserProfileResponse(
                from.getUserId(),
                from.isPublic(),
                userResponse,
                from.getFriends().stream()
                        .map(userProfile -> genericMapper.map(userProfile.getUser(), UserResponse.class))
                        .collect(Collectors.toSet())
        );
    }
}
