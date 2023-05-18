package hr.fer.world.traveller.backend.controller.response;

import hr.fer.world.traveller.backend.model.trip.TrafficRating;
import hr.fer.world.traveller.backend.model.trip.TransportationType;
import hr.fer.world.traveller.backend.model.trip.TripRating;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class TripResponse {

    private Long id;

    private byte[] image;

    private LocalDate dateVisited;

    private TransportationType transportationType;

    private TrafficRating trafficRating;

    private boolean solo;

    private TripRating tripRating;

    private String description;

    private Long userId;

    private String username;

    private LocationResponse location;

    private Integer numLikes;

    private Boolean isLiked;

}
