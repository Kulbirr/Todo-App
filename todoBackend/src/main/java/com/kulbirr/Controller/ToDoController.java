package com.kulbirr.Controller;

import com.kulbirr.DTO.ToDoRequest;
import com.kulbirr.Model.ToDo;
import com.kulbirr.Response.ToDoResponse;
import com.kulbirr.Service.ToDoService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("todo/")
//@CrossOrigin(origins = "http://localhost:3000/")
public class ToDoController {
    private final ToDoService toDoService;

    @GetMapping("home")
    public String Home(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return toDoService.Home(email);
    }

    @GetMapping("getAllToDos")
    public List<ToDoRequest> getAllToDOs(){
        return toDoService.getAllToDos();
    }

    @PostMapping("add")
    public ResponseEntity<ToDoResponse> createToDo(@RequestBody ToDoRequest todo){
        return toDoService.createToDo(todo);
    }

    @DeleteMapping("delete")
    public String deleteToDo(@RequestParam Long id) throws RuntimeException{
        try{
            return toDoService.deleteToDo(id);
        }catch (Exception e){
            return (e.getMessage());
        }
    }

}
