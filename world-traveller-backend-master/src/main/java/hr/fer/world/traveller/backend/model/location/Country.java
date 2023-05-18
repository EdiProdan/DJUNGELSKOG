package hr.fer.world.traveller.backend.model.location;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.Collection;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Country {

    @Id
    @Column(name = "code")
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "geodata", nullable = false)
    private String geodata;

    @Column(name = "whitelisted", nullable = false)
    private boolean whitelisted;

    @OneToMany(mappedBy = "country")
    private Collection<City> cities;

    public Country(String code, String name, String geodata, boolean whitelisted) {
        this.code = code;
        this.name = name;
        this.geodata = geodata;
        this.whitelisted = whitelisted;
    }
}
