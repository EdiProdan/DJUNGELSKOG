package hr.fer.world.traveller.backend.repository.user;

import hr.fer.world.traveller.backend.model.user.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByUUID(String UUID);

    void deleteByUUID(String UUID);

    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.expires < EXTRACT (EPOCH FROM CURRENT_TIMESTAMP)")
    void deleteAllInactive();

}
