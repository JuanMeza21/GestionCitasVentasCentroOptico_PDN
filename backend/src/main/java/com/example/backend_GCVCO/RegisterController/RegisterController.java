package com.example.backend_GCVCO.RegisterController;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class RegisterController {
    @GetMapping("/register")
    public String register() {
        return "Probando controlador REGISTER";
    }
}
