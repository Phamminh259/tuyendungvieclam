package com.codeforworks.NTH_WorkFinder.dto.oauth2;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class OAuth2UserDTO {
    private String email;
    private String name;
}
