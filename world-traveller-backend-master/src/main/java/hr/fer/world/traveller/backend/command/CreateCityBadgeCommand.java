package hr.fer.world.traveller.backend.command;

import lombok.Data;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
public class CreateCityBadgeCommand {

    @NotBlank
    private String badgeName;

    private byte[] image;

    @Range(min = 1)
    private Integer requiredLocations;

    private List<CityBadgeRequirementCommand> requirements;
}
