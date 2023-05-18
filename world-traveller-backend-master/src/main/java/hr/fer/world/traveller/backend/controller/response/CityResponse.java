package hr.fer.world.traveller.backend.controller.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CityResponse {

    private Long id;

    private String name;

    private CountryResponse country;

    private Boolean capital;

}
