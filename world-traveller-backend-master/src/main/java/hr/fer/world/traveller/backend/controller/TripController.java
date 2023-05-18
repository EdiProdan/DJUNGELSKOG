package hr.fer.world.traveller.backend.controller;

import hr.fer.world.traveller.backend.controller.request.TripCreateRequest;
import hr.fer.world.traveller.backend.controller.response.TripResponse;
import hr.fer.world.traveller.backend.service.TripService;
import hr.fer.world.traveller.backend.util.UserContextUtil;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(path = "/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public void postTrip(@Valid @RequestBody TripCreateRequest request) {
        Long userId = UserContextUtil.getUser().getId();

        if(request.getLocationIsSuggestion()){
            tripService.postTripWithSuggestedLocation(userId, request);
        } else {
            tripService.postTrip(userId, request);
        }
    }

    @PostMapping("/{id}/like")
    @ResponseStatus(HttpStatus.OK)
    public void likeTrip(@PathVariable Long id) {
        Long userId = UserContextUtil.getUser().getId();

        tripService.likeTrip(userId, id);
    }

    @PostMapping("/{id}/unlike")
    @ResponseStatus(HttpStatus.OK)
    public void unlikeTrip(@PathVariable Long id) {
        Long userId = UserContextUtil.getUser().getId();

        tripService.unlikeTrip(userId, id);
    }

    @GetMapping("/social")
    @ResponseStatus(HttpStatus.OK)
    public List<TripResponse> getFriendTrips()  {
        Long tokenUserId = UserContextUtil.getUser().getId();

        return tripService.getAllFriendTrips(tokenUserId);
    }


}
