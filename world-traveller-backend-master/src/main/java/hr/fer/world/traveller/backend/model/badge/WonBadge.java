package hr.fer.world.traveller.backend.model.badge;

import hr.fer.world.traveller.backend.model.location.Location;
import hr.fer.world.traveller.backend.model.user.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@IdClass(WonBadgeId.class)
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class WonBadge {

    @Id
    @Column(name = "user_id", nullable = false)
    private Long userProfileId;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private UserProfile userProfile;

    @Id
    @Column(name = "badge_id", nullable = false)
    private Long badgeId;

    @ManyToOne
    @JoinColumn(name = "badge_id", insertable = false, updatable = false)
    private Badge badge;

    @Id
    @Column(name = "last_location_id", nullable = false)
    private Long lastLocationId;

    @ManyToOne
    @JoinColumn(name = "last_location_id", insertable = false, updatable = false)
    private Location lastLocation;

    @CreationTimestamp
    @Column(name = "won_timestamp", nullable = false)
    private LocalDateTime wonTimestamp;

    public void setUserProfile(UserProfile userProfile) {
        this.userProfile = userProfile;
        this.userProfileId = userProfile.getUserId();
    }

    public void setBadge(Badge badge) {
        this.badge = badge;
        this.badgeId = badge.getId();
    }

    public void setLastLocation(Location lastLocation) {
        this.lastLocation = lastLocation;
        this.lastLocationId = lastLocation.getId();
    }
}
