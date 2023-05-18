package hr.fer.world.traveller.backend.repository.wishlist;

import hr.fer.world.traveller.backend.model.user.UserProfile;
import hr.fer.world.traveller.backend.model.wishlist.WishlistEntry;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishlistEntryRepository extends JpaRepository<WishlistEntry, Long> {

    List<WishlistEntry> findAllByUserProfile(UserProfile userProfile);

    List<WishlistEntry> findAllByUserProfile(UserProfile userProfile, PageRequest pageRequest);

    void deleteByIdAndUserProfile(Long id, UserProfile userProfile);

}
