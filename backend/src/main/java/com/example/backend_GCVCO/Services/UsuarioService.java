package com.example.backend_GCVCO.Services;

import com.example.backend_GCVCO.Usuario;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UsuarioService {

    private static final String COLLECTION_NAME = "usuarios";

    public List<Usuario> obtenerUsuarios() throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = db.collection(COLLECTION_NAME).get();

        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        List<Usuario> usuarios = new ArrayList<>();

        for (QueryDocumentSnapshot doc : documents) {
            Usuario u = doc.toObject(Usuario.class);
            u.setUid(doc.getId());
            usuarios.add(u);
        }

        return usuarios;
    }

    public String crearUsuario(Usuario usuario) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> result = db.collection(COLLECTION_NAME).document(usuario.getUid()).set(usuario);
        return result.get().getUpdateTime().toString();
    }

    public String actualizarUsuario(String uid, Usuario usuario) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> result = db.collection(COLLECTION_NAME).document(uid).set(usuario);
        return result.get().getUpdateTime().toString();
    }

    public String eliminarUsuario(String uid) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> result = db.collection(COLLECTION_NAME).document(uid).delete();
        return result.get().getUpdateTime().toString();
    }
}