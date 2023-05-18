package hr.fer.world.traveller.backend.repository.location;

import hr.fer.world.traveller.backend.model.location.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CountryRepository extends JpaRepository<Country, String> {

    Optional<Country> findByCode(String code);

    @Query("SELECT DISTINCT country FROM Country country " +
            "JOIN country.cities city " +
            "JOIN city.locations location " +
            "JOIN location.trips trip " +
            "JOIN trip.userProfile user " +
            "WHERE user.user.id = :userId")
    List<Country> findDistinctVisitedByUser(@Param("userId") Long userId);

    List<Country> findAllByWhitelistedIsTrue();
}
