package hr.fer.world.traveller.backend.command;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class LoginCommand {

    @NotBlank
    private String username;

    @NotBlank
    private String password;
}
