package hr.fer.world.traveller.backend.controller.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private Long userId;

    private boolean isPublic;

    private UserResponse user;

    private Set<UserResponse> friends;
}
