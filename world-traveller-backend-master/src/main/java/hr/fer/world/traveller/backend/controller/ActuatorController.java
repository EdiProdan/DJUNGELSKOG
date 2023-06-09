package hr.fer.world.traveller.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/actuator/")
public class ActuatorController {

    @GetMapping("/health")
    @ResponseStatus(HttpStatus.OK)
    public void healthCheck() {}
}
