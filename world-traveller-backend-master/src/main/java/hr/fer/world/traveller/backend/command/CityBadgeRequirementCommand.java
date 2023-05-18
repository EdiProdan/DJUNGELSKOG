package hr.fer.world.traveller.backend.command;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class CityBadgeRequirementCommand {

    @NotBlank
    private int requiredLocations;

    private String locationType;

}
