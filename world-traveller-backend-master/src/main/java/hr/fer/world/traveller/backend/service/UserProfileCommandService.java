package hr.fer.world.traveller.backend.service;

import org.springframework.transaction.annotation.Transactional;

public interface UserProfileCommandService {

    void addFriend(Long userIdFrom, Long userIdTo);

    @Transactional
    void addCloseFriend(Long userIdFrom, Long userIdTo);

    void removeFriend(Long userIdFrom, Long userIdTo);

    @Transactional
    void removeCloseFriend(Long userIdFrom, Long userIdTo);
}
