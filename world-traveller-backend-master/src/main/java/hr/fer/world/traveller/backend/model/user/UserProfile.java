package hr.fer.world.traveller.backend.model.user;

import hr.fer.world.traveller.backend.model.badge.WonBadge;
import hr.fer.world.traveller.backend.model.trip.Trip;
import hr.fer.world.traveller.backend.model.wishlist.WishlistEntry;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Collection;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserProfile implements Serializable {

    @Id
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "public", nullable = false)
    private boolean isPublic;

    @Type(type="org.hibernate.type.BinaryType")
    @Column(name = "profile_image")
    private byte[] profileImage;

    @OneToMany(mappedBy = "toUser")
    private Collection<Friend> friendsReceived;

    @OneToMany(mappedBy = "fromUser")
    private Collection<Friend> friendsSent;

    @OneToMany(mappedBy = "userProfile")
    private Collection<Trip> trips;

    @ManyToMany
    @JoinTable(
            name = "trip_like",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "trip_id"))
    private Collection<Trip> likedTrips;

    @OneToMany(mappedBy = "userProfile")
    private Collection<WishlistEntry> wishlist;

    @OneToMany(mappedBy = "userProfile")
    private Collection<WonBadge> wonBadges;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserProfile that = (UserProfile) o;
        return Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId);
    }

    @Transient
    public Set<UserProfile> getFriends() {
        Set<UserProfile> friendsSent = this.getFriendsSent().stream().map(Friend::getToUser).collect(Collectors.toSet());
        Set<UserProfile> friendsReceived = this.getFriendsReceived().stream().map(Friend::getFromUser).collect(Collectors.toSet());

        friendsSent.retainAll(friendsReceived);

        return friendsSent;
    }

    public boolean isFriendsWith(UserProfile userProfile) {
        return this.getFriendsReceived().stream().anyMatch(friend ->
                Objects.equals(friend.getFromUser().getUser().getId(), userProfile.getUser().getId()))
                && this.getFriendsSent().stream().anyMatch(friend ->
                Objects.equals(friend.getToUser().getUser().getId(), userProfile.getUser().getId()));
    }
}
