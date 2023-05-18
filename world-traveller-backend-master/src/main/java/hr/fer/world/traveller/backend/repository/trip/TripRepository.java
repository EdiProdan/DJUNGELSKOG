package hr.fer.world.traveller.backend.repository.trip;

import hr.fer.world.traveller.backend.model.trip.Trip;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripRepository extends JpaRepository<Trip, Long> {

    Page<Trip> findByUserProfile_UserIdOrderByDateVisitedDesc(Long userId, PageRequest pageRequest);

    Page<Trip> findByUserProfile_UserId(Long userId, PageRequest pageRequest);
}
