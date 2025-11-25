package com.codeforworks.NTH_WorkFinder.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@Service
public class CloudinaryService {
    
    @Autowired
    private Cloudinary cloudinary;
    
    //upload file
    public String uploadFile(MultipartFile file) {
        try {
            Map<String, Object> options = new HashMap<>();
            options.put("resource_type", "auto");
            
            Map<?, ?> uploadResult = cloudinary.uploader()
                .upload(file.getBytes(), options);
                
            return uploadResult.get("url").toString();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi upload file: " + e.getMessage());
        }
    }
    
    //delete file
    public void deleteFile(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi xóa file: " + e.getMessage());
        }
    }
} 