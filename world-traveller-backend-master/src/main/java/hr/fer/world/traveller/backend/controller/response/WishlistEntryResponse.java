package hr.fer.world.traveller.backend.controller.response;

import hr.fer.world.traveller.backend.model.wishlist.WishlistEntryState;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WishlistEntryResponse {

    private Long id;

    private WishlistEntryState state;

    private LocationResponse location;

    private LocalDate visitBefore;
}