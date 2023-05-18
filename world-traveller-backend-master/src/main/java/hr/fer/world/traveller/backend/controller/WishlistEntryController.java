package hr.fer.world.traveller.backend.controller;

import hr.fer.world.traveller.backend.controller.request.BasicPageRequest;
import hr.fer.world.traveller.backend.controller.request.WishlistEntryRequest;
import hr.fer.world.traveller.backend.controller.response.WishlistEntryResponse;
import hr.fer.world.traveller.backend.service.WishlistEntryService;
import hr.fer.world.traveller.backend.util.UserContextUtil;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(path = "/api/wishlist")
public class WishlistEntryController {

    private final WishlistEntryService wishlistEntryService;

    public WishlistEntryController(WishlistEntryService wishlistEntryService) {
        this.wishlistEntryService = wishlistEntryService;
    }


    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public void postEntry(@Valid @RequestBody WishlistEntryRequest request) {
        Long userId = UserContextUtil.getUser().getId();

        wishlistEntryService.save(userId, request);
    }

    @PostMapping("/page")
    @ResponseStatus(HttpStatus.OK)
    public List<WishlistEntryResponse> getPage(@Valid @RequestBody BasicPageRequest pageRequest)  {
        Long userId = UserContextUtil.getUser().getId();

        return wishlistEntryService.getWishlistEntries(userId, pageRequest);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<WishlistEntryResponse> getAll()  {
        Long userId = UserContextUtil.getUser().getId();

        return wishlistEntryService.getAllWishlistEntries(userId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteById(@PathVariable Long id)  {
        Long userId = UserContextUtil.getUser().getId();

        wishlistEntryService.deleteById(userId, id);
    }
}
