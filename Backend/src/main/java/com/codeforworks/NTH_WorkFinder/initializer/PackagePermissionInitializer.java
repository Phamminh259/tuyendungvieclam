package com.codeforworks.NTH_WorkFinder.initializer;

import com.codeforworks.NTH_WorkFinder.model.Package;
import com.codeforworks.NTH_WorkFinder.model.PackagePermission;
import com.codeforworks.NTH_WorkFinder.model.Permission;
import com.codeforworks.NTH_WorkFinder.repository.PackagePermissionRepository;
import com.codeforworks.NTH_WorkFinder.repository.PackageRepository;
import com.codeforworks.NTH_WorkFinder.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class PackagePermissionInitializer implements CommandLineRunner {

    private final PermissionRepository permissionRepository;
    private final PackageRepository packageRepository;
    private final PackagePermissionRepository packagePermissionRepository;

    private static final List<Permission> permissionData = Arrays.asList(
        createPermission("POST_JOB", "Đăng tin tuyển dụng", "Số lượng tin tuyển dụng được phép đăng"),
        createPermission("VIEW_CANDIDATE_PROFILE", "Xem hồ sơ ứng viên", "Mức độ xem hồ sơ ứng viên"),
        createPermission("SEARCH_CANDIDATE", "Tìm kiếm ứng viên", "Khả năng tìm kiếm ứng viên"),
        createPermission("INTERVIEW_INVITE", "Mời phỏng vấn", "Số lượng lời mời phỏng vấn"),
        createPermission("PIN_JOB", "Ghim tin tuyển dụng", "Số tin được ghim lên đầu"),
        createPermission("EMPLOYER_BADGE", "Huy hiệu nhà tuyển dụng", "Huy hiệu nhà tuyển dụng"),
        createPermission("SEARCH_PRIORITY", "Ưu tiên tìm kiếm", "Độ ưu tiên hiển thị"),
        createPermission("API_ACCESS", "Truy cập API", "Quyền truy cập API"),
        createPermission("ANALYTICS_REPORT", "Báo cáo phân tích", "Báo cáo phân tích"),
        createPermission("SUPPORT_LEVEL", "Mức độ hỗ trợ", "Mức độ hỗ trợ")
    );

    private static Permission createPermission(String key, String name, String description) {
        Permission permission = new Permission();
        permission.setPermissionKey(key);
        permission.setPermissionName(name);
        permission.setDescription(description);
        permission.setActive(true);
        return permission;
    }

    @Override
    public void run(String... args) {
        // Kiểm tra nếu đã có dữ liệu thì không tạo nữa
        if (permissionRepository.count() > 0) {
            return;
        }

        // Tạo permissions
        List<Permission> permissions = createPermissions();
        permissionRepository.saveAll(permissions);

        // Tạo packages
        List<Package> packages = createPackages();
        packageRepository.saveAll(packages);

        // Tạo package permissions
        List<PackagePermission> packagePermissions = createPackagePermissions(packages, permissions);
        packagePermissionRepository.saveAll(packagePermissions);
    }

    private List<Permission> createPermissions() {
        // Trả về trực tiếp permissionData vì đã được khởi tạo sẵn
        return new ArrayList<>(permissionData);
    }

    private List<Package> createPackages() {
        List<Package> packages = new ArrayList<>();

        Object[][] packageData = {
            {"Basic", 30, 50000.0},
            {"Premium", 30, 2000000.0},
            {"Enterprise", 30, 5000000.0}
        };

        for (Object[] data : packageData) {
            Package pkg = new Package();
            pkg.setPackageName((String) data[0]);
            pkg.setDuration((Integer) data[1]);
            pkg.setPrice((Double) data[2]);
            packages.add(pkg);
        }

        return packages;
    }

    private List<PackagePermission> createPackagePermissions(List<Package> packages, List<Permission> permissions) {
        List<PackagePermission> packagePermissions = new ArrayList<>();

        // Giá trị cho từng gói
        String[][] basicValues = {
            {"5"}, {"basic"}, {"basic"}, {"10"}, {"0"},
            {"normal"}, {"normal"}, {"false"}, {"basic"}, {"normal"}
        };

        String[][] premiumValues = {
            {"100"}, {"full"}, {"advanced"}, {"50"}, {"5"},
            {"trusted"}, {"high"}, {"false"}, {"detailed"}, {"normal"}
        };

        String[][] enterpriseValues = {
            {"unlimited"}, {"unlimited"}, {"ai-matching"}, {"unlimited"}, {"20"},
            {"vip"}, {"highest"}, {"true"}, {"detailed"}, {"24-7"}
        };

        // Tạo package permissions cho gói Basic
        createPackagePermissionsForPackage(packages.get(0), permissions, basicValues, packagePermissions);
        // Tạo package permissions cho gói Premium
        createPackagePermissionsForPackage(packages.get(1), permissions, premiumValues, packagePermissions);
        // Tạo package permissions cho gói Enterprise
        createPackagePermissionsForPackage(packages.get(2), permissions, enterpriseValues, packagePermissions);

        return packagePermissions;
    }

    private void createPackagePermissionsForPackage(Package pkg, List<Permission> permissions, 
            String[][] values, List<PackagePermission> packagePermissions) {
        for (int i = 0; i < permissions.size(); i++) {
            PackagePermission pp = new PackagePermission();
            pp.setPackageEntity(pkg);
            pp.setPermission(permissions.get(i));
            pp.setValue(values[i][0]);
            pp.setIsActive(true);
            pp.setGrantedDate(new java.util.Date());
            packagePermissions.add(pp);
        }
    }
} 