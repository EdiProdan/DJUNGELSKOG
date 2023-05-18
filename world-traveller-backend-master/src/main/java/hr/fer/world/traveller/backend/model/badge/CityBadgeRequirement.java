package hr.fer.world.traveller.backend.model.badge;

import hr.fer.world.traveller.backend.model.location.LocationType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CityBadgeRequirement {

    // Visit at least [requiredLocations] locations of type [locationType]

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "city_badge_requirement_id_generator")
    @SequenceGenerator(name = "city_badge_requirement_id_generator", sequenceName = "city_badge_requirement_id_seq", allocationSize = 1)
    private Long id;

    @Column(name = "required_locations", nullable = false)
    private Integer requiredLocations;

    @Column(name = "location_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private LocationType locationType;

    @ManyToOne
    @JoinColumn(name = "badge_id", nullable = false)
    private CityBadge badge;

    public String getCityBadgeDescription(){
        return "barem " +
                requiredLocations +
                " lokaciju/e/a tipa " +
                locationType.getTranslation();
    }

}
