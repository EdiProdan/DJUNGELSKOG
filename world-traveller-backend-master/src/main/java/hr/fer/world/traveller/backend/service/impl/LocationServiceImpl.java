package hr.fer.world.traveller.backend.service.impl;

import hr.fer.world.traveller.backend.controller.request.CityRequest;
import hr.fer.world.traveller.backend.controller.request.LocationRequest;
import hr.fer.world.traveller.backend.controller.response.*;
import hr.fer.world.traveller.backend.model.location.City;
import hr.fer.world.traveller.backend.model.location.Country;
import hr.fer.world.traveller.backend.model.location.Location;
import hr.fer.world.traveller.backend.repository.location.CityRepository;
import hr.fer.world.traveller.backend.repository.location.CountryRepository;
import hr.fer.world.traveller.backend.repository.location.LocationRepository;
import hr.fer.world.traveller.backend.service.LocationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LocationServiceImpl implements LocationService {

    private final LocationRepository locationRepository;

    private final CityRepository cityRepository;

    private final CountryRepository countryRepository;

    public LocationServiceImpl(LocationRepository locationRepository, CityRepository cityRepository,
                               CountryRepository countryRepository) {
        this.locationRepository = locationRepository;
        this.cityRepository = cityRepository;
        this.countryRepository = countryRepository;
    }

    @Override
    @Transactional
    public List<LocationCoordinatesResponse> getCoordinatesVisitedByUser(Long userId) {
        return locationRepository.findDistinctVisitedByUser(userId).stream()
                .map(location -> new LocationCoordinatesResponse(
                        location.getId(),
                        location.getXCoordinate(),
                        location.getYCoordinate(),
                        location.getName()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<FullLocationResponse> getAllLocations() {
        return locationRepository.findAll().stream()
                .sorted(Comparator.comparing(Location::getName))
                .map(location -> new FullLocationResponse(
                        location.getId(),
                        location.getName(),
                        location.getYCoordinate(),
                        location.getYCoordinate(),
                        location.getType(),
                        location.getCity() != null ? location.getCity().getId() : null,
                        location.getCity() != null ? location.getCity().getName() : null,
                        location.getCity() != null ? location.getCity().getCapital() : false,
                        location.getCity() != null ? location.getCity().getCountry().getCode() : null,
                        location.getCity() != null ? location.getCity().getCountry().getName() : null,
                        null))
                .collect(Collectors.toList());
    }

    @Override
    public FullLocationResponse getLocation(Long locationId) {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new EntityNotFoundException("Location with the given id not found."));

        return new FullLocationResponse(
                location.getId(),
                location.getName(),
                location.getXCoordinate(),
                location.getYCoordinate(),
                location.getType(),
                location.getCity().getId(),
                location.getCity().getName(),
                location.getCity().getCapital(),
                location.getCity().getCountry().getCode(),
                location.getCity().getCountry().getName(),
                null
        );
    }

    @Override
    public List<FullLocationResponse> getAllApprovedLocations() {
        return locationRepository.findAll().stream()
                .sorted(Comparator.comparing(Location::getName))
                .filter(location -> !location.isSuggestion())
                .map(location -> new FullLocationResponse(
                        location.getId(),
                        location.getName(),
                        location.getXCoordinate(),
                        location.getYCoordinate(),
                        location.getType(),
                        location.getCity().getId(),
                        location.getCity().getName(),
                        location.getCity().getCapital(),
                        location.getCity().getCountry().getCode(),
                        location.getCity().getCountry().getName(),
                        null))
                .collect(Collectors.toList());
    }

    @Override
    public List<FullLocationResponse> getAllSuggestedLocations() {
        return locationRepository.findAll().stream()
                .sorted(Comparator.comparing(Location::getName))
                .filter(Location::isSuggestion)
                .map(location -> new FullLocationResponse(
                        location.getId(),
                        location.getName(),
                        location.getXCoordinate(),
                        location.getYCoordinate(),
                        location.getType(),
                        null,
                        null,
                        false,
                        null,
                        null,
                        location.getSuggestedByUser().getName()
                        ))
                .collect(Collectors.toList());

    }

    @Override
    @Transactional
    public void saveNewLocation(LocationRequest request) {
        locationRepository.findByName(request.getName()).ifPresent(location -> {
            throw new EntityExistsException("Location with name " + request.getName() + " already exists");
        });

        Location location = new Location();

        location.setName(request.getName());
        location.setXCoordinate(request.getLat());
        location.setYCoordinate(request.getLng());
        location.setType(request.getType());

        Optional<City> city = cityRepository.findByName(request.getCityName());
        if (city.isPresent()) {
            location.setCity(city.get());
            locationRepository.save(location);
            return;
        }

        City newCity = new City();
        newCity.setName(request.getCityName());
        Country country = countryRepository.findById(request.getCountryCode())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Country with id " + request.getCountryCode() + " not found"));
        newCity.setCountry(country);
        newCity.setCapital(request.getIsCapitalCity());

        location.setCity(newCity);
        cityRepository.save(newCity);
        locationRepository.save(location);
    }

    @Override
    @Transactional
    public void updateLocation(Long locationId, LocationRequest request) {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new EntityNotFoundException("Location with the given id not found."));

        location.setName(request.getName());
        location.setXCoordinate(request.getLat());
        location.setYCoordinate(request.getLng());
        location.setType(request.getType());
        location.setSuggestion(false);

        Optional<City> city = cityRepository.findByName(request.getCityName());
        if (city.isPresent()) {
            location.setCity(city.get());
            locationRepository.save(location);
            return;
        }

        City newCity = new City();
        newCity.setName(request.getCityName());
        Country country = countryRepository.findById(request.getCountryCode())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Country with id " + request.getCountryCode() + " not found"));
        newCity.setCountry(country);
        newCity.setCapital(request.getIsCapitalCity());

        locationRepository.save(location);
    }

    @Override
    public void deleteLocation(Long locationId) {
        locationRepository.deleteById(locationId);
    }

    @Override
    public List<CityResponse> getAllCities() {
        return cityRepository.findAll().stream()
                .map(city -> new CityResponse(
                        city.getId(),
                        city.getName(),
                        new CountryResponse(city.getCountry().getCode(), city.getCountry().getName()),
                        city.getCapital())
                )
                .collect(Collectors.toList());
    }

    @Override
    public CityResponse getCityByName(CityRequest request) {
        return cityRepository.findByName(request.getName())
                .map(city -> new CityResponse(
                        city.getId(),
                        city.getName(),
                        new CountryResponse(city.getCountry().getCode(), city.getCountry().getName()),
                        city.getCapital())
                )
                .orElseThrow(() -> new EntityNotFoundException("City with the given name not found."));
    }
}
