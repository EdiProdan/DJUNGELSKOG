package hr.fer.world.traveller.backend.service.impl;

import hr.fer.world.traveller.backend.model.user.Friend;
import hr.fer.world.traveller.backend.model.user.FriendId;
import hr.fer.world.traveller.backend.model.user.UserProfile;
import hr.fer.world.traveller.backend.repository.user.FriendRepository;
import hr.fer.world.traveller.backend.repository.user.UserProfileRepository;
import hr.fer.world.traveller.backend.service.UserProfileCommandService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;

@Service
public class UserProfileCommandServiceImpl implements UserProfileCommandService {

    private final UserProfileRepository userProfileRepository;

    private final FriendRepository friendRepository;

    public UserProfileCommandServiceImpl(UserProfileRepository userProfileRepository, FriendRepository friendRepository) {
        this.userProfileRepository = userProfileRepository;
        this.friendRepository = friendRepository;
    }


    @Override
    @Transactional
    public void addFriend(Long userIdFrom, Long userIdTo) {
        UserProfile userProfileFrom = userProfileRepository.findById(userIdFrom)
                .orElseThrow(() -> new EntityNotFoundException("User with the given id not found"));

        UserProfile userProfileTo= userProfileRepository.findById(userIdTo)
                .orElseThrow(() -> new EntityNotFoundException("User with the given id not found"));


        Friend friend = new Friend();
        friend.setFromUserId(userIdFrom);
        friend.setToUserId(userIdTo);
        friend.setTripFriend(false);

        friendRepository.save(friend);
    }

    @Override
    @Transactional
    public void addCloseFriend(Long userIdFrom, Long userIdTo) {
        UserProfile userProfileFrom = userProfileRepository.findById(userIdFrom)
                .orElseThrow(() -> new EntityNotFoundException("User with the given id not found"));

        UserProfile userProfileTo= userProfileRepository.findById(userIdTo)
                .orElseThrow(() -> new EntityNotFoundException("User with the given id not found"));


        FriendId friendId = new FriendId(userIdFrom, userIdTo);

        Friend friend = friendRepository.findById(friendId)
                .orElseThrow(() -> new EntityNotFoundException("You are not friends with the given user"));

        friend.setTripFriend(true);
    }

    @Override
    @Transactional
    public void removeFriend(Long userIdFrom, Long userIdTo) {
        UserProfile userProfileFrom = userProfileRepository.findById(userIdFrom)
                .orElseThrow(() -> new EntityNotFoundException("User with the given id not found"));

        UserProfile userProfileTo= userProfileRepository.findById(userIdTo)
                .orElseThrow(() -> new EntityNotFoundException("User with the given id not found"));

        FriendId friendId = new FriendId(userIdFrom, userIdTo);
        friendRepository.findById(friendId)
                .ifPresent((f) -> friendRepository.deleteById(friendId));
    }

    @Override
    @Transactional
    public void removeCloseFriend(Long userIdFrom, Long userIdTo) {
        UserProfile userProfileFrom = userProfileRepository.findById(userIdFrom)
                .orElseThrow(() -> new EntityNotFoundException("User with the given id not found"));

        UserProfile userProfileTo= userProfileRepository.findById(userIdTo)
                .orElseThrow(() -> new EntityNotFoundException("User with the given id not found"));


        FriendId friendId = new FriendId(userIdFrom, userIdTo);

        Friend friend = friendRepository.findById(friendId)
                .orElseThrow(() -> new EntityNotFoundException("You are not friends with the given user"));

        friend.setTripFriend(false);
    }


}
