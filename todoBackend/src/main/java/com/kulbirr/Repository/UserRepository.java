package com.kulbirr.Repository;


import com.kulbirr.Model.ToDo;
import com.kulbirr.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String username);
    Optional<User> findByUsername(String userName);


//    Optional<User> findByEmail(String email);
}
