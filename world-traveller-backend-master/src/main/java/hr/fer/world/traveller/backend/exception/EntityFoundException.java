package hr.fer.world.traveller.backend.exception;

import lombok.Getter;

@Getter
public class EntityFoundException extends RuntimeException {

    private static final String ENTITY_FOUND = "%s with %s '%s' already exists";

    private final String property;

    private final String value;

    public EntityFoundException(Class<?> clazz, String property, String value) {
        super(String.format(ENTITY_FOUND, clazz.getSimpleName(), property, value));
        this.property = property;
        this.value = value;
    }
}
