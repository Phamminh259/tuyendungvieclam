package com.codeforworks.NTH_WorkFinder.dto.account;

import lombok.Data;
import java.util.Date;

@Data
public class AccountResponseDTO {
    private Long id;
    private String email;
    private String role;      // ADMIN, EMPLOYER, USER
    private String status;    // ACTIVE, INACTIVE
    private Date createdDate;
    private Date updatedDate;
} 