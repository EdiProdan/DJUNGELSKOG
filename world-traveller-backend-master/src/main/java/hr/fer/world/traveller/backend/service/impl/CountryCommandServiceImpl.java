package hr.fer.world.traveller.backend.service.impl;

import hr.fer.world.traveller.backend.model.location.Country;
import hr.fer.world.traveller.backend.repository.location.CountryRepository;
import hr.fer.world.traveller.backend.service.CountryCommandService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class CountryCommandServiceImpl implements CountryCommandService {

    private final CountryRepository countryRepository;

    @Value("classpath:data/countries.json")
    private Resource resourceFile;

    public CountryCommandServiceImpl(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    @Override
    public void createCountries() throws Exception {
        try {
            BufferedReader bufferedReader = new BufferedReader(new FileReader(resourceFile.getFile()));

            int i = 0;
            List<Country> countries = new ArrayList<>();
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                if (i < 2) {
                    i++;
                    continue;
                }

                line = line.substring(0, line.length() - 1);

                Pattern patternISO = Pattern.compile("\"ISO_A3\": \"(.*?)\"", Pattern.CASE_INSENSITIVE);
                Pattern patternADMIN = Pattern.compile("\"ADMIN\": \"(.*?)\"", Pattern.CASE_INSENSITIVE);
                Matcher matcherISO = patternISO.matcher(line);
                Matcher matcherADMIN = patternADMIN.matcher(line);

                if (!matcherISO.find() || !matcherADMIN.find()) {
                    continue;
                }
                String ISO = matcherISO.group(1);
                String ADMIN = matcherADMIN.group(1);

                Optional<Country> existingCountry = countryRepository.findByCode(ISO);
                if (existingCountry.isEmpty()) {
                    countries.add(new Country(ISO, ADMIN, line, false));
                    continue;
                }

                Country country = existingCountry.get();
                country.setName(ADMIN);
                country.setGeodata(line);
                countries.add(country);
            }

            countryRepository.saveAll(countries);
        } catch (IOException e) {
            throw new Exception();
        }
    }

    @Override
    public List<String> getGeodataFromCountriesVisitedByUser(Long userId) {
        return countryRepository.findDistinctVisitedByUser(userId).stream()
                .map(Country::getGeodata)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getWhitelistedGeodata() {
        return countryRepository.findAllByWhitelistedIsTrue().stream()
                .map(Country::getGeodata)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getWhitelistedNotVisitedGeodata(Long userId) {
        List<Country> countries = countryRepository.findAllByWhitelistedIsTrue();
        List<Country> visitedCountries = countryRepository.findDistinctVisitedByUser(userId);

        countries.removeAll(visitedCountries);

        return countries.stream()
                .map(Country::getGeodata)
                .collect(Collectors.toList());
    }
}
