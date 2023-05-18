package hr.fer.world.traveller.backend.mapper;

import hr.fer.world.traveller.backend.command.CreateCityBadgeCommand;
import hr.fer.world.traveller.backend.model.badge.CityBadge;
import hr.fer.world.traveller.backend.model.badge.CityBadgeRequirement;
import hr.fer.world.traveller.backend.model.location.LocationType;
import org.springframework.stereotype.Component;

@Component
public class CreateCityBadgeCityBadgeMapper implements Mapper<CreateCityBadgeCommand, CityBadge>{

    private final GenericMapper genericMapper;

    public CreateCityBadgeCityBadgeMapper(GenericMapper genericMapper) {
        this.genericMapper = genericMapper;
    }

    @Override
    public CityBadge map(CreateCityBadgeCommand from) {
        final CityBadge newBadge = genericMapper.map(from, CityBadge.class);
        newBadge.setRequirements(genericMapper.mapToList(from.getRequirements(), CityBadgeRequirement.class));
        newBadge.getRequirements().stream().forEach(cityBadgeRequirement -> {
            cityBadgeRequirement.setBadge(newBadge);
        });
        newBadge.setName(from.getBadgeName());
        newBadge.setImage(from.getImage());
        return newBadge;
    }
}
