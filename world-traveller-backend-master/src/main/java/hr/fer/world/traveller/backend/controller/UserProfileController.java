package hr.fer.world.traveller.backend.controller;

import hr.fer.world.traveller.backend.command.EditUserProfileCommand;
import hr.fer.world.traveller.backend.controller.response.UserProfilePictureResponse;
import hr.fer.world.traveller.backend.controller.response.UserProfileResponse;
import hr.fer.world.traveller.backend.service.UserProfileCommandService;
import hr.fer.world.traveller.backend.service.UserProfileQueryService;
import hr.fer.world.traveller.backend.service.UserQueryService;
import hr.fer.world.traveller.backend.util.UserContextUtil;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(path = "/api/userProfile")
public class UserProfileController {

    private final UserProfileQueryService userProfileQueryService;
    private final UserQueryService userQueryService;

    private final UserProfileCommandService userProfileCommandService;

    public UserProfileController(UserProfileQueryService userProfileQueryService, UserQueryService userQueryService, UserProfileCommandService userProfileCommandService) {
        this.userProfileQueryService = userProfileQueryService;
        this.userQueryService = userQueryService;
        this.userProfileCommandService = userProfileCommandService;
    }

    @GetMapping
    public UserProfileResponse getCurrentUserProfile() {
        Long userId = UserContextUtil.getUser().getId();

        return userProfileQueryService.getUserProfileById(userId);
    }

    @GetMapping("/all")
    public List<UserProfileResponse> getAllUserProfiles() {
        return userProfileQueryService.getAllUserProfiles();
    }

    @GetMapping("/{id}")
    public UserProfileResponse getUserProfile(@PathVariable Long id) {
        return userProfileQueryService.getUserProfileById(id);
    }

    @PostMapping("/edit")
    @ResponseStatus(HttpStatus.OK)
    public void editUserProfile (@Valid @RequestBody EditUserProfileCommand command) {
        Long userId = UserContextUtil.getUser().getId();

        userQueryService.edit(command, userId);

    }

    @GetMapping("/{id}/picture")
    public UserProfilePictureResponse getUserProfilePicture(@PathVariable Long id) {
        return new UserProfilePictureResponse(userProfileQueryService.getUserProfilePictureById(id));
    }

    @GetMapping("/requests/sent")
    public List<Long> getAllFriendRequests(){
        Long userId = UserContextUtil.getUser().getId();

        return userProfileQueryService.getAllFriendRequests(userId);
    }

    @PostMapping("/{id}/addFriend")
    public void addUserAsFriend(@PathVariable Long id){
        Long userId = UserContextUtil.getUser().getId();

        userProfileCommandService.addFriend(userId, id);
    }

    @PostMapping("/{id}/removeFriend")
    public void removeUserAsFriend(@PathVariable Long id){
        Long userId = UserContextUtil.getUser().getId();

        userProfileCommandService.removeFriend(userId, id);
    }

    @PostMapping("/{id}/addCloseFriend")
    public void addUserAsCloseFriend(@PathVariable Long id){
        Long userId = UserContextUtil.getUser().getId();

        userProfileCommandService.addCloseFriend(userId, id);
    }

    @PostMapping("/{id}/removeCloseFriend")
    public void removeUserAsCloseFriend(@PathVariable Long id){
        Long userId = UserContextUtil.getUser().getId();

        userProfileCommandService.removeCloseFriend(userId, id);
    }
}
