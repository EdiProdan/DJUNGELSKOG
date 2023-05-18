package hr.fer.world.traveller.backend.controller.request;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BasicPageRequest {

    @NotNull
    @Min(value = 0, message = "Page value must be at least 0.")
    private Integer page;

    @NotNull
    @Min(value = 1, message = "Size value must be at least 1.")
    private Integer size;

}
