package hr.fer.world.traveller.backend.model.badge;

import hr.fer.world.traveller.backend.model.location.Location;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.Collection;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "type",
        discriminatorType = DiscriminatorType.STRING)
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public abstract class Badge {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "badge_id_generator")
    @SequenceGenerator(name = "badge_id_generator", sequenceName = "badge_id_seq", allocationSize = 1)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Type(type="org.hibernate.type.BinaryType")
    @Column(name = "image")
    private byte[] image;

    @OneToMany(mappedBy = "userProfile")
    private Collection<WonBadge> wonBadges;

    /**
     * Returns the description of the badge won at the given last location.
     * @param lastLocation The last location needed to win the badge.
     * @return The description of the badge won at the given last location.
     */
    public abstract String getDescriptionForLastLocation(Location lastLocation);

}
