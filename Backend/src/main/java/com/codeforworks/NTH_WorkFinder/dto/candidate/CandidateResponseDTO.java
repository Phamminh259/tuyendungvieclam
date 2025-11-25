package com.codeforworks.NTH_WorkFinder.dto.candidate;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class CandidateResponseDTO {
    private Long id;
    private String fullName; // Tên đầy đủ từ User
    private String email; // Email từ User
    private String phone;
    private String address;
    private Date birthday;
    private Boolean sex;
    private String location;
    private String avatar;
    private String attachedFile;
}