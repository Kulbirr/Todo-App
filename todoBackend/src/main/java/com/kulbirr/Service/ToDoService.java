package com.kulbirr.Service;

import com.kulbirr.DTO.ToDoRequest;
import com.kulbirr.Model.ToDo;
import com.kulbirr.Response.ToDoResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ToDoService {
    List<ToDoRequest> getAllToDos();

    ResponseEntity<ToDoResponse> createToDo(ToDoRequest toDo);

    String deleteToDo(Long id);

    String Home(String email);
}
