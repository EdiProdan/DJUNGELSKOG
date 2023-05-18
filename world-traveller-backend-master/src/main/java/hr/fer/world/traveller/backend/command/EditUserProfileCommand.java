package hr.fer.world.traveller.backend.command;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class EditUserProfileCommand {

    @NotBlank
    private String name;

    @NotBlank
    private String surname;

    @NotBlank
    private String email;

    private Boolean publicProfile;

    private byte[] image;

}
