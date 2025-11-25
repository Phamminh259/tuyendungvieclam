package com.codeforworks.NTH_WorkFinder.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.codeforworks.NTH_WorkFinder.dto.error.ErrorResponse;
import com.codeforworks.NTH_WorkFinder.service.CloudinaryService;

import java.util.HashMap;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {
    
    @Autowired
    private CloudinaryService cloudinaryService;
    
    //upload file (USER AND EMPLOYER CAN UPLOAD FILE )
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = cloudinaryService.uploadFile(file);
            return ResponseEntity.ok(new HashMap<String, String>() {{
                put("url", fileUrl);
            }});
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(HttpStatus.BAD_REQUEST.value(), e.getMessage()));
        }
    }

    //delete file (USER AND EMPLOYER CAN DELETE FILE )
    @DeleteMapping("/delete/{publicId}")
    public ResponseEntity<?> deleteFile(@PathVariable String publicId) {
        cloudinaryService.deleteFile(publicId);
        return ResponseEntity.ok().build();
    }
} 