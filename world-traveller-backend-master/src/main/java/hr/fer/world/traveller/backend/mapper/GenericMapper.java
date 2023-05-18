package hr.fer.world.traveller.backend.mapper;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public interface GenericMapper {

    <F, T> T map(F from, Class<T> toClass);

    default <F, T> List<T> mapToList(Collection<F> from, Class<T> toClass) {
        return from.stream().map(f -> map(f, toClass)).collect(Collectors.toList());
    }

    default <F, T> Set<T> mapToSet(Collection<F> from, Class<T> toClass) {
        return from.stream().map(f -> map(f, toClass)).collect(Collectors.toSet());
    }
}
