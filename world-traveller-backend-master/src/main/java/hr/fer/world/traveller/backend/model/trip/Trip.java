package hr.fer.world.traveller.backend.model.trip;

import hr.fer.world.traveller.backend.model.location.Location;
import hr.fer.world.traveller.backend.model.user.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Trip {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "trip_id_generator")
    @SequenceGenerator(name = "trip_id_generator", sequenceName = "trip_id_seq", allocationSize = 1)
    private Long id;

    @Type(type="org.hibernate.type.BinaryType")
    @Column(name = "image")
    private byte[] image;

    @Column(name = "date_visited", nullable = false)
    private LocalDate dateVisited;

    @CreationTimestamp
    @Column(name = "upload_timestamp", nullable = false)
    private LocalDateTime uploadTimestamp;

    @Column(name = "transportation_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private TransportationType transportationType;

    @Column(name = "traffic_rating", nullable = false)
    @Enumerated(EnumType.STRING)
    private TrafficRating trafficRating;

    @Column(name = "solo", nullable = false)
    private boolean solo;

    @Column(name = "trip_rating", nullable = false)
    @Enumerated(EnumType.STRING)
    private TripRating tripRating;

    @Column(name = "description", nullable = false)
    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserProfile userProfile;

    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @ManyToMany(mappedBy = "likedTrips")
    private Collection<UserProfile> likes;

}
