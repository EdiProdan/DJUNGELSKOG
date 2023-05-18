package hr.fer.world.traveller.backend.service;

import hr.fer.world.traveller.backend.controller.response.WonBadgeResponse;
import hr.fer.world.traveller.backend.model.badge.Badge;
import hr.fer.world.traveller.backend.model.badge.WonBadge;
import hr.fer.world.traveller.backend.model.location.Location;
import hr.fer.world.traveller.backend.model.user.UserProfile;
import hr.fer.world.traveller.backend.repository.user.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
public class BadgeServiceTest {
    @MockBean
    private UserProfileRepository userProfileRepository;

    @Autowired
    private BadgeService badgeService;

    private UserProfile userProfile;

    private List<WonBadge> wonBadges;

    private List<WonBadgeResponse> wonBadgeResponses;

    private Badge badge1;

    private Badge badge2;

    @BeforeEach
    private void initData(){

        userProfile = new UserProfile();
        userProfile.setUserId(1L);

        badge1 = new Badge() {
            @Override
            public String getDescriptionForLastLocation(Location lastLocation) {
                return "badge1 description";
            }
        };
        badge1.setId(1L);
        badge1.setName("badge1");
        badge1.setImage(new byte[]{1});

        badge2 = new Badge() {
            @Override
            public String getDescriptionForLastLocation(Location lastLocation) {
                return "badge2 description";
            }
        };
        badge1.setId(2L);
        badge2.setName("badge2");
        badge2.setImage(new byte[]{2});

        WonBadge wonBadge1 = new WonBadge();
        wonBadge1.setBadge(badge1);
        wonBadge1.setWonTimestamp(LocalDateTime.now());

        WonBadgeResponse wonBadgeResponse1 = new WonBadgeResponse();
        wonBadgeResponse1.setId(badge1.getId());
        wonBadgeResponse1.setName(badge1.getName());
        wonBadgeResponse1.setDescription(badge1.getDescriptionForLastLocation(null));
        wonBadgeResponse1.setImage(badge1.getImage());
        wonBadgeResponse1.setDate(wonBadge1.getWonTimestamp());

        WonBadge wonBadge2 = new WonBadge();
        wonBadge2.setBadge(badge2);
        wonBadge2.setWonTimestamp(LocalDateTime.now());

        WonBadgeResponse wonBadgeResponse2 = new WonBadgeResponse();
        wonBadgeResponse2.setId(badge2.getId());
        wonBadgeResponse2.setName(badge2.getName());
        wonBadgeResponse2.setDescription(badge2.getDescriptionForLastLocation(null));
        wonBadgeResponse2.setImage(badge2.getImage());
        wonBadgeResponse2.setDate(wonBadge2.getWonTimestamp());

        wonBadges = List.of(wonBadge1, wonBadge2);
        wonBadgeResponses = List.of(wonBadgeResponse1, wonBadgeResponse2);

        userProfile.setWonBadges(wonBadges);
    }

    @Test
    public void testGetAllWonBadges(){
        Long userId = userProfile.getUserId();

        Mockito.when(userProfileRepository.findById(userId)).thenReturn(Optional.ofNullable(userProfile));

        List<WonBadgeResponse> expected = wonBadgeResponses;
        List<WonBadgeResponse> received = badgeService.getAllWonBadges(userId);

        assertEquals(expected, received);
    }

    @Test
    public void testGetAllWonBadges_WrongId(){
        Long userId = 1L;

        Mockito.when(userProfileRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> badgeService.getAllWonBadges(userId));
    }

}
