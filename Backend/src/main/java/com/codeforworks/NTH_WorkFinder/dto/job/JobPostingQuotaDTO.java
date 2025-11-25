package com.codeforworks.NTH_WorkFinder.dto.job;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JobPostingQuotaDTO {
    private int normalJobLimit; // Giới hạn tin thường
    private int normalJobUsed; // Số lượng tin thường đã đăng
    private int normalJobRemaining; // Số lượng tin thường còn lại
    
    private int featuredJobLimit; // Giới hạn tin nổi bật
    private int featuredJobUsed; // Số lượng tin nổi bật đã đăng
    private int featuredJobRemaining; // Số lượng tin nổi bật còn lại
}