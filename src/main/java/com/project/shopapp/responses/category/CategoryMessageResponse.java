package com.project.shopapp.responses.category;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryMessageResponse {
    @JsonProperty("message")
    private String message;

}

