package com.codeforworks.NTH_WorkFinder.mapper;

import com.codeforworks.NTH_WorkFinder.dto.industry.IndustryRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.industry.IndustryResponseDTO;
import com.codeforworks.NTH_WorkFinder.model.Industry;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface IndustryMapper {
    IndustryMapper INSTANCE = Mappers.getMapper(IndustryMapper.class);

    Industry toIndustryEntity(IndustryRequestDTO dto);

    IndustryResponseDTO toIndustryResponseDTO(Industry industry);
}