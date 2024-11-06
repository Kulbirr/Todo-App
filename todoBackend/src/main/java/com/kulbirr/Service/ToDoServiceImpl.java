package com.kulbirr.Service;

import com.kulbirr.DTO.ToDoRequest;
import com.kulbirr.Model.ToDo;
import com.kulbirr.Model.User;
import com.kulbirr.Repository.ToDoRepo;
import com.kulbirr.Repository.UserRepository;
import com.kulbirr.Response.ToDoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ToDoServiceImpl implements ToDoService {
    private final ToDoRepo toDoRepository;
    private final UserRepository userRepository;


    @Override
    public List<ToDoRequest> getAllToDos() {
//        return toDoRepository.findAll();
//        fix these later
        return null;
    }

    @Override
    public ResponseEntity<ToDoResponse> createToDo(ToDoRequest toDo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();
//
        User user = userRepository.findByEmail(email);

        if(user == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        ToDo todo = new ToDo();
        todo.setDescription(toDo.getDescription());
        todo.setTittle(toDo.getTittle());
        todo.setUser(user);

        toDoRepository.save(todo);

        ToDoResponse toDoResponse = new ToDoResponse(toDo.getTittle(),toDo.getDescription(), todo.getId());

        return new ResponseEntity<>(toDoResponse, HttpStatus.CREATED);
    }

    @Override
    public String deleteToDo(Long id) {
        // Get the authenticated user's email
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        // Find the user by email
        User user = userRepository.findByEmail(email);

        // Find the ToDo by id and ensure it belongs to the authenticated user
        ToDo toDo = toDoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ToDo Not Found"));

        // Check if the ToDo belongs to the user
        if (!toDo.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: You cannot delete this ToDo");
        }

        // Delete the ToDo from the repository
        toDoRepository.delete(toDo);

        return "ToDo Deleted Successfully";
    }


    @Override
    public String Home(String email) {
        User user = userRepository.findByEmail(email);

        return "To Your Todos application " + user.getUsername();
    }
}
