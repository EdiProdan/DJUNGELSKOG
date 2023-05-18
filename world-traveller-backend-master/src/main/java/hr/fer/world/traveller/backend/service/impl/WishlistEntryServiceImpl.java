package hr.fer.world.traveller.backend.service.impl;

import hr.fer.world.traveller.backend.controller.request.BasicPageRequest;
import hr.fer.world.traveller.backend.controller.request.WishlistEntryRequest;
import hr.fer.world.traveller.backend.controller.response.LocationResponse;
import hr.fer.world.traveller.backend.controller.response.WishlistEntryResponse;
import hr.fer.world.traveller.backend.mapper.GenericMapper;
import hr.fer.world.traveller.backend.model.location.Location;
import hr.fer.world.traveller.backend.model.user.UserProfile;
import hr.fer.world.traveller.backend.model.wishlist.WishlistEntry;
import hr.fer.world.traveller.backend.model.wishlist.WishlistEntryState;
import hr.fer.world.traveller.backend.repository.location.LocationRepository;
import hr.fer.world.traveller.backend.repository.user.UserRepository;
import hr.fer.world.traveller.backend.repository.wishlist.WishlistEntryRepository;
import hr.fer.world.traveller.backend.service.WishlistEntryService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistEntryServiceImpl implements WishlistEntryService {

    private final WishlistEntryRepository wishlistEntryRepository;

    private final UserRepository userRepository;

    private final LocationRepository locationRepository;

    private final GenericMapper mapper;

    public WishlistEntryServiceImpl(WishlistEntryRepository wishlistEntryRepository, UserRepository userRepository,
                                    LocationRepository locationRepository, GenericMapper mapper) {
        this.wishlistEntryRepository = wishlistEntryRepository;
        this.userRepository = userRepository;
        this.locationRepository = locationRepository;
        this.mapper = mapper;
    }

    @Override
    public void save(Long userId, WishlistEntryRequest request) {
        WishlistEntry entry = new WishlistEntry();

        if (request.getVisitBefore().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Datum posjete mora biti u budućnosti");
        }
        entry.setVisitBefore(request.getVisitBefore());

        UserProfile userProfile = userRepository.findById(userId)
                .orElseThrow(EntityNotFoundException::new)
                .getUserProfile();
        entry.setUserProfile(userProfile);

        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(EntityNotFoundException::new);
        entry.setLocation(location);

        entry.setState(WishlistEntryState.ONGOING);

        wishlistEntryRepository.save(entry);
    }

    @Override
    public List<WishlistEntryResponse> getAllWishlistEntries(Long userId) {

        UserProfile userProfile = userRepository.findById(userId)
                .orElseThrow().getUserProfile();

        return wishlistEntryRepository.findAllByUserProfile(userProfile).stream()
                .map(wishlistEntry -> new WishlistEntryResponse(
                        wishlistEntry.getId(),
                        wishlistEntry.getState(),
                        mapper.map(wishlistEntry.getLocation(), LocationResponse.class),
                        wishlistEntry.getVisitBefore()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<WishlistEntryResponse> getWishlistEntries(Long userId, BasicPageRequest request) {

        UserProfile userProfile = userRepository.findById(userId)
                .orElseThrow().getUserProfile();

        PageRequest pageRequest = PageRequest.of(request.getPage(), request.getSize());

        return wishlistEntryRepository.findAllByUserProfile(userProfile, pageRequest).stream()
                .map(wishlistEntry -> new WishlistEntryResponse(
                        wishlistEntry.getId(),
                        wishlistEntry.getState(),
                        mapper.map(wishlistEntry.getLocation(), LocationResponse.class),
                        wishlistEntry.getVisitBefore()
                ))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteById(Long userId, Long wishlistEntryId) {

        UserProfile userProfile = userRepository.findById(userId)
                .orElseThrow().getUserProfile();

        wishlistEntryRepository.deleteByIdAndUserProfile(wishlistEntryId, userProfile);
    }
}
