package com.codeforworks.NTH_WorkFinder.dto.candidate;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkHistoryDTO {
    private Long id;
    private Long candidateId;
    private String companyName;
    private String position;
    private Date startDate;
    private Date endDate;
    private String description;
    private Boolean isCurrentJob;
}
