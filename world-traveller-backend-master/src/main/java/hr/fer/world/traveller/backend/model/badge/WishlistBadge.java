package hr.fer.world.traveller.backend.model.badge;

import hr.fer.world.traveller.backend.model.location.Location;
import hr.fer.world.traveller.backend.model.wishlist.WishlistEntry;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@DiscriminatorValue("WISHLIST")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class WishlistBadge extends Badge {

    // Visit [wishlistEntry.location] before [wishlistEntry.visitBefore]

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "wishlist_entry_id", nullable = false)
    private WishlistEntry wishlistEntry;

    @Override
    public String getDescriptionForLastLocation(Location lastLocation) {
        return "Posjeti " +
                wishlistEntry.getLocation().getName() +
                " do " +
                wishlistEntry.getVisitBefore().toString();
    }
}