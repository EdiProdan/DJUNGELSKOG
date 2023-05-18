package hr.fer.world.traveller.backend.controller.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WishlistEntryRequest {

    @NotNull
    private Long locationId;

    @NotNull
    private LocalDate visitBefore;

}
