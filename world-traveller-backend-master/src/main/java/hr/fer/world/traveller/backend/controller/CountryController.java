package hr.fer.world.traveller.backend.controller;

import hr.fer.world.traveller.backend.service.CountryCommandService;
import hr.fer.world.traveller.backend.util.UserContextUtil;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/countries")
public class CountryController {
    private final CountryCommandService countryCommandService;


    public CountryController(CountryCommandService countryCommandService) {
        this.countryCommandService = countryCommandService;
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.OK)
    public void createCountries() throws Exception {
        countryCommandService.createCountries();
    }

    @GetMapping("/visited")
    @ResponseStatus(HttpStatus.OK)
    public List<String> getVisitedGeodata() {
        Long userId = UserContextUtil.getUser().getId();

        return countryCommandService.getGeodataFromCountriesVisitedByUser(userId);
    }

    @GetMapping("/whitelisted")
    @ResponseStatus(HttpStatus.OK)
    public List<String> getWhitelistedGeodata() {
        return countryCommandService.getWhitelistedGeodata();
    }

    @GetMapping("/whitelisted/notVisited")
    @ResponseStatus(HttpStatus.OK)
    public List<String> getWhitelistedNotVisitedGeodata() {
        Long userId = UserContextUtil.getUser().getId();

        return countryCommandService.getWhitelistedNotVisitedGeodata(userId);
    }

}


