package hr.fer.world.traveller.backend.service;

import java.util.List;

public interface CountryCommandService {
    void createCountries() throws Exception;

    List<String> getGeodataFromCountriesVisitedByUser(Long userId);

    List<String> getWhitelistedGeodata();

    List<String> getWhitelistedNotVisitedGeodata(Long userId);
}
