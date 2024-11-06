package com.kulbirr.Service;


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
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserService {
    AuthResponse registerUser(SignupRequest signupRequest) throws UserAlreadyExists;

    AuthResponse loginUser(LoginRequest loginRequest) throws InvalidCredentialsException;

    ResponseEntity<List<ToDoResponse>> getAllToDos();

    AuthResponse verifyOtp(OtpVerificationRequest otpRequest) throws Exception;

    String forgotPassword(String email) throws Exception;

    String resetVerifyOtp(OtpVerificationRequest otpRequest) throws Exception;

    String resetPassword(String email, String password);
}
