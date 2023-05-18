package hr.fer.world.traveller.backend.config;

import hr.fer.world.traveller.backend.model.user.Role;
import hr.fer.world.traveller.backend.model.user.RoleName;
import hr.fer.world.traveller.backend.repository.user.RoleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class RoleInitializingBean implements InitializingBean {

  private final RoleRepository roleRepository;

  public RoleInitializingBean(RoleRepository roleRepository) {
    this.roleRepository = roleRepository;
  }

  @Override
  public void afterPropertiesSet() throws Exception {
    final List<Role> roles = roleRepository.findAll();
    final List<String> newRoles = new ArrayList<>();

    for (RoleName roleName : RoleName.values()) {
      if (roles.stream().noneMatch(role -> role.getName().equals(roleName))) {
        roleRepository.save(new Role(roleName));
        newRoles.add(roleName.name());
      }
    }

    if (!newRoles.isEmpty()) {
      log.info("Added new roles: {}", newRoles);
    }
  }
}
