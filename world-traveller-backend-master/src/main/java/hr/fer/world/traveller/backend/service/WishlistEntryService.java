package hr.fer.world.traveller.backend.service;

import hr.fer.world.traveller.backend.controller.request.BasicPageRequest;
import hr.fer.world.traveller.backend.controller.request.WishlistEntryRequest;
import hr.fer.world.traveller.backend.controller.response.WishlistEntryResponse;

import java.util.List;

public interface WishlistEntryService {

    void save(Long userId, WishlistEntryRequest request);

    List<WishlistEntryResponse> getAllWishlistEntries(Long userId);

    List<WishlistEntryResponse> getWishlistEntries(Long userId, BasicPageRequest request);

    void deleteById(Long userId, Long wishlistEntryId);

}
