package com.codeforworks.NTH_WorkFinder.mapper;

import com.codeforworks.NTH_WorkFinder.dto.interview.InterviewResponseDTO;
import com.codeforworks.NTH_WorkFinder.model.Interview;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InterviewMapper {
    @Mapping(source = "application.id", target = "applicationId")
    @Mapping(source = "type", target = "type")
    @Mapping(source = "status", target = "status")
    @Mapping(target = "interviewDate", source = "interviewDate")
    @Mapping(target = "interviewTime", source = "interviewTime")
    InterviewResponseDTO toDTO(Interview interview);
} 