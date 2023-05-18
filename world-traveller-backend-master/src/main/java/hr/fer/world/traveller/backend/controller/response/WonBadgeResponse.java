package hr.fer.world.traveller.backend.controller.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class WonBadgeResponse {

    private Long id;

    private String name;

    private String description;

    private byte[] image;

    private LocalDateTime date;

}
