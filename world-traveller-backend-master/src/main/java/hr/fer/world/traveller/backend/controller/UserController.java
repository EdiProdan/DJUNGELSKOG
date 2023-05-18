package hr.fer.world.traveller.backend.controller;

import hr.fer.world.traveller.backend.controller.request.AssignRoleRequest;
import hr.fer.world.traveller.backend.controller.request.BasicPageRequest;
import hr.fer.world.traveller.backend.controller.response.AuthenticatedUserResponse;
import hr.fer.world.traveller.backend.controller.response.TripResponse;
import hr.fer.world.traveller.backend.service.TripService;
import hr.fer.world.traveller.backend.service.UserQueryService;
import hr.fer.world.traveller.backend.util.UserContextUtil;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(path = "/api/user")
public class UserController {

    private final UserQueryService userQueryService;

    private final TripService tripService;

    public UserController(UserQueryService userQueryService, TripService tripService) {
        this.userQueryService = userQueryService;
        this.tripService = tripService;
    }

    @GetMapping("/current")
    @ResponseStatus(HttpStatus.OK)
    public AuthenticatedUserResponse getCurrentUser(@RequestHeader String authorization) {
        return userQueryService.getCurrentUser(authorization);
    }

    @PostMapping("/{requestedUserId}/trips/recent")
    @ResponseStatus(HttpStatus.OK)
    public List<TripResponse> register(@PathVariable("requestedUserId") Long requestedUserId,
                                       @Valid @RequestBody BasicPageRequest pageRequest)  {
        Long tokenUserId = UserContextUtil.getUser().getId();

        return tripService.getRecentTrips(tokenUserId, requestedUserId, pageRequest);
    }

    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public List<AuthenticatedUserResponse> getAllUsers() {
        Long userId = UserContextUtil.getUser().getId();

        return userQueryService.getAllUsers(userId);
    }

    @PutMapping("/{id}/activate")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public void activateUser(@PathVariable Long id) {
        userQueryService.activateUser(id);
    }

    @PutMapping("/{id}/deactivate")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public void deactivateUser(@PathVariable Long id) {
        userQueryService.deactivateUser(id);
    }

    @PutMapping("/{id}/assignRole")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public void assignRole(@PathVariable Long id, @RequestBody AssignRoleRequest request) {
        userQueryService.assignRole(id, request.getRole());
    }

    @PutMapping("/{id}/removeRole")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public void removeRole(@PathVariable Long id, @RequestBody AssignRoleRequest request) {
        userQueryService.removeRole(id, request.getRole());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable Long id) {
        userQueryService.deleteUser(id);
    }
}
