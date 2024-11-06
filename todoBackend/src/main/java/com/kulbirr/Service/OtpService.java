package com.kulbirr.Service;

import org.springframework.stereotype.Service;
import java.util.Random;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    // Store OTP in-memory (you can replace this with a database or cache for production)
    private Map<String, String> otpStore = new ConcurrentHashMap<>();

    // Generate a random OTP and store it against the user's email
    public String generateOtp(String email) {
        // Generate a random 6-digit number as OTP
        Random random = new Random();
        String otp = String.format("%06d", random.nextInt(999999));

        // Store the OTP with the email as the key
        otpStore.put(email, otp);

        // For production, you would send this OTP via email/SMS
//        System.out.println("Generated OTP for " + email + ": " + otp);

        return otp;
    }

    // Verify the OTP entered by the user
    public boolean verifyOtp(String email, String otp) {
        // Check if the OTP matches
        System.out.println(email);
        System.out.println(otp);
        System.out.println(otpStore.containsKey(email));
        System.out.println(otpStore.get(email));
        if (otpStore.containsKey(email) && otpStore.get(email).equals(otp)) {
            // OTP is valid, so remove it from the store
            otpStore.remove(email);
            return true;
        }
        return false;
    }
}
