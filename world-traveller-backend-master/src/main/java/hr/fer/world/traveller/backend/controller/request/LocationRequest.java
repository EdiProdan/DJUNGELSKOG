package hr.fer.world.traveller.backend.controller.request;

import hr.fer.world.traveller.backend.model.location.LocationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocationRequest {

    @NotNull
    private String name;

    @NotNull
    private Double lng;

    @NotNull
    private Double lat;

    @NotNull
    private LocationType type;

    @NotNull
    private String cityName;

    @NotNull
    private String countryCode;

    private Boolean isCapitalCity;

}
