package hr.fer.world.traveller.backend.repository.user;

import hr.fer.world.traveller.backend.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    User getByUsername(String username);

    User getUserById(Long id);
}
