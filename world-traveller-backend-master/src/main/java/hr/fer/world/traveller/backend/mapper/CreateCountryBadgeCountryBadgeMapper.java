package hr.fer.world.traveller.backend.mapper;

import hr.fer.world.traveller.backend.command.CreateCountryBadgeCommand;
import hr.fer.world.traveller.backend.model.badge.CountryBadge;
import hr.fer.world.traveller.backend.model.badge.CountryBadgeType;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class CreateCountryBadgeCountryBadgeMapper implements Mapper<CreateCountryBadgeCommand, CountryBadge>{

    private final GenericMapper genericMapper;

    public CreateCountryBadgeCountryBadgeMapper(GenericMapper genericMapper) {
        this.genericMapper = genericMapper;
    }


    @Override
    public CountryBadge map(CreateCountryBadgeCommand from) {
        final CountryBadge newBadge = genericMapper.map(from, CountryBadge.class);
        if(Objects.equals(from.getType(), "Gradova")) {
            newBadge.setType(CountryBadgeType.CITY);
        } else if (Objects.equals(from.getType(), "Lokacija")) {
            newBadge.setType(CountryBadgeType.LOCATION);
        }
        newBadge.setName(from.getBadgeName());
        newBadge.setImage(from.getImage());
        return newBadge;
    }
}
