package com.codeforworks.NTH_WorkFinder.controller;

import com.codeforworks.NTH_WorkFinder.dto.industry.IndustryRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.industry.IndustryResponseDTO;
import com.codeforworks.NTH_WorkFinder.service.IIndustryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/industries")
public class IndustryController {

    @Autowired
    private IIndustryService industryService;

//    Tạo mới một ngành công nghiệp
    @PostMapping
    public ResponseEntity<IndustryResponseDTO> createIndustry(@RequestBody IndustryRequestDTO industryRequestDTO) {
        IndustryResponseDTO createdIndustry = industryService.createIndustry(industryRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdIndustry);
    }

//    Lấy thông tin ngành công nghiệp theo ID
    @GetMapping("get-by/{id}")
    public ResponseEntity<IndustryResponseDTO> getIndustryById(@PathVariable Long id) {
        IndustryResponseDTO industry = industryService.getIndustryById(id);
        return ResponseEntity.ok(industry);
    }

//    Lấy danh sách tất cả ngành công nghiệp
    @GetMapping("/list")
    public ResponseEntity<List<IndustryResponseDTO>> getAllIndustries() {
        List<IndustryResponseDTO> industries = industryService.getAllIndustries();
        return ResponseEntity.ok(industries);
    }

//    Cập nhật thông tin ngành công nghiệp
    @PutMapping("/{id}")
    public ResponseEntity<IndustryResponseDTO> updateIndustry(
            @PathVariable Long id,
            @RequestBody IndustryRequestDTO industryRequestDTO) {
        IndustryResponseDTO updatedIndustry = industryService.updateIndustry(id, industryRequestDTO);
        return ResponseEntity.ok(updatedIndustry);
    }

//    Xóa ngành công nghiệp
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIndustry(@PathVariable Long id) {
        industryService.deleteIndustry(id);
        return ResponseEntity.noContent().build();
    }
}
