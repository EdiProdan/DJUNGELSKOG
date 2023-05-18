package hr.fer.world.traveller.backend.mapper.impl;

import hr.fer.world.traveller.backend.mapper.GenericMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class GenericMapperImpl implements GenericMapper {

    private final ModelMapper modelMapper;

    @Autowired
    public GenericMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    @Override
    public <F, T> T map(F from, Class<T> toClass) {
        return modelMapper.map(from, toClass);
    }
}
