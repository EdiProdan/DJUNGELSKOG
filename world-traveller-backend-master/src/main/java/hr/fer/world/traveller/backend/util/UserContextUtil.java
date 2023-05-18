package hr.fer.world.traveller.backend.util;

import hr.fer.world.traveller.backend.model.principal.UserPrincipal;
import hr.fer.world.traveller.backend.model.user.User;
import org.springframework.security.core.context.SecurityContextHolder;

public class UserContextUtil {

    public static User getUser(){
        return ((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).user();
    }

}
