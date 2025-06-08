package com.example.backend_GCVCO.Services;

import com.example.backend_GCVCO.models.Usuario;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class UsuarioService {

    private static final String COLLECTION_USER = "usuarios";
    private static final String ACCESS_COLLECTION = "accesosUsuario";

    public List<Usuario> obtenerUsuarios() throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = db.collection(COLLECTION_USER).get();

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
        ApiFuture<WriteResult> result = db.collection(COLLECTION_USER).document(usuario.getUid()).set(usuario);
        return result.get().getUpdateTime().toString();
    }

    public String actualizarUsuario(String uid, Usuario usuario) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> result = db.collection(COLLECTION_USER).document(uid).set(usuario);
        return result.get().getUpdateTime().toString();
    }

    public String eliminarUsuario(String uid) throws Exception {
        Firestore db = FirestoreClient.getFirestore();

        FirebaseAuth.getInstance().deleteUser(uid);

        ApiFuture<WriteResult> result = db.collection(COLLECTION_USER).document(uid).delete();
        return result.get().getUpdateTime().toString();
    }

    public void registrarAcceso(Usuario usuario) throws InterruptedException, ExecutionException {
        Firestore db = FirestoreClient.getFirestore();

        Map<String, Object> acceso = new HashMap<>();
        acceso.put("uid", usuario.getUid());
        acceso.put("nombre", usuario.getNombre());
        acceso.put("apellido", usuario.getApellido());
        acceso.put("email", usuario.getEmail());
        acceso.put("telefono", usuario.getTelefono());
        acceso.put("rol", usuario.getRol());
        acceso.put("proveedor", usuario.getProveedor());
        acceso.put("fechaAcceso", FieldValue.serverTimestamp());

        try {
            ApiFuture<WriteResult> result = db.collection(ACCESS_COLLECTION).document().set(acceso);
            result.get();
        } catch (Exception e) {
            throw new RuntimeException("Error al registrar acceso: " + e.getMessage(), e);
        }
    }

    public List<Map<String, Object>> obtenerHistorialAccesos() throws InterruptedException, ExecutionException {
        Firestore db = FirestoreClient.getFirestore();

        Query query = db.collection(ACCESS_COLLECTION).orderBy("fechaAcceso", Query.Direction.DESCENDING);

        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<Map<String, Object>> accesos = new ArrayList<>();

        for (QueryDocumentSnapshot doc : documents) {
            Map<String, Object> acceso = doc.getData();
            if (acceso.containsKey("fechaAcceso")) {
                acceso.put("fechaAcceso", acceso.get("fechaAcceso").toString());
            }
            accesos.add(acceso);
        }

        return accesos;
    }
}