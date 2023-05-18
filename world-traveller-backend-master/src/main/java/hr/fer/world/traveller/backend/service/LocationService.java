package hr.fer.world.traveller.backend.service;

import hr.fer.world.traveller.backend.controller.request.CityRequest;
import hr.fer.world.traveller.backend.controller.request.LocationRequest;
import hr.fer.world.traveller.backend.controller.response.CityResponse;
import hr.fer.world.traveller.backend.controller.response.FullLocationResponse;
import hr.fer.world.traveller.backend.controller.response.LocationCoordinatesResponse;

import java.util.List;

public interface LocationService {

    List<LocationCoordinatesResponse> getCoordinatesVisitedByUser(Long userId);

    List<FullLocationResponse> getAllLocations();

    FullLocationResponse getLocation(Long id);

    List<FullLocationResponse> getAllApprovedLocations();

    List<FullLocationResponse> getAllSuggestedLocations();

    void saveNewLocation(LocationRequest request);

    void updateLocation(Long locationId, LocationRequest request);

    void deleteLocation(Long locationId);

    List<CityResponse> getAllCities();

    CityResponse getCityByName(CityRequest request);
}
