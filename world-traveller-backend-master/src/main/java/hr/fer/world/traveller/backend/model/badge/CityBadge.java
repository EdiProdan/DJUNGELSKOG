package hr.fer.world.traveller.backend.model.badge;

import hr.fer.world.traveller.backend.model.location.Location;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.Collection;
import java.util.stream.Collectors;

@Entity
@DiscriminatorValue("CITY")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CityBadge extends Badge {

    // Visit at least [requiredLocations] locations and [requirements]

    @Column(name = "required_locations", nullable = false)
    private Integer requiredLocations;

    @OneToMany(mappedBy = "badge")
    private Collection<CityBadgeRequirement> requirements;

    @Override
    public String getDescriptionForLastLocation(Location lastLocation) {
        StringBuilder sb = new StringBuilder();

        if (lastLocation != null) {
            sb.append(lastLocation.getCity().getName())
                    .append(", ")
                    .append(lastLocation.getCity().getCountry().getName())
                    .append(" - Posjeti ");
        } else {
            sb.append("Posjeti ");
        }

        if (requiredLocations > 0) {
            sb.append(" barem ")
                    .append(requiredLocations)
                    .append(" lokaciju/e/a");

            if (requirements.size() > 0) {
                sb.append(" i ");
            }
        }

        sb.append(requirements.stream()
                .map(CityBadgeRequirement::getCityBadgeDescription)
                .collect(Collectors.joining(" i ")));

        return sb.toString();
    }
}
