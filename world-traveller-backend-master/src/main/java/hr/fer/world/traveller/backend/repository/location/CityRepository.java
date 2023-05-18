package hr.fer.world.traveller.backend.repository.location;

import hr.fer.world.traveller.backend.model.location.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {

    @Query("SELECT DISTINCT city FROM Location location " +
            "JOIN location.city city " +
            "JOIN city.country country " +
            "JOIN location.trips trip " +
            "JOIN trip.userProfile user " +
            "WHERE user.user.id = :userId " +
            "   AND country.code = :countryCode")
    List<City> findDistinctVisitedByUserAtCountry(Long userId, String countryCode);

    Optional<City> findByName(String name);

}
