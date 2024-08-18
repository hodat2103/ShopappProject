package com.project.shopapp.responses.order;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderMessageResponse {
    @JsonProperty("message")
    private String message;

}
