package hr.fer.world.traveller.backend.service.impl;

import hr.fer.world.traveller.backend.model.wishlist.WishlistEntry;
import hr.fer.world.traveller.backend.repository.user.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class WishlistServiceImpl {


    @Autowired
    private WishlistRepository repository;

    public WishlistEntry save(WishlistEntry entry) {
        return repository.save(entry);
    }

    public List<WishlistEntry> getAll() {
        return repository.findAll();
    }

    public WishlistEntry getById(long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteById(long id){
        repository.deleteById(id);
    }
}
