package hr.fer.world.traveller.backend.model.badge;

import hr.fer.world.traveller.backend.model.location.Location;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@DiscriminatorValue("COUNTRY")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CountryBadge extends Badge {

    // Visit capital city: [visitCapitalCity]
    // and visit [requiredNumber] more [type].

    @Column(name = "visit_capital_city", nullable = false)
    private Boolean visitCapitalCity;

    @Column(name = "required_number", nullable = false)
    private Integer requiredNumber;

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private CountryBadgeType type;

    @Override
    public String getDescriptionForLastLocation(Location lastLocation) {
        StringBuilder sb = new StringBuilder();

        if (lastLocation != null) {
            sb.append(lastLocation.getCity().getCountry().getName())
                    .append(" - Posjeti ");
        } else {
            sb.append("Posjeti ");
        }

        if (visitCapitalCity) {
            sb.append("glavni grad i još ");
        }

        if (requiredNumber > 0) {
            sb.append(requiredNumber);

            if (type == CountryBadgeType.LOCATION) {
                sb.append(" lokaciju/e/a");
            } else {
                sb.append(" grad/a");
            }
        }

        return sb.toString();
    }

}
