package hr.fer.world.traveller.backend.service;

import hr.fer.world.traveller.backend.controller.request.BasicPageRequest;
import hr.fer.world.traveller.backend.controller.request.TripCreateRequest;
import hr.fer.world.traveller.backend.controller.response.TripResponse;

import java.util.List;

public interface TripService {
    void postTripWithSuggestedLocation(Long userId, TripCreateRequest request);

    void postTrip(Long userId, TripCreateRequest request);

    List<TripResponse> getRecentTrips(Long tokenUserId, Long requestedUserId, BasicPageRequest pageRequest);

    void likeTrip(Long tokenUserId, Long tripId);

    void unlikeTrip(Long tokenUserId, Long tripId);

    List<TripResponse> getAllFriendTrips(Long tokenUserId);
}
