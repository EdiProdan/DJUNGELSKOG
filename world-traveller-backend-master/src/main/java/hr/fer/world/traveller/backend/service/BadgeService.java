package hr.fer.world.traveller.backend.service;

import hr.fer.world.traveller.backend.command.CreateCityBadgeCommand;
import hr.fer.world.traveller.backend.command.CreateCountryBadgeCommand;
import hr.fer.world.traveller.backend.controller.request.BasicPageRequest;
import hr.fer.world.traveller.backend.controller.response.BadgeResponse;
import hr.fer.world.traveller.backend.controller.response.WonBadgeResponse;

import java.util.List;

public interface BadgeService {
    void createCountryBadge(CreateCountryBadgeCommand command);

    void createCityBadge(CreateCityBadgeCommand command);

    List<WonBadgeResponse> getAllWonBadges(Long userId);

    List<WonBadgeResponse> getRecentlyWonBadges(Long userId, BasicPageRequest pageRequest);

    void markCompletedBadges(Long userId, Long locationId);

    List<BadgeResponse> getAllNotWonBadges(Long userId);

    List<BadgeResponse> getAllBadges();
}
