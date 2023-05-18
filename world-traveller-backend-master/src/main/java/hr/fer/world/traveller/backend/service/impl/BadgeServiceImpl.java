package hr.fer.world.traveller.backend.service.impl;

import hr.fer.world.traveller.backend.command.CreateCityBadgeCommand;
import hr.fer.world.traveller.backend.command.CreateCountryBadgeCommand;
import hr.fer.world.traveller.backend.controller.request.BasicPageRequest;
import hr.fer.world.traveller.backend.controller.response.BadgeResponse;
import hr.fer.world.traveller.backend.controller.response.WonBadgeResponse;
import hr.fer.world.traveller.backend.mapper.CreateCityBadgeCityBadgeMapper;
import hr.fer.world.traveller.backend.mapper.CreateCountryBadgeCountryBadgeMapper;
import hr.fer.world.traveller.backend.model.badge.*;
import hr.fer.world.traveller.backend.model.location.City;
import hr.fer.world.traveller.backend.model.location.Location;
import hr.fer.world.traveller.backend.model.user.UserProfile;
import hr.fer.world.traveller.backend.model.wishlist.WishlistEntryState;
import hr.fer.world.traveller.backend.repository.badge.*;
import hr.fer.world.traveller.backend.repository.location.CityRepository;
import hr.fer.world.traveller.backend.repository.location.LocationRepository;
import hr.fer.world.traveller.backend.repository.user.UserProfileRepository;
import hr.fer.world.traveller.backend.repository.user.UserRepository;
import hr.fer.world.traveller.backend.service.BadgeService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BadgeServiceImpl implements BadgeService {

    private final BadgeRepository badgeRepository;

    private final WonBadgeRepository wonBadgeRepository;

    private final UserProfileRepository userProfileRepository;

    private final CreateCountryBadgeCountryBadgeMapper createCountryBadgeCountryBadgeMapper;

    private final CreateCityBadgeCityBadgeMapper createCityBadgeCityBadgeMapper;

    private final CityBadgeRequirementRepository cityBadgeRequirementRepository;

    private final UserRepository userRepository;

    private final LocationRepository locationRepository;

    private final CityRepository cityRepository;

    private final CountryBadgeRepository countryBadgeRepository;

    private final CityBadgeRepository cityBadgeRepository;

    public BadgeServiceImpl(BadgeRepository badgeRepository, WonBadgeRepository wonBadgeRepository,
                            UserProfileRepository userProfileRepository,
                            CreateCountryBadgeCountryBadgeMapper createCountryBadgeCountryBadgeMapper,
                            CreateCityBadgeCityBadgeMapper createCityBadgeCityBadgeMapper,
                            CityBadgeRequirementRepository cityBadgeRequirementRepository,
                            UserRepository userRepository, LocationRepository locationRepository,
                            CityRepository cityRepository, CountryBadgeRepository countryBadgeRepository,
                            CityBadgeRepository cityBadgeRepository) {
        this.badgeRepository = badgeRepository;
        this.wonBadgeRepository = wonBadgeRepository;
        this.userProfileRepository = userProfileRepository;
        this.createCountryBadgeCountryBadgeMapper = createCountryBadgeCountryBadgeMapper;
        this.createCityBadgeCityBadgeMapper = createCityBadgeCityBadgeMapper;
        this.cityBadgeRequirementRepository = cityBadgeRequirementRepository;
        this.userRepository = userRepository;
        this.locationRepository = locationRepository;
        this.cityRepository = cityRepository;
        this.countryBadgeRepository = countryBadgeRepository;

        this.cityBadgeRepository = cityBadgeRepository;
    }

    @Override
    public void createCountryBadge(CreateCountryBadgeCommand command) {
        badgeRepository.save(createCountryBadgeCountryBadgeMapper.map(command));

    }

    @Override
    public void createCityBadge(CreateCityBadgeCommand command) {
        CityBadge cityBadge = createCityBadgeCityBadgeMapper.map(command);
        badgeRepository.save(cityBadge);
        cityBadgeRequirementRepository.saveAll(cityBadge.getRequirements());
    }

    @Override
    public List<WonBadgeResponse> getAllWonBadges(Long userId) {
        final UserProfile userProfile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with given id not found"));

        return userProfile.getWonBadges().stream()
                .map(wonBadge -> new WonBadgeResponse(
                        wonBadge.getBadge().getId(),
                        wonBadge.getBadge().getName(),
                        wonBadge.getBadge().getDescriptionForLastLocation(wonBadge.getLastLocation()),
                        wonBadge.getBadge().getImage(),
                        wonBadge.getWonTimestamp()
                ))
                .toList();
    }

    @Override
    @Transactional
    public List<WonBadgeResponse> getRecentlyWonBadges(Long userId, BasicPageRequest pageRequest) {
        final UserProfile userProfile = userProfileRepository.findById(userId).orElseThrow();

        return wonBadgeRepository.findPageByUserIdOrderedByWonTimestampDesc(
                        userId,
                        PageRequest.of(pageRequest.getPage(), pageRequest.getSize())
                )
                .map(wonBadge -> new WonBadgeResponse(
                        wonBadge.getBadge().getId(),
                        wonBadge.getBadge().getName(),
                        wonBadge.getBadge().getDescriptionForLastLocation(wonBadge.getLastLocation()),
                        wonBadge.getBadge().getImage(),
                        wonBadge.getWonTimestamp()
                ))
                .toList();
    }

    @Override
    @Transactional
    public void markCompletedBadges(Long userId, Long locationId) {

        UserProfile userProfile = userRepository.findById(userId)
                .orElseThrow(EntityNotFoundException::new)
                .getUserProfile();

        Location location = locationRepository.findById(locationId)
                .orElseThrow(EntityNotFoundException::new);

        markCompletedWishlistBadges(userProfile, location);

        markCompletedCityBadges(userProfile, location);

        markCompletedCountryBadges(userProfile, location);
    }

    private void markCompletedWishlistBadges(UserProfile userProfile, Location location) {
        userProfile.getWishlist().stream()
                .filter(wishlistEntry ->
                        wishlistEntry.getState() == WishlistEntryState.ONGOING &&
                                wishlistEntry.getLocation().equals(location))
                .forEach(wishlistEntry -> {

                    if (wishlistEntry.getVisitBefore().isBefore(LocalDate.now())) {
                        wishlistEntry.setState(WishlistEntryState.EXPIRED);
                    }

                    wishlistEntry.setState(WishlistEntryState.COMPLETED);

                    WishlistBadge wishlistBadge = new WishlistBadge();
                    wishlistBadge.setWishlistEntry(wishlistEntry);
                    wishlistBadge.setName(wishlistBadge.getDescriptionForLastLocation(location));
                    badgeRepository.save(wishlistBadge);

                    WonBadge wonBadge = new WonBadge();
                    wonBadge.setBadge(wishlistBadge);
                    wonBadge.setUserProfile(userProfile);
                    wonBadge.setLastLocation(location);
                    wonBadge.setWonTimestamp(LocalDateTime.now());
                    wonBadgeRepository.save(wonBadge);

                });
    }

    private void markCompletedCountryBadges(UserProfile userProfile, Location location) {
        List<CountryBadge> uncompletedBadges = badgeRepository.findAllCountryBadgesUncompletedByUserAtCountry(
                userProfile.getUserId(),
                location.getCity().getCountry().getCode());

        List<Location> visitedLocations = locationRepository.findDistinctVisitedByUserAtCountry(
                userProfile.getUser().getId(),
                location.getCity().getCountry().getCode());

        List<City> visitedCities = cityRepository.findDistinctVisitedByUserAtCountry(
                userProfile.getUser().getId(),
                location.getCity().getCountry().getCode());

        uncompletedBadges.forEach(badge -> {

            boolean completed = false;

            if (badge.getType() == CountryBadgeType.CITY) {
                List<City> cities = new ArrayList<>(visitedCities);

                if (badge.getVisitCapitalCity()) {
                    cities.removeIf(City::getCapital);
                }

                if (cities.size() > badge.getRequiredNumber()) {
                    completed = true;
                }

            } else {
                List<Location> locations = new ArrayList<>(visitedLocations);

                if (badge.getVisitCapitalCity()) {
                    locations.removeIf(locationTmp -> locationTmp.getCity().getCapital());
                }

                if (locations.size() > badge.getRequiredNumber()) {
                    completed = true;
                }

            }

            if (completed) {
                WonBadge wonBadge = new WonBadge();
                wonBadge.setWonTimestamp(LocalDateTime.now());
                wonBadge.setUserProfile(userProfile);
                wonBadge.setBadge(badge);
                wonBadge.setLastLocation(location);
                wonBadgeRepository.save(wonBadge);
            }

        });

    }

    private void markCompletedCityBadges(UserProfile userProfile, Location location) {
        List<CityBadge> uncompletedBadges = badgeRepository.findAllCityBadgesUncompletedByUserAtCity(
                userProfile.getUserId(),
                location.getCity().getId());

        List<Location> visitedLocations = locationRepository.findDistinctVisitedByUserAtCity(
                userProfile.getUser().getId(),
                location.getCity().getId());

        uncompletedBadges.forEach(badge -> {

            if (visitedLocations.size() >= badge.getRequiredLocations()) {

                boolean completed = true;

                for (CityBadgeRequirement requirement : badge.getRequirements()) {

                    long contains = visitedLocations.stream()
                            .filter(locationTmp -> locationTmp.getType() == requirement.getLocationType())
                            .count();

                    if (contains < requirement.getRequiredLocations()) {
                        completed = false;
                        break;
                    }

                }

                if (completed) {
                    WonBadge wonBadge = new WonBadge();
                    wonBadge.setWonTimestamp(LocalDateTime.now());
                    wonBadge.setUserProfile(userProfile);
                    wonBadge.setBadge(badge);
                    wonBadge.setLastLocation(location);
                    wonBadgeRepository.save(wonBadge);
                }

            }
        });
    }

    public List<BadgeResponse> getAllNotWonBadges(Long userId) {
        final UserProfile userProfile = userProfileRepository.findById(userId).orElseThrow();

        Set<Badge> allWonBadges = userProfile.getWonBadges().stream().map(WonBadge::getBadge)
                .collect(Collectors.toSet());

        Set<Badge> allBadges = new HashSet<>(badgeRepository.findAll());

        allBadges.removeAll(allWonBadges);

        return allBadges.stream().map(badge -> new BadgeResponse(
                        badge.getId(),
                        badge.getName(),
                        badge.getDescriptionForLastLocation(null),
                        badge.getImage()
                ))
                .toList();
    }

    @Override
    public List<BadgeResponse> getAllBadges() {
        List<CountryBadge> countryBadges = countryBadgeRepository.findAll();
        List<CityBadge> cityBadges = cityBadgeRepository.findAll();

        List<Badge> badges = new ArrayList<>();
        badges.addAll(countryBadges);
        badges.addAll(cityBadges);

        return badges.stream()
                .sorted(Comparator.comparing(Badge::getId))
                .map(badge -> new BadgeResponse(
                        badge.getId(),
                        badge.getName(),
                        badge.getDescriptionForLastLocation(null),
                        badge.getImage()
                )).toList();
    }
}
