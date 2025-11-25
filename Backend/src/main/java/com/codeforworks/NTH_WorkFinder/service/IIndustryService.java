package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.dto.industry.IndustryRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.industry.IndustryResponseDTO;

import java.util.List;

//IndustryService để quản lý các ngành công nghiệp.
public interface IIndustryService {

    IndustryResponseDTO createIndustry(IndustryRequestDTO industryRequestDTO);

    IndustryResponseDTO getIndustryById(Long id);

    List<IndustryResponseDTO> getAllIndustries();

    IndustryResponseDTO updateIndustry(Long id, IndustryRequestDTO industryRequestDTO);

    void deleteIndustry(Long id);
}