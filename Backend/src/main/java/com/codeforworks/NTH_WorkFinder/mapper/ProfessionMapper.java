package com.codeforworks.NTH_WorkFinder.mapper;

import com.codeforworks.NTH_WorkFinder.dto.profession.ProfessionRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.profession.ProfessionResponseDTO;
import com.codeforworks.NTH_WorkFinder.model.Profession;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ProfessionMapper {
    ProfessionMapper INSTANCE = Mappers.getMapper(ProfessionMapper.class);

    @Mapping(target = "industryName", source = "industry.name")
    ProfessionResponseDTO toProfessionResponseDTO(Profession profession);

    @Mapping(target = "industry", ignore = true)
    Profession toProfessionEntity(ProfessionRequestDTO professionRequestDTO);
}