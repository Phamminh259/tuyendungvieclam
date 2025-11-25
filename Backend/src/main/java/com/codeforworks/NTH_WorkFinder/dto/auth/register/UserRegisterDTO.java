package com.codeforworks.NTH_WorkFinder.dto.auth.register;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegisterDTO {
    private String fullName;
    private String phone;
    private String email;
    private String password;
    private String confirmPassword;

}
