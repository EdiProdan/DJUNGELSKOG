package hr.fer.world.traveller.backend.repository.user;

import hr.fer.world.traveller.backend.model.wishlist.WishlistEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishlistRepository  extends JpaRepository<WishlistEntry, Long> {
}
