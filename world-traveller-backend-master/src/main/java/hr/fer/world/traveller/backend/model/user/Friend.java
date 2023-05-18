package hr.fer.world.traveller.backend.model.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@IdClass(FriendId.class)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Friend {

    @Id
    @Column(name = "from_user_id", nullable = false)
    private Long fromUserId;

    @ManyToOne
    @JoinColumn(name = "from_user_id", nullable = false, insertable = false, updatable = false)
    private UserProfile fromUser;

    @Id
    @Column(name = "to_user_id", nullable = false)
    private Long toUserId;

    @ManyToOne
    @JoinColumn(name = "to_user_id", nullable = false, insertable = false, updatable = false)
    private UserProfile toUser;

    @Column(name = "trip_friend", nullable = false)
    private boolean tripFriend;

}
