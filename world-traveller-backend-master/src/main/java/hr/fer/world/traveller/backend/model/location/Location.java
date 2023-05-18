package hr.fer.world.traveller.backend.model.location;

import hr.fer.world.traveller.backend.model.badge.WonBadge;
import hr.fer.world.traveller.backend.model.trip.Trip;
import hr.fer.world.traveller.backend.model.user.User;
import hr.fer.world.traveller.backend.model.wishlist.WishlistEntry;
import lombok.*;

import javax.persistence.*;
import java.util.Collection;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class Location {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "location_id_generator")
    @SequenceGenerator(name = "location_id_generator", sequenceName = "location_id_seq", allocationSize = 1)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "x_coordinate", nullable = false)
    private Double xCoordinate;

    @Column(name = "y_coordinate", nullable = false)
    private Double yCoordinate;

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private LocationType type;

    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;

    @Column(name = "suggestion", nullable = false)
    private boolean suggestion;

    @ManyToOne
    @JoinColumn(name = "suggested_by_user_id")
    private User suggestedByUser;

    @OneToMany(mappedBy = "location")
    private Collection<Trip> trips;

    @OneToMany(mappedBy = "location")
    private Collection<WishlistEntry> wishlistEntries;

    @OneToMany(mappedBy = "lastLocation")
    private Collection<WonBadge> lastBadgesWonHere;
}
