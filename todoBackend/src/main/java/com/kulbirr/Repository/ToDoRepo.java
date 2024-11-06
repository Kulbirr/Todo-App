package com.kulbirr.Repository;

import com.kulbirr.Model.ToDo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ToDoRepo extends JpaRepository<ToDo, Long>{
    List<ToDo> findAllToDosByUserId(Long id);
}
