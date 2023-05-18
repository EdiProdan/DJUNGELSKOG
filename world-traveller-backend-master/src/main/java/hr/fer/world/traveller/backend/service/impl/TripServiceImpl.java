package hr.fer.world.traveller.backend.service.impl;

import hr.fer.world.traveller.backend.controller.request.BasicPageRequest;
import hr.fer.world.traveller.backend.controller.request.LocationRequest;
import hr.fer.world.traveller.backend.controller.request.TripCreateRequest;
import hr.fer.world.traveller.backend.controller.response.LocationResponse;
import hr.fer.world.traveller.backend.controller.response.TripResponse;
import hr.fer.world.traveller.backend.mapper.GenericMapper;
import hr.fer.world.traveller.backend.model.location.City;
import hr.fer.world.traveller.backend.model.location.Location;
import hr.fer.world.traveller.backend.model.trip.Trip;
import hr.fer.world.traveller.backend.model.user.RoleName;
import hr.fer.world.traveller.backend.model.user.User;
import hr.fer.world.traveller.backend.repository.location.CityRepository;
import hr.fer.world.traveller.backend.repository.location.LocationRepository;
import hr.fer.world.traveller.backend.repository.trip.TripRepository;
import hr.fer.world.traveller.backend.repository.user.UserRepository;
import hr.fer.world.traveller.backend.service.BadgeService;
import hr.fer.world.traveller.backend.service.TripService;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;

    private final LocationRepository locationRepository;

    private final CityRepository cityRepository;

    private final UserRepository userRepository;

    private final BadgeService badgeService;

    private final GenericMapper mapper;

    public TripServiceImpl(TripRepository tripRepository, LocationRepository locationRepository, CityRepository cityRepository, UserRepository userRepository, BadgeService badgeService, GenericMapper mapper) {
        this.tripRepository = tripRepository;
        this.locationRepository = locationRepository;
        this.cityRepository = cityRepository;
        this.userRepository = userRepository;
        this.badgeService = badgeService;
        this.mapper = mapper;
    }

    @Override
    @Transactional
    public void postTripWithSuggestedLocation(Long userId, TripCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(EntityNotFoundException::new);

        LocationRequest locationRequest = request.getLocationSuggestion();
        Optional<City> city = cityRepository.findByName(locationRequest.getCityName());

        Location location = mapper.map(request.getLocationSuggestion(), Location.class);
        location.setCity(city.orElse(null));
        location.setSuggestedByUser(user);
        location.setSuggestion(true);
        location.setXCoordinate(request.getLocationSuggestion().getLng());
        location.setYCoordinate(request.getLocationSuggestion().getLat());

        locationRepository.save(location);

        Trip trip = mapper.map(request, Trip.class);
        trip.setUserProfile(user.getUserProfile());
        trip.setLocation(location);

        tripRepository.save(trip);
    }

    @Override
    @Transactional
    public void postTrip(Long userId, TripCreateRequest request) {
        User user = userRepository.findById(userId).orElseThrow(EntityNotFoundException::new);
        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(EntityNotFoundException::new);

        Trip trip = mapper.map(request, Trip.class);
        trip.setUserProfile(user.getUserProfile());
        trip.setSolo(request.getSolo());
        trip.setLocation(location);

        tripRepository.save(trip);

        badgeService.markCompletedBadges(userId, location.getId());
    }

    @Override
    @Transactional
    public List<TripResponse> getRecentTrips(Long tokenUserId, Long requestedUserId, BasicPageRequest pageRequest){

        User tokenUser = userRepository.findById(tokenUserId)
                .orElseThrow(EntityNotFoundException::new);
        User requestedUser = userRepository.findById(requestedUserId)
                .orElseThrow(EntityNotFoundException::new);

        if(!tokenUserId.equals(requestedUserId)){
            if(tokenUser.getRoles().stream().noneMatch(role -> role.getName().equals(RoleName.ADMIN))){
                if(!requestedUser.getUserProfile().isPublic() &&
                        !requestedUser.getUserProfile().isFriendsWith(tokenUser.getUserProfile())){
                    throw new AccessDeniedException("You are not friends with the given user");
                }
            }
        }

        return tripRepository.findByUserProfile_UserIdOrderByDateVisitedDesc(
                requestedUserId,
                PageRequest.of(pageRequest.getPage(), pageRequest.getSize())
        ).get().map(trip -> {
            TripResponse response = mapper.map(trip, TripResponse.class);

            response.setUserId(trip.getUserProfile().getUser().getId());
            response.setUsername(trip.getUserProfile().getUser().getUsername());

            LocationResponse locationResponse = mapper.map(trip.getLocation(), LocationResponse.class);
            response.setLocation(locationResponse);

            response.setNumLikes(trip.getLikes().size());

            response.setIsLiked(trip.getLikes().contains(tokenUser.getUserProfile()));

            return response;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void likeTrip(Long tokenUserId, Long tripId) {
        User tokenUser = userRepository.findById(tokenUserId)
                .orElseThrow(() -> new EntityNotFoundException("User with the given id not found"));

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new EntityNotFoundException("Trip with the given id not found"));

        if(!tokenUser.getUserProfile().equals(trip.getUserProfile()) &&
                !trip.getUserProfile().isPublic() &&
                !tokenUser.getUserProfile().isFriendsWith(trip.getUserProfile())){
            throw new AccessDeniedException("Current is not friends with the trip user");
        }

        if(!trip.getLikes().contains(tokenUser.getUserProfile())){
            tokenUser.getUserProfile().getLikedTrips().add(trip);
        }

    }

    @Override
    @Transactional
    public void unlikeTrip(Long tokenUserId, Long tripId) {
        User tokenUser = userRepository.findById(tokenUserId)
                .orElseThrow(() -> new EntityNotFoundException("User with the given id not found"));

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new EntityNotFoundException("Trip with the given id not found"));

        if(!tokenUser.getUserProfile().equals(trip.getUserProfile()) &&
                !trip.getUserProfile().isPublic() &&
                !tokenUser.getUserProfile().isFriendsWith(trip.getUserProfile())){
            throw new AccessDeniedException("Current is not friends with the trip user");
        }

        tokenUser.getUserProfile().getLikedTrips().remove(trip);
        trip.getLikes().remove(tokenUser.getUserProfile());
    }


    @Override
    @Transactional
    public List<TripResponse> getAllFriendTrips(Long tokenUserId) {
        User tokenUser = userRepository.findById(tokenUserId)
                .orElseThrow(EntityNotFoundException::new);

        return tokenUser.getUserProfile().getFriends().stream()
                .flatMap(profile -> profile.getTrips().stream())
                .sorted(Comparator.comparing(Trip::getUploadTimestamp).reversed())
                .map(trip -> {
                    TripResponse response = mapper.map(trip, TripResponse.class);

                    response.setUserId(trip.getUserProfile().getUser().getId());
                    response.setUsername(trip.getUserProfile().getUser().getUsername());

                    LocationResponse locationResponse = mapper.map(trip.getLocation(), LocationResponse.class);
                    response.setLocation(locationResponse);

                    response.setNumLikes(trip.getLikes().size());

                    response.setIsLiked(trip.getLikes().contains(tokenUser.getUserProfile()));

                    return response;
                }).collect(Collectors.toList());
    }
}
