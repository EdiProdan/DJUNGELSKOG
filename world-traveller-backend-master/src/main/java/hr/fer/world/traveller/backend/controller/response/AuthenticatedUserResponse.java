package hr.fer.world.traveller.backend.controller.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticatedUserResponse {

    private Long id;

    private String username;

    private String email;

    private boolean active;

    private String name;

    private String surname;

    private Set<String> roles;
}
