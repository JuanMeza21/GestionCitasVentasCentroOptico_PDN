package com.example.backend_GCVCO.Services;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
public class FirebaseGetRol {

    @Autowired
    private Firestore firestore;

    public String getUserRole(String userId) {
        try {
            DocumentSnapshot document = firestore.collection("usuarios").document(userId).get().get();
            if (document.exists()) {
                return document.getString("rol");
            } else {
                return "Sin rol encontrado";
            }
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
            return "Error al buscar role";
        }
    }
}
