package com.codeforworks.NTH_WorkFinder.controller;

import com.codeforworks.NTH_WorkFinder.dto.error.ErrorResponse;
import com.codeforworks.NTH_WorkFinder.dto.profession.ProfessionRequestDTO;
import com.codeforworks.NTH_WorkFinder.dto.profession.ProfessionResponseDTO;
import com.codeforworks.NTH_WorkFinder.service.IProfessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professions")
public class ProfessionController {

    @Autowired
    private IProfessionService professionService;

    @PostMapping
    public ResponseEntity<ProfessionResponseDTO> createProfession(@RequestBody ProfessionRequestDTO professionRequestDTO) {
        ProfessionResponseDTO createdProfession = professionService.createProfession(professionRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProfession);
    }

    @GetMapping("get-by/{id}")
    public ResponseEntity<ProfessionResponseDTO> getProfessionById(@PathVariable Long id) {
        ProfessionResponseDTO profession = professionService.getProfessionById(id);
        return ResponseEntity.ok(profession);
    }

     @GetMapping("/industry/{industryId}")
    public ResponseEntity<?> getProfessionsByIndustryId(@PathVariable Long industryId) {
        try {
            List<ProfessionResponseDTO> professions = professionService.getProfessionsByIndustryId(industryId);
            return ResponseEntity.ok(professions);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage()));
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<ProfessionResponseDTO>> getAllProfessions() {
        List<ProfessionResponseDTO> professions = professionService.getAllProfessions();
        return ResponseEntity.ok(professions);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfessionResponseDTO> updateProfession(
            @PathVariable Long id,
            @RequestBody ProfessionRequestDTO professionRequestDTO) {
        ProfessionResponseDTO updatedProfession = professionService.updateProfession(id, professionRequestDTO);
        return ResponseEntity.ok(updatedProfession);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfession(@PathVariable Long id) {
        professionService.deleteProfession(id);
        return ResponseEntity.noContent().build();
    }
}