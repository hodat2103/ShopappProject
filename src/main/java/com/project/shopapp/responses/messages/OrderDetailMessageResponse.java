package com.project.shopapp.responses.messages;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetailMessageResponse {
    @JsonProperty("message")
    private String message;

}
