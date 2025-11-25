package com.codeforworks.NTH_WorkFinder.initializer;

import com.codeforworks.NTH_WorkFinder.model.Role;
import com.codeforworks.NTH_WorkFinder.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class RoleInitializer implements CommandLineRunner {

    @Autowired
    private  RoleRepository roleRepository;


    private void ensureRoleExists(String roleName) {
        if (roleRepository.findByRoleName(roleName).isEmpty()) {
            Role role = new Role();
            role.setRoleName(roleName);
            roleRepository.save(role);
        }
    }

    @Override
    public void run(String... args) {
        ensureRoleExists("ROLE_USER");
        ensureRoleExists("ROLE_EMPLOYER");
        ensureRoleExists("ROLE_ADMIN");
    }
}
