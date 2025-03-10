package com.example.backend_GCVCO.HomeController;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class HomeController {
    @GetMapping("/login")
    public String login() {
        return "Probando controlador LOGIN";
    }

}
