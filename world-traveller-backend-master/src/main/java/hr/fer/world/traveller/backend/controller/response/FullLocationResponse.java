package hr.fer.world.traveller.backend.controller.response;

import hr.fer.world.traveller.backend.model.location.LocationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FullLocationResponse {

    private Long id;

    private String name;

    private Double lat;

    private Double lng;

    private LocationType type;

    private Long cityId;

    private String cityName;

    private boolean isCapitalCity;

    private String countryCode;

    private String countryName;

    private String suggestedBy;

}
