package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.dto.profession.ProfessionRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.profession.ProfessionResponseDTO;

import java.util.List;

//ProfessionService để quản lý các ngành nghề.
public interface IProfessionService {

    ProfessionResponseDTO createProfession(ProfessionRequestDTO professionRequestDTO);

    ProfessionResponseDTO getProfessionById(Long id);

    List<ProfessionResponseDTO> getAllProfessions();

    ProfessionResponseDTO updateProfession(Long id, ProfessionRequestDTO professionRequestDTO);

    void deleteProfession(Long id);

    List<ProfessionResponseDTO> getProfessionsByIndustryId(Long industryId);
}
