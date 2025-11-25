package com.codeforworks.NTH_WorkFinder.dto.payment;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponeDTO implements Serializable {

    private String status;
    private String message;
    private String URL;
    
}