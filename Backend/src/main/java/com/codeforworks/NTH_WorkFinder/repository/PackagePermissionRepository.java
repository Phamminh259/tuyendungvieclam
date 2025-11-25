package com.codeforworks.NTH_WorkFinder.repository;

import com.codeforworks.NTH_WorkFinder.model.PackagePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PackagePermissionRepository extends JpaRepository<PackagePermission, Long> {
    List<PackagePermission> findByPackageEntityId(Long packageId);
    Optional<PackagePermission> findByPackageEntityIdAndPermissionId(Long packageId, Long permissionId);
    void deleteByPackageEntityIdAndPermissionId(Long packageId, Long permissionId);
    @Query("SELECT pp FROM PackagePermission pp WHERE pp.packageEntity.id = :packageId AND pp.permission.permissionKey = :permissionKey")
    Optional<PackagePermission> findByPackageEntityIdAndPermission_PermissionKey(
        @Param("packageId") Long packageId, 
        @Param("permissionKey") String permissionKey
    );
}
