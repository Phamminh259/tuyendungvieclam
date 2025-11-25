package com.codeforworks.NTH_WorkFinder.service.impl;

import com.codeforworks.NTH_WorkFinder.dto.skill.SkillRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.skill.SkillResponseDTO;
import com.codeforworks.NTH_WorkFinder.mapper.SkillMapper;
import com.codeforworks.NTH_WorkFinder.model.Skill;
import com.codeforworks.NTH_WorkFinder.repository.SkillRepository;
import com.codeforworks.NTH_WorkFinder.service.ISkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillService implements ISkillService {

    @Autowired
    private SkillRepository skillRepository;

    @Override
    public SkillResponseDTO createSkill(SkillRequestDTO skillRequestDTO) {
        // Kiểm tra xem tên kỹ năng đã tồn tại chưa
        if (skillRepository.existsBySkillName(skillRequestDTO.getSkillName())) {
            throw new RuntimeException("Tên kỹ năng đã tồn tại");
        }

        Skill skill = SkillMapper.INSTANCE.toSkillEntity(skillRequestDTO);
        Skill savedSkill = skillRepository.save(skill);
        return SkillMapper.INSTANCE.toSkillResponseDTO(savedSkill);
    }

    @Override
    public SkillResponseDTO getSkillById(Long id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kỹ năng"));
        return SkillMapper.INSTANCE.toSkillResponseDTO(skill);
    }

    @Override
    public List<SkillResponseDTO> getAllSkills() {
        List<Skill> skills = skillRepository.findAll();
        return skills.stream()
                .map(SkillMapper.INSTANCE::toSkillResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SkillResponseDTO updateSkill(Long id, SkillRequestDTO skillRequestDTO) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kỹ năng"));

        // Kiểm tra xem tên kỹ năng đã tồn tại chưa
        if (skillRepository.existsBySkillName(skillRequestDTO.getSkillName())) {
            throw new RuntimeException("Tên kỹ năng đã tồn tại");
        }

        skill.setSkillName(skillRequestDTO.getSkillName());
        Skill updatedSkill = skillRepository.save(skill);
        return SkillMapper.INSTANCE.toSkillResponseDTO(updatedSkill);
    }

    @Override
    public void deleteSkill(Long id) {
        if (!skillRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy kỹ năng");
        }
        skillRepository.deleteById(id);
    }
}
