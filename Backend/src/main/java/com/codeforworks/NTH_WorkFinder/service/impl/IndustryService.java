package com.codeforworks.NTH_WorkFinder.service.impl;

import com.codeforworks.NTH_WorkFinder.dto.industry.IndustryRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.industry.IndustryResponseDTO;
import com.codeforworks.NTH_WorkFinder.mapper.IndustryMapper;
import com.codeforworks.NTH_WorkFinder.model.Industry;
import com.codeforworks.NTH_WorkFinder.repository.IndustryRepository;
import com.codeforworks.NTH_WorkFinder.service.IIndustryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IndustryService implements IIndustryService {

    @Autowired
    private IndustryRepository industryRepository;

    private void checkDuplicateName(String name, Long excludeId) {
        Industry existingIndustry = industryRepository.findByNameIgnoreCase(name);
        if (existingIndustry != null && !existingIndustry.getId().equals(excludeId)) {
            throw new RuntimeException("Ngành nghề với tên '" + name + "' đã tồn tại!");
        }
    }

    @Override
    public IndustryResponseDTO createIndustry(IndustryRequestDTO industryRequestDTO) {
        checkDuplicateName(industryRequestDTO.getName(), null);
        
        Industry industry = IndustryMapper.INSTANCE.toIndustryEntity(industryRequestDTO);
        Industry savedIndustry = industryRepository.save(industry);
        return IndustryMapper.INSTANCE.toIndustryResponseDTO(savedIndustry);
    }

    @Override
    public IndustryResponseDTO getIndustryById(Long id) {
        Industry industry = industryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Industry not found"));
        return IndustryMapper.INSTANCE.toIndustryResponseDTO(industry);
    }

    @Override
    public List<IndustryResponseDTO> getAllIndustries() {
        List<Industry> industries = industryRepository.findAll();
        return industries.stream()
                .map(IndustryMapper.INSTANCE::toIndustryResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public IndustryResponseDTO updateIndustry(Long id, IndustryRequestDTO industryRequestDTO) {
        checkDuplicateName(industryRequestDTO.getName(), id);
        
        Industry industry = industryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Industry not found"));

        industry.setName(industryRequestDTO.getName());
        industry.setDescription(industryRequestDTO.getDescription());

        Industry updatedIndustry = industryRepository.save(industry);
        return IndustryMapper.INSTANCE.toIndustryResponseDTO(updatedIndustry);
    }

    @Override
    public void deleteIndustry(Long id) {
        if (!industryRepository.existsById(id)) {
            throw new RuntimeException("Industry not found");
        }
        industryRepository.deleteById(id);
    }
}