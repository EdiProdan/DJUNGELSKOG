package hr.fer.world.traveller.backend.controller.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocationCoordinatesResponse {

    private Long id;

    private Double lat;

    private Double lng;

    private String name;

}
