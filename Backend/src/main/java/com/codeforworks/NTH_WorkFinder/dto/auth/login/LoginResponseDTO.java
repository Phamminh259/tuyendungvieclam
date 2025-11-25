package com.codeforworks.NTH_WorkFinder.dto.auth.login;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponseDTO {
    private String message;
    private String token;
}
