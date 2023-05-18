package hr.fer.world.traveller.backend.model.user;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "refresh_token")
@Data
@NoArgsConstructor
public class RefreshToken {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "refresh_token_id_generator")
    @SequenceGenerator(name = "refresh_token_id_generator", sequenceName = "refresh_token_id_seq", allocationSize = 1)
    private Long id;

    @Column(name = "uuid")
    private String UUID;

    @Column(name = "expires")
    private long expires;

    @Column(name = "access_token_expires")
    private long accessTokenExpires;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public RefreshToken(String UUID, long expires, long accessTokenExpires,
                        User user) {
        this.UUID = UUID;
        this.expires = expires;
        this.accessTokenExpires = accessTokenExpires;
        this.user = user;
    }
}
