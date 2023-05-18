package hr.fer.world.traveller.backend.repository.user;

import hr.fer.world.traveller.backend.model.user.Friend;
import hr.fer.world.traveller.backend.model.user.FriendId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendRepository extends JpaRepository<Friend, FriendId> {
}
