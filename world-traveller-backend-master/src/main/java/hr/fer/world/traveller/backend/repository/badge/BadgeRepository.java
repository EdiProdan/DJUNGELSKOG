package hr.fer.world.traveller.backend.repository.badge;

import hr.fer.world.traveller.backend.model.badge.Badge;
import hr.fer.world.traveller.backend.model.badge.CityBadge;
import hr.fer.world.traveller.backend.model.badge.CountryBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BadgeRepository extends JpaRepository<Badge, Long > {

    @Query("SELECT DISTINCT badge FROM UserProfile userProfile, Country country, CountryBadge badge " +
            "LEFT OUTER JOIN WonBadge wonBadge ON wonBadge.userProfile = userProfile AND wonBadge.badge = badge " +
            "WHERE wonBadge IS NULL " +
            "   AND country.code = :countryCode " +
            "   AND userProfile.user.id = :userId")
    List<CountryBadge> findAllCountryBadgesUncompletedByUserAtCountry(Long userId, String countryCode);

    @Query("SELECT DISTINCT badge FROM UserProfile userProfile, City city, CityBadge badge " +
            "LEFT OUTER JOIN WonBadge wonBadge ON wonBadge.userProfile = userProfile AND wonBadge.badge = badge " +
            "WHERE wonBadge IS NULL " +
            "   AND city.id = :cityId " +
            "   AND userProfile.user.id = :userId")
    List<CityBadge> findAllCityBadgesUncompletedByUserAtCity(Long userId, Long cityId);
}
