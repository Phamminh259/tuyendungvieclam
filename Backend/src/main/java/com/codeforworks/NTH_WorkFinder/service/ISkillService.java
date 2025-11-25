package com.codeforworks.NTH_WorkFinder.service;

import com.codeforworks.NTH_WorkFinder.dto.skill.SkillRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.skill.SkillResponseDTO;

import java.util.List;

public interface ISkillService {

    SkillResponseDTO createSkill(SkillRequestDTO skillRequestDTO);

    SkillResponseDTO getSkillById(Long id);

    List<SkillResponseDTO> getAllSkills();

    SkillResponseDTO updateSkill(Long id, SkillRequestDTO skillRequestDTO);

    void deleteSkill(Long id);
}