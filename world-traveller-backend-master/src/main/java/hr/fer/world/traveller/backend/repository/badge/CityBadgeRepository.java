package hr.fer.world.traveller.backend.repository.badge;

import hr.fer.world.traveller.backend.model.badge.CityBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CityBadgeRepository extends JpaRepository<CityBadge, Long> {
}
