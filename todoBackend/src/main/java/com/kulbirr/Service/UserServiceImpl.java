package com.kulbirr.Service;

import com.kulbirr.Configuration.JwtProvider;
import com.kulbirr.DTO.LoginRequest;
import com.kulbirr.DTO.OtpVerificationRequest;
import com.kulbirr.DTO.SignupRequest;
import com.kulbirr.DTO.ToDoRequest;
import com.kulbirr.Exceptions.InvalidCredentialsException;
import com.kulbirr.Exceptions.UserAlreadyExists;
import com.kulbirr.Model.ToDo;
import com.kulbirr.Model.User;
import com.kulbirr.Repository.ToDoRepo;
import com.kulbirr.Repository.UserRepository;
import com.kulbirr.Response.AuthResponse;
import com.kulbirr.Response.ToDoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final EmailService emailService;
    private final ToDoRepo toDoRepo;
    private Map<String, SignupRequest> tempUserStore = new HashMap<>();

    @Override
    public AuthResponse registerUser(SignupRequest signupRequest) throws UserAlreadyExists {
        Optional<User> existingUser = userRepository.findByUsername(signupRequest.getUsername());
        User existingUser1 = userRepository.findByEmail(signupRequest.getEmail());

        if(existingUser.isPresent() && existingUser1 == null){
            throw new UserAlreadyExists("User with given userName: "+ "'"+  signupRequest.getUsername() +"'" +  " already exists");
        }else if(existingUser1 != null && existingUser.isEmpty()){
            throw new UserAlreadyExists("User with given email-id " + "'"+  signupRequest.getEmail() +"'"+  " already exists");
        }else if(existingUser.isPresent() && existingUser1 != null){
            throw new UserAlreadyExists("you already have an account. login?");
        }

        // Create a new User object to save into the repository
        User newUser = new User();
        newUser.setUsername(signupRequest.getUsername());
        newUser.setEmail(signupRequest.getEmail());
//        encoding password before saving
        newUser.setPassword(passwordEncoder.encode(signupRequest.getPassword()));

//        Generate Otp
        String otp = otpService.generateOtp(signupRequest.getEmail());
//        send otp
        emailService.sendOtp(signupRequest.getEmail(), otp);


//        userRepository.save(newUser);
        // Store the signupRequest (or create a temporary user object) in memory until OTP is verified
        tempUserStore.put(signupRequest.getEmail(), signupRequest);

        return new AuthResponse(null, "OTP sent to your email. Please verify to complete registration.");
    }

    @Override
    public AuthResponse verifyOtp(OtpVerificationRequest otpRequest) throws Exception {
        boolean isValidOtp = otpService.verifyOtp(otpRequest.getEmail(), otpRequest.getOtp());

        if (isValidOtp) {
            // Retrieve the stored signupRequest using the email
            SignupRequest signupRequest = tempUserStore.get(otpRequest.getEmail());

//            if (signupRequest == null) {
//                return new AuthResponse(null, "User not found or already registered.");
//            }

            // Create and save the new user in the repository
            User newUser = new User();
            newUser.setUsername(signupRequest.getUsername());
            newUser.setEmail(signupRequest.getEmail());
            newUser.setPassword(passwordEncoder.encode(signupRequest.getPassword()));

            userRepository.save(newUser);

            // Generate JWT token after successful registration
            Authentication authentication = new UsernamePasswordAuthenticationToken(newUser.getEmail(), newUser.getPassword());
            String token = JwtProvider.generateToken(authentication);

            // Clear the temporary store after successful registration
            tempUserStore.remove(otpRequest.getEmail());

            return new AuthResponse(token, "Account created and verified successfully.");
        } else {
            throw new Exception("Invalid OTP. Please try again.");
        }
    }

    @Override
    public String forgotPassword(String email) throws Exception {
        User user = userRepository.findByEmail(email);
        System.out.println(email);
        if(user == null) throw new Exception("user doesn't exist");

//        generate otp
        String otp = otpService.generateOtp(email);
//        send otp
        emailService.sendOtp(email, otp);

        return "Otp sent in your email";
    }

    @Override
    public String resetVerifyOtp(OtpVerificationRequest otpRequest) throws Exception {
        boolean isValidOtp = otpService.verifyOtp(otpRequest.getEmail(), otpRequest.getOtp());
        System.out.println("till here is correct");
        System.out.println("isValid" + " " + isValidOtp);

        if(isValidOtp){
            return "Otp verification successfull";
        }else{
            throw new Exception("User doesn't exist");
        }
    }

    @Override
    public String resetPassword(String email, String password) {
        User user = userRepository.findByEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
        return "Password updated successfully.";
    }

    @Override
    public AuthResponse loginUser(LoginRequest loginRequest) throws InvalidCredentialsException {
        Optional<User> user = userRepository.findByUsername(loginRequest.getUserName());

        if(!user.isPresent()){
            throw new InvalidCredentialsException("Invalid username");
        }
        User user1 = user.get();
        if(!passwordEncoder.matches(loginRequest.getPassword(), user1.getPassword())){
            throw new InvalidCredentialsException("Incorrect password");
        }

        Authentication authentication = new UsernamePasswordAuthenticationToken(user1.getEmail(), user1.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = JwtProvider.generateToken(authentication);
        AuthResponse authResponse = new AuthResponse(token, "logged in Successfully.");

        return authResponse ;
    }

    @Override
    public ResponseEntity<List<ToDoResponse>> getAllToDos() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        usually we get username from here but in my jwt I am returning email instead of userName
        String email = authentication.getName();
//        System.out.println(email);

        User user = userRepository.findByEmail(email);

        List<ToDo> toDoList = toDoRepo.findAllToDosByUserId(user.getId());

//        fetching all the todos and returning the todoResponse
        List<ToDoResponse> toDoResponseList = new ArrayList<>();
        for(ToDo todo : toDoList){
            ToDoResponse toDoResponse = new ToDoResponse(todo.getTittle(), todo.getDescription(), todo.getId());
            toDoResponseList.add(toDoResponse);
        }

        return new ResponseEntity<>(toDoResponseList, HttpStatus.OK);
    }
}
