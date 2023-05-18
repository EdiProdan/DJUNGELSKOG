package hr.fer.world.traveller.backend.controller.request;

import hr.fer.world.traveller.backend.model.trip.TrafficRating;
import hr.fer.world.traveller.backend.model.trip.TransportationType;
import hr.fer.world.traveller.backend.model.trip.TripRating;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripCreateRequest {

    @NotNull
    private byte[] image;

    @NotNull
    private LocalDate dateVisited;

    @NotNull
    private TransportationType transportationType;

    @NotNull
    private TrafficRating trafficRating;

    @NotNull
    private Boolean solo;

    @NotNull
    private TripRating tripRating;

    @NotNull
    private String description;

    @NotNull
    private Boolean locationIsSuggestion;

    // if not suggested
    private Long locationId;

    // if suggested
    private LocationRequest locationSuggestion;

}
