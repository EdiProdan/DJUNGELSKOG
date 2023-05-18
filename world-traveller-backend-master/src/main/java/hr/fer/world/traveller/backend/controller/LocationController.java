package hr.fer.world.traveller.backend.controller;

import hr.fer.world.traveller.backend.controller.request.CityRequest;
import hr.fer.world.traveller.backend.controller.request.LocationRequest;
import hr.fer.world.traveller.backend.controller.response.CityResponse;
import hr.fer.world.traveller.backend.controller.response.FullLocationResponse;
import hr.fer.world.traveller.backend.controller.response.LocationCoordinatesResponse;
import hr.fer.world.traveller.backend.service.LocationService;
import hr.fer.world.traveller.backend.util.UserContextUtil;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(path = "/api/locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<FullLocationResponse> getAllLocations() {
        return locationService.getAllLocations();
    }

    @GetMapping("/{locationId}")
    @ResponseStatus(HttpStatus.OK)
    public FullLocationResponse getLocation(@PathVariable Long locationId) {
        return locationService.getLocation(locationId);
    }

    @GetMapping("/approved")
    @ResponseStatus(HttpStatus.OK)
    public List<FullLocationResponse> getAllApprovedLocations() {
        return locationService.getAllApprovedLocations();
    }

    @GetMapping("/suggestions")
    @ResponseStatus(HttpStatus.OK)
    public List<FullLocationResponse> getAllSuggestedLocations() {
        return locationService.getAllSuggestedLocations();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public void postLocation(@Valid @RequestBody LocationRequest request) {
        locationService.saveNewLocation(request);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void updateLocation(@PathVariable Long id, @Valid @RequestBody LocationRequest request) {
        locationService.updateLocation(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteLocation(@PathVariable Long id) {
        locationService.deleteLocation(id);
    }


    @GetMapping("/visited")
    @ResponseStatus(HttpStatus.OK)
    public List<LocationCoordinatesResponse> getVisitedGeodata() {
        Long userId = UserContextUtil.getUser().getId();

        return locationService.getCoordinatesVisitedByUser(userId);
    }

    @GetMapping("/cities")
    @ResponseStatus(HttpStatus.OK)
    public List<CityResponse> getAllCities() {
        return locationService.getAllCities();
    }

    @PostMapping("/cities/find")
    @ResponseStatus(HttpStatus.OK)
    public CityResponse findCityByName(@Valid @RequestBody CityRequest request) {
        return locationService.getCityByName(request);
    }
}
