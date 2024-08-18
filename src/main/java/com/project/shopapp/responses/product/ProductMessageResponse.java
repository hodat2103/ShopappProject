package com.project.shopapp.responses.product;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductMessageResponse {
    @JsonProperty("message")
    private String message;

}
