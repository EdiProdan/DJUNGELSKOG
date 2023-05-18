package hr.fer.world.traveller.backend.model.location;

import lombok.*;

import javax.persistence.*;
import java.util.Collection;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class City {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "city_id_generator")
    @SequenceGenerator(name = "city_id_generator", sequenceName = "city_id_seq", allocationSize = 1)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "country_code", nullable = false)
    private Country country;

    @Column(name = "capital", nullable = false)
    private Boolean capital;

    @OneToMany(mappedBy = "city")
    private Collection<Location> locations;

}
