package com.codeforworks.NTH_WorkFinder.service.impl;

import com.codeforworks.NTH_WorkFinder.dto.profession.ProfessionRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.profession.ProfessionResponseDTO;
import com.codeforworks.NTH_WorkFinder.mapper.ProfessionMapper;
import com.codeforworks.NTH_WorkFinder.model.Industry;
import com.codeforworks.NTH_WorkFinder.model.Profession;
import com.codeforworks.NTH_WorkFinder.repository.IndustryRepository;
import com.codeforworks.NTH_WorkFinder.repository.ProfessionRepository;
import com.codeforworks.NTH_WorkFinder.service.IProfessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfessionService implements IProfessionService {

    @Autowired
    private ProfessionRepository professionRepository;

    @Autowired
    private IndustryRepository industryRepository;

    // Thêm phương thức kiểm tra tên trùng
    private void checkDuplicateName(String name, Long excludeId) {
        Profession existingProfession = professionRepository.findByNameIgnoreCase(name);
        if (existingProfession != null && !existingProfession.getId().equals(excludeId)) {
            throw new RuntimeException("Nghề nghiệp với tên '" + name + "' đã tồn tại!");
        }
    }

    @Override
    public ProfessionResponseDTO createProfession(ProfessionRequestDTO professionRequestDTO) {
        // Kiểm tra tên trùng khi thêm mới
        checkDuplicateName(professionRequestDTO.getName(), null);
        
        Industry industry = industryRepository.findById(professionRequestDTO.getIndustryId())
                .orElseThrow(() -> new RuntimeException("Industry not found"));

        Profession profession = ProfessionMapper.INSTANCE.toProfessionEntity(professionRequestDTO);
        profession.setIndustry(industry);

        Profession savedProfession = professionRepository.save(profession);
        return ProfessionMapper.INSTANCE.toProfessionResponseDTO(savedProfession);
    }

    @Override
    public ProfessionResponseDTO getProfessionById(Long id) {
        Profession profession = professionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profession not found"));
        return ProfessionMapper.INSTANCE.toProfessionResponseDTO(profession);
    }

    @Override
    public List<ProfessionResponseDTO> getAllProfessions() {
        List<Profession> professions = professionRepository.findAll();
        return professions.stream()
                .map(ProfessionMapper.INSTANCE::toProfessionResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProfessionResponseDTO updateProfession(Long id, ProfessionRequestDTO professionRequestDTO) {
        Profession profession = professionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profession not found"));

        // Kiểm tra tên trùng khi cập nhật
        checkDuplicateName(professionRequestDTO.getName(), id);

        Industry industry = industryRepository.findById(professionRequestDTO.getIndustryId())
                .orElseThrow(() -> new RuntimeException("Industry not found"));

        profession.setName(professionRequestDTO.getName());
        profession.setDescription(professionRequestDTO.getDescription());
        profession.setIndustry(industry);

        Profession updatedProfession = professionRepository.save(profession);
        return ProfessionMapper.INSTANCE.toProfessionResponseDTO(updatedProfession);
    }

    @Override
    public void deleteProfession(Long id) {
        if (!professionRepository.existsById(id)) {
            throw new RuntimeException("Profession not found");
        }
        professionRepository.deleteById(id);
    }

    @Override
    public List<ProfessionResponseDTO> getProfessionsByIndustryId(Long industryId) {
        // Kiểm tra industry có tồn tại không
        Industry industry = industryRepository.findById(industryId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy Industry với id: " + industryId));
            
        // Lấy danh sách profession theo industry
        List<Profession> professions = professionRepository.findByIndustryId(industryId);
        
        // Map sang DTO và trả về
        return professions.stream()
            .map(ProfessionMapper.INSTANCE::toProfessionResponseDTO)
            .collect(Collectors.toList());
    }
}