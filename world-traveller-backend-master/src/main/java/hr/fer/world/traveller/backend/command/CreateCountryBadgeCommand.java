package hr.fer.world.traveller.backend.command;

import lombok.Data;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class CreateCountryBadgeCommand {

    @NotBlank
    private String badgeName;

    @NotNull
    private Boolean visitCapitalCity;

    @Range(min = 1)
    private Integer requiredNumber;

    private String type;

    private byte[] image;
}
