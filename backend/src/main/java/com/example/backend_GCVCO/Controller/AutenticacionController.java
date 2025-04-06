package com.example.backend_GCVCO.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.backend_GCVCO.Services.FirebaseGetRol;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/autenticacion")
public class AutenticacionController {

    @Autowired
    private FirebaseGetRol firebaseGetRol;

    @GetMapping("/getRole/{userId}")
    public String getUserRole(@PathVariable String userId) throws ExecutionException, InterruptedException {
        String role = firebaseGetRol.getUserRole(userId);
        return role != null ? role : "Usuario no encontrado";
    }
}
