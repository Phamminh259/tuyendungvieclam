package com.codeforworks.NTH_WorkFinder.repository;

import com.codeforworks.NTH_WorkFinder.model.Industry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IndustryRepository extends JpaRepository<Industry, Long> {
    Optional<Industry> findByName(String name);
    Industry findByNameIgnoreCase(String name);
//    // Tìm ngành theo từ khóa (cho phép viết tắt hoặc chỉ nhập 1 phần)
//    List<Industry> findByNameContainingIgnoreCase(String keyword);
}
