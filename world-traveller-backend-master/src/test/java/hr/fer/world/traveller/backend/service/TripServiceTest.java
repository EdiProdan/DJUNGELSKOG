package hr.fer.world.traveller.backend.service;

import hr.fer.world.traveller.backend.controller.request.BasicPageRequest;
import hr.fer.world.traveller.backend.controller.response.LocationResponse;
import hr.fer.world.traveller.backend.controller.response.TripResponse;
import hr.fer.world.traveller.backend.mapper.GenericMapper;
import hr.fer.world.traveller.backend.model.location.Location;
import hr.fer.world.traveller.backend.model.trip.Trip;
import hr.fer.world.traveller.backend.model.user.Role;
import hr.fer.world.traveller.backend.model.user.RoleName;
import hr.fer.world.traveller.backend.model.user.User;
import hr.fer.world.traveller.backend.model.user.UserProfile;
import hr.fer.world.traveller.backend.repository.trip.TripRepository;
import hr.fer.world.traveller.backend.repository.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class TripServiceTest {

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private TripRepository tripRepository;

    @Autowired
    private TripService tripService;

    @Autowired
    private GenericMapper mapper;

    private User user1;

    private User user2;

    private Trip trip1;
    private TripResponse tripResponse1;
    private Location location1;
    private LocationResponse locationResponse1;

    private Trip trip2;
    private TripResponse tripResponse2;
    private Location location2;
    private LocationResponse locationResponse2;

    @BeforeEach
    private void initData(){
        user1 = new User();
        user1.setId(1L);
        user1.setUsername("username1");

        UserProfile userProfile1 = new UserProfile();
        userProfile1.setUser(user1);
        userProfile1.setUserId(user1.getId());
        userProfile1.setPublic(false);
        userProfile1.setFriendsReceived(Set.of());
        user1.setUserProfile(new UserProfile());

        user2 = new User();
        user2.setId(2L);
        user2.setUsername("username2");
        UserProfile userProfile2 = new UserProfile();
        userProfile2.setUser(user2);
        userProfile2.setUserId(user2.getId());
        userProfile2.setPublic(false);
        userProfile2.setFriendsReceived(Set.of());
        user2.setUserProfile(userProfile2);

        location1 = new Location();
        location1.setId(1L);
        location1.setName("location1");
        locationResponse1 = mapper.map(location1, LocationResponse.class);

        location2 = new Location();
        location2.setId(2L);
        location2.setName("location2");
        locationResponse2 = mapper.map(location2, LocationResponse.class);

        trip1 = new Trip();
        trip1.setId(1L);
        trip1.setLocation(location1);
        trip1.setLikes(Set.of(userProfile1, userProfile2));
        trip1.setUserProfile(userProfile1);
        tripResponse1 = mapper.map(trip1, TripResponse.class);
        tripResponse1.setNumLikes(2);
        tripResponse1.setUserId(user1.getId());
        tripResponse1.setUsername(user1.getUsername());
        tripResponse1.setLocation(locationResponse1);
        tripResponse1.setIsLiked(false);

        trip2 = new Trip();
        trip2.setId(2L);
        trip2.setLocation(location2);
        trip2.setLikes(Set.of(userProfile1));
        trip2.setUserProfile(userProfile2);
        tripResponse2 = mapper.map(trip2, TripResponse.class);
        tripResponse2.setNumLikes(1);
        tripResponse2.setUserId(user2.getId());
        tripResponse2.setUsername(user2.getUsername());
        tripResponse2.setLocation(locationResponse2);
        tripResponse2.setIsLiked(false);
    }

    @Test
    public void testGetRecentTrips_NotFriends(){
        Long user1Id = user1.getId();
        user1.setRoles(Set.of(new Role(RoleName.USER)));

        Long user2Id = user2.getId();

        BasicPageRequest basicPageRequest = new BasicPageRequest(0, 3);

        Mockito.when(userRepository.findById(user1.getId())).thenReturn(Optional.ofNullable(user1));
        Mockito.when(userRepository.findById(user2.getId())).thenReturn(Optional.ofNullable(user2));

        assertThrows(AccessDeniedException.class, () -> tripService.getRecentTrips(user1Id, user2Id, basicPageRequest));
    }

    @Test
    public void testGetRecentTrips(){
        Long user1Id = user1.getId();
        user1.setRoles(Set.of(new Role(RoleName.ADMIN)));

        Long user2Id = user2.getId();

        BasicPageRequest basicPageRequest = new BasicPageRequest(0, 2);
        PageRequest pageRequest = PageRequest.of(basicPageRequest.getPage(), basicPageRequest.getSize());

        Mockito.when(userRepository.findById(user1.getId())).thenReturn(Optional.ofNullable(user1));
        Mockito.when(userRepository.findById(user2.getId())).thenReturn(Optional.ofNullable(user2));

        Mockito.when(tripRepository.findByUserProfile_UserIdOrderByDateVisitedDesc(user2Id, pageRequest))
                        .thenReturn(new PageImpl<>(List.of(trip1, trip2)));

        List<TripResponse> expected = List.of(tripResponse1, tripResponse2);
        List<TripResponse> received = tripService.getRecentTrips(user1Id, user2Id, basicPageRequest);

        assertEquals(expected, received);
    }

}
