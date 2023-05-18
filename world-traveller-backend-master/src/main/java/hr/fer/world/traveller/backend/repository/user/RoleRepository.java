package hr.fer.world.traveller.backend.repository.user;

import hr.fer.world.traveller.backend.model.user.Role;
import hr.fer.world.traveller.backend.model.user.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;
import java.util.Set;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Set<Role> findByNameIn(Collection<RoleName> roleNames);

    Optional<Role> findByName(RoleName roleName);
}
