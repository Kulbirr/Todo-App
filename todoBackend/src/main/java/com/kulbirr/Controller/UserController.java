package com.kulbirr.Controller;

import com.kulbirr.DTO.OtpVerificationRequest;
import com.kulbirr.DTO.SignupRequest;
import com.kulbirr.DTO.ToDoRequest;
import com.kulbirr.Exceptions.InvalidCredentialsException;
import com.kulbirr.Exceptions.UserAlreadyExists;
import com.kulbirr.DTO.LoginRequest;
import com.kulbirr.Model.ToDo;
import com.kulbirr.Model.User;
import com.kulbirr.Response.AuthResponse;
import com.kulbirr.Response.ToDoResponse;
import com.kulbirr.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
//@CrossOrigin(origins = "http://localhost:3000/")
public class UserController {
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUser(@RequestBody SignupRequest signupRequest) throws UserAlreadyExists{
        try{
            return new ResponseEntity(userService.registerUser(signupRequest), HttpStatus.CREATED);
        }catch (UserAlreadyExists e){
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody OtpVerificationRequest otpRequest) throws Exception{
        try{
            return new ResponseEntity(userService.verifyOtp(otpRequest), HttpStatus.CREATED);
        }catch (Exception e){
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/reset-verify-otp")
    public ResponseEntity<String> resetVerifyOtp(@RequestBody OtpVerificationRequest otpRequest) throws Exception{
        try{
            return new ResponseEntity(userService.resetVerifyOtp(otpRequest), HttpStatus.CREATED);
        }catch (Exception e){
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@RequestBody LoginRequest loginRequest) throws InvalidCredentialsException {
        try{
            return new ResponseEntity(userService.loginUser(loginRequest), HttpStatus.OK);
        }catch (InvalidCredentialsException e){
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) throws Exception {
        String email = request.get("email");  // Extract the email from the map
        if (email == null || email.isEmpty()) {
            throw new Exception("Email is null or empty");
        }
        try{
            String response = userService.forgotPassword(email);
            return new ResponseEntity(response, HttpStatus.OK);
        }catch(Exception e){
            return new ResponseEntity(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request){
        String email = request.get("email");
        String password = request.get("password");
            String response = userService.resetPassword(email, password);
            return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/get-todos")
    public ResponseEntity<List<ToDoResponse>> getAllToDOs(){
        return userService.getAllToDos();
    }

//    @PostMapping

}
