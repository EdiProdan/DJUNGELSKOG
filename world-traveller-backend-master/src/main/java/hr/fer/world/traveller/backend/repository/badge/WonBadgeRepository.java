package hr.fer.world.traveller.backend.repository.badge;

import hr.fer.world.traveller.backend.model.badge.WonBadge;
import hr.fer.world.traveller.backend.model.badge.WonBadgeId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface WonBadgeRepository extends JpaRepository<WonBadge, WonBadgeId> {

    @Query("SELECT wonBadge FROM WonBadge wonBadge " +
            "JOIN wonBadge.userProfile userProfile " +
            "JOIN userProfile.user user " +
            "WHERE user.id = :userId " +
            "ORDER BY wonBadge.wonTimestamp DESC")
    Page<WonBadge> findPageByUserIdOrderedByWonTimestampDesc(Long userId, PageRequest pageRequest);

}
