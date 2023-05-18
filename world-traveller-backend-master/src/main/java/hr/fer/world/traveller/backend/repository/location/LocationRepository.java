package hr.fer.world.traveller.backend.repository.location;

import hr.fer.world.traveller.backend.model.location.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, Long> {

    @Query("SELECT DISTINCT location FROM Location location " +
            "JOIN location.trips trip " +
            "JOIN trip.userProfile user " +
            "WHERE user.user.id = :userId")
    List<Location> findDistinctVisitedByUser(@Param("userId") Long userId);


    @Query("SELECT DISTINCT location FROM Location location " +
            "JOIN location.city city " +
            "JOIN city.country country " +
            "JOIN location.trips trip " +
            "JOIN trip.userProfile user " +
            "WHERE user.user.id = :userId " +
            "   AND country.code = :countryCode" +
            "   AND location.suggestion = false")
    List<Location> findDistinctVisitedByUserAtCountry(Long userId, String countryCode);

    @Query("SELECT DISTINCT location FROM Location location " +
            "JOIN location.city city " +
            "JOIN location.trips trip " +
            "JOIN trip.userProfile user " +
            "WHERE user.user.id = :userId " +
            "   AND city.id = :cityId" +
            "   AND location.suggestion = false")
    List<Location> findDistinctVisitedByUserAtCity(Long userId, Long cityId);

    Optional<Location> findByName(String name);
}
