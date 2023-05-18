package hr.fer.world.traveller.backend.repository.badge;

import hr.fer.world.traveller.backend.model.badge.CountryBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CountryBadgeRepository extends JpaRepository<CountryBadge, Long> {
}
