package hr.fer.world.traveller.backend.service;

import hr.fer.world.traveller.backend.controller.request.LocationRequest;
import hr.fer.world.traveller.backend.mapper.GenericMapper;
import hr.fer.world.traveller.backend.model.location.City;
import hr.fer.world.traveller.backend.model.location.Location;
import hr.fer.world.traveller.backend.model.location.LocationType;
import hr.fer.world.traveller.backend.repository.location.CityRepository;
import hr.fer.world.traveller.backend.repository.location.LocationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@SpringBootTest
public class LocationServiceTest {

    @Autowired
    private LocationService locationService;

    @MockBean
    private LocationRepository locationRepository;

    @MockBean
    private CityRepository cityRepository;

    private Location location1;
    private LocationRequest locationRequest1;
    private City city1;

    private Location location2;
    private LocationRequest locationRequest2;
    private City city2;

    @Autowired
    private GenericMapper mapper;

    @BeforeEach
    private void initData(){

        city1 = new City();
        city1.setId(1L);
        city1.setName("city1");

        locationRequest1 = new LocationRequest();
        locationRequest1.setName("location1");
        locationRequest1.setType(LocationType.MUSEUM);
        locationRequest1.setLng(1.0);
        locationRequest1.setLat(2.0);
        locationRequest1.setCityName(city1.getName());

        location1 = new Location();
        location1.setName(locationRequest1.getName());
        location1.setXCoordinate(locationRequest1.getLng());
        location1.setYCoordinate(locationRequest1.getLat());
        location1.setType(locationRequest1.getType());
        location1.setCity(city1);

        city2 = new City();
        city2.setId(2L);
        city2.setName("city2");

        locationRequest2 = new LocationRequest();
        locationRequest2.setName("location2");
        locationRequest2.setType(LocationType.OTHER);
        locationRequest2.setLng(1.0);
        locationRequest2.setLat(2.0);
        locationRequest2.setCityName(city2.getName());

        location2 = new Location();
        location2.setName(locationRequest2.getName());
        location2.setXCoordinate(locationRequest2.getLng());
        location2.setYCoordinate(locationRequest2.getLat());
        location2.setType(locationRequest2.getType());
        location2.setCity(city2);
    }

    @Test
    public void testSaveNewLocation(){
        LocationRequest locationRequest = locationRequest1;
        City requestCity = city1;
        Location expectedLocation = location1;

        Mockito.when(cityRepository.findByName(requestCity.getName())).thenReturn(Optional.of(requestCity));

        locationService.saveNewLocation(locationRequest);

        verify(locationRepository, times(1)).save(eq(expectedLocation));
    }

    @Test
    public void testUpdateLocation(){
        Long locationId = 1L;
        Location location = location1;
        LocationRequest updateRequest = locationRequest2;
        City requestCity = city2;

        Location updatedLocation = location2;

        Mockito.when(locationRepository.findById(locationId)).thenReturn(Optional.of(location));
        Mockito.when(cityRepository.findByName(updateRequest.getCityName())).thenReturn(Optional.of(requestCity));

        locationService.updateLocation(locationId, updateRequest);

        verify(locationRepository, times(1)).save(updatedLocation);
    }
}
