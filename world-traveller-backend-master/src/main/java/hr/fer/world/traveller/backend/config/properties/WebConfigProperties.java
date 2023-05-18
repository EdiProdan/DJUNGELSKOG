package hr.fer.world.traveller.backend.config.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "web.cors")
@Getter
@Setter
public class WebConfigProperties {

    private String[] allowedOrigins;

    private String[] allowedMethods;

    private long maxAge;
}
