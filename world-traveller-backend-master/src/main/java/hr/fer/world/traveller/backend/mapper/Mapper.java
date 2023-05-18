package hr.fer.world.traveller.backend.mapper;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public interface Mapper<F, T> {

    T map(F from);

    default List<T> mapToList(Collection<F> from) {
        return from.stream().map(this::map).collect(Collectors.toList());
    }

    default Set<T> mapToSet(Collection<F> from) {
        return from.stream().map(this::map).collect(Collectors.toSet());
    }
}
