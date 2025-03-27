package com.example.backend_GCVCO.Config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PreDestroy;
import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    private Firestore firestore;

    @Bean
    public Firestore firestore() throws IOException {
        if (firestore == null) {  // Evita re-inicializar Firestore si ya existe
            FileInputStream serviceAccount = new FileInputStream("src/main/resources/serviceAccountKey.json");

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }

            firestore = FirestoreClient.getFirestore();
        }
        return firestore;
    }

    @PreDestroy
    public void closeFirestore() throws Exception {
        if (firestore != null) {
            firestore.close();  // Cierra Firestore solo cuando la aplicación se apaga
        }
    }
}

