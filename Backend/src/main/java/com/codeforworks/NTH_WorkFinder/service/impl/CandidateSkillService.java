package com.codeforworks.NTH_WorkFinder.service.impl;

import com.codeforworks.NTH_WorkFinder.dto.candidate.CandidateProfileDTO;
import com.codeforworks.NTH_WorkFinder.dto.candidate.CandidateSkillRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.candidate.CandidateSkillResponseDTO;
import com.codeforworks.NTH_WorkFinder.mapper.CandidateMapper;
import com.codeforworks.NTH_WorkFinder.mapper.CandidateSkillMapper;
import com.codeforworks.NTH_WorkFinder.model.Candidate;
import com.codeforworks.NTH_WorkFinder.model.CandidateSkill;
import com.codeforworks.NTH_WorkFinder.model.Skill;
import com.codeforworks.NTH_WorkFinder.repository.CandidateRepository;
import com.codeforworks.NTH_WorkFinder.repository.CandidateSkillRepository;
import com.codeforworks.NTH_WorkFinder.repository.SkillRepository;
import com.codeforworks.NTH_WorkFinder.service.ICandidateSkillService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CandidateSkillService implements ICandidateSkillService {

    @Autowired
    private CandidateSkillRepository candidateSkillRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private SkillRepository skillRepository;

    // Validate mức độ thành thạo của kỹ năng
    private void validateProficiencyLevel(String level) {
        try {
            CandidateSkill.ProficiencyLevel.valueOf(level);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Mức độ thành thạo không hợp lệ");
        }
    }

    // Validate quyền truy cập của candidate
    private void validateCandidateAccess(Long candidateId) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Candidate"));
        if (!candidate.getUser().getAccount().getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("Không có quyền truy cập thông tin của candidate này");
        }
    }

    // Thêm kỹ năng cho ứng viên
    @Override
    public CandidateProfileDTO addSkillToCandidate(Long candidateId, CandidateSkillRequestDTO dto) {
        validateProficiencyLevel(dto.getProficiencyLevel());
        validateCandidateAccess(candidateId);

        // Lấy ứng viên từ database
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Candidate"));

        // Lấy kỹ năng từ database
        Skill skill = skillRepository.findById(dto.getSkillId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Skill"));

        // Kiểm tra nếu ứng viên đã có kỹ năng này rồi
        boolean exists = candidateSkillRepository.existsByCandidateAndSkill(candidate, skill);
        if (exists) {
            throw new RuntimeException("Ứng viên đã có kỹ năng này.");
        }

        // Tạo CandidateSkill
        CandidateSkill candidateSkill = new CandidateSkill();
        candidateSkill.setCandidate(candidate);
        candidateSkill.setSkill(skill);
        candidateSkill.setProficiencyLevel(CandidateSkill.ProficiencyLevel.valueOf(dto.getProficiencyLevel()));

        // Lưu kỹ năng vào database
        candidateSkillRepository.save(candidateSkill);

        // Lấy lại thông tin ứng viên sau khi thêm kỹ năng
        CandidateProfileDTO candidateProfileDTO = CandidateMapper.INSTANCE.toCandidateProfileDTO(candidate);
        return candidateProfileDTO;
    }

    // Lấy danh sách kỹ năng của ứng viên
    @Override
    public List<CandidateSkillResponseDTO> getCandidateSkillsByCandidateId(Long candidateId) {
        List<CandidateSkill> candidateSkills = candidateSkillRepository.findByCandidateId(candidateId);
        return candidateSkills.stream()
                .map(CandidateSkillMapper.INSTANCE::toCandidateSkillResponseDTO)
                .collect(Collectors.toList());
    }

    // Xóa kỹ năng của ứng viên
    @Transactional
    @Override
    public void removeSkillFromCandidate(Long candidateId, Long skillId) {
        validateCandidateAccess(candidateId);
        candidateSkillRepository.deleteByCandidateIdAndSkillId(candidateId, skillId);
    }

    // Cập nhật mức độ thành thạo của kỹ năng
    @Override
    public CandidateSkillResponseDTO updateProficiencyLevel(
            Long candidateId, Long skillId, String newLevel) {
        validateCandidateAccess(candidateId);
        validateProficiencyLevel(newLevel);
        
        CandidateSkill skill = candidateSkillRepository
            .findByCandidateIdAndSkillId(candidateId, skillId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy kỹ năng"));
            
        skill.setProficiencyLevel(CandidateSkill.ProficiencyLevel.valueOf(newLevel));
        return CandidateSkillMapper.INSTANCE
            .toCandidateSkillResponseDTO(candidateSkillRepository.save(skill));
    }

    @Override
    public void deleteCandidateSkill(Long candidateSkillId) {
        candidateSkillRepository.findById(candidateSkillId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy kỹ năng của ứng viên"));
        candidateSkillRepository.deleteById(candidateSkillId);
    }
}
