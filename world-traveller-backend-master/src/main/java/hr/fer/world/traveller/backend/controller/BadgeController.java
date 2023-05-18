package hr.fer.world.traveller.backend.controller;

import hr.fer.world.traveller.backend.command.CreateCityBadgeCommand;
import hr.fer.world.traveller.backend.command.CreateCountryBadgeCommand;
import hr.fer.world.traveller.backend.controller.request.BasicPageRequest;
import hr.fer.world.traveller.backend.controller.response.BadgeResponse;
import hr.fer.world.traveller.backend.controller.response.WonBadgeResponse;
import hr.fer.world.traveller.backend.service.BadgeService;
import hr.fer.world.traveller.backend.util.UserContextUtil;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(path = "/api/badges")
public class BadgeController {

    private final BadgeService badgeService;

    public BadgeController(BadgeService badgeService) {
        this.badgeService = badgeService;
    }

    @PostMapping("/create/country")
    @ResponseStatus(HttpStatus.OK)
    public void createCountryBadge(@Valid @RequestBody CreateCountryBadgeCommand command) {
        badgeService.createCountryBadge(command);
    }

    @PostMapping("/create/city")
    @ResponseStatus(HttpStatus.OK)
    public void createCityBadge(@Valid @RequestBody CreateCityBadgeCommand command) {
        badgeService.createCityBadge(command);
    }

    @GetMapping("/won")
    @ResponseStatus(HttpStatus.OK)
    public List<WonBadgeResponse> getAllWonBadges() {
        Long userId = UserContextUtil.getUser().getId();

        return badgeService.getAllWonBadges(userId);
    }

    @GetMapping("/notWon")
    @ResponseStatus(HttpStatus.OK)
    public List<BadgeResponse> getAllNotWonBadges() {
        Long userId = UserContextUtil.getUser().getId();

        return badgeService.getAllNotWonBadges(userId);
    }

    @PostMapping("/recent")
    @ResponseStatus(HttpStatus.OK)
    public List<WonBadgeResponse> getRecentBadges(@Valid @RequestBody BasicPageRequest pageRequest) {
        Long userId = UserContextUtil.getUser().getId();

        return badgeService.getRecentlyWonBadges(userId, pageRequest);
    }

    @PostMapping("/recent/{id}")
    @ResponseStatus(HttpStatus.OK)
    public List<WonBadgeResponse> getRecentBadges(@Valid @RequestBody BasicPageRequest pageRequest, @PathVariable Long id) {
        return badgeService.getRecentlyWonBadges(id, pageRequest);
    }

    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public List<BadgeResponse> getAllBadges() {
        return badgeService.getAllBadges();
    }

}
