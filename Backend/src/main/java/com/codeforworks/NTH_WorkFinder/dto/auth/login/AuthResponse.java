package com.codeforworks.NTH_WorkFinder.dto.auth.login;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class AuthResponse {
    private String jwtToken;   // Nếu bạn muốn chứa jwt token trong phản hồi
    private String accountType;

    // Constructor nhận accountType
    public AuthResponse( String jwtToken,String accountType) {
        this.jwtToken = jwtToken;
        this.accountType = accountType;
    }

}
