# Registro y validación de acceso con diferentes usuarios en diferentes fechas/horas

## 1. Validación y registro de acceso en el Frontend

### Validaciones en el formulario de login (`Login.js`)
- **Email:** Se valida que no esté vacío y que tenga un formato correcto mediante una expresión regular.
- **Contraseña:** Se valida que no esté vacía y tenga mínimo 6 caracteres.
- **Errores:** Se almacenan en un estado `errors` que se actualiza dinámicamente.
- **Proveedor externo (Google, GitHub, Facebook):** Se usa `signInWithPopup` y se extrae la información del usuario, verificando si existe en Firestore.
- **Rol:** Se consulta al backend (`/autenticacion/getRole/:uid`). Si no se encuentra, se solicita seleccionar uno manualmente.
- **Registro de acceso:** Luego del login, se llama al endpoint `http://localhost:8080/usuarios/registrar-acceso` enviando datos del usuario.

```javascript
await fetch("http://localhost:8080/usuarios/registrar-acceso", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(userData),
});
```

## 2. Backend - Registro y listado de Accesos

### Endpoint para registrar acceso
**Ruta:** `POST /usuarios/registrar-acceso`  
**Funcionalidad:** Recibe un JSON con datos del usuario (UID, nombre, email, proveedor, etc.) y registra un nuevo acceso con marca de tiempo en la base de datos.

- **UsuarioController.java** recibe la solicitud:
```javascript
@PostMapping("/registrar-acceso")
public void registrarAcceso(@RequestBody Usuario usuario) throws Exception {
    usuarioService.registrarAcceso(usuario);
}
```

- **UsuarioService.java** almacena en Firestore:
```javascript
public void registrarAcceso(Usuario usuario) throws ExecutionException, InterruptedException {
    Map<String, Object> acceso = new HashMap<>();
    acceso.put("uid", usuario.getUid());
    acceso.put("nombre", usuario.getNombre());
    acceso.put("apellido", usuario.getApellido());
    acceso.put("email", usuario.getEmail());
    acceso.put("telefono", usuario.getTelefono());
    acceso.put("rol", usuario.getRol());
    acceso.put("proveedor", usuario.getProveedor());
    acceso.put("fechaAcceso", FieldValue.serverTimestamp());
    
    db.collection("accesosUsuario").document().set(acceso).get();
}
```

### Endpoint para listar accesos
**Ruta:** `GET /usuarios/historial-accesos`  
**Funcionalidad:** Devuelve una lista de todos los accesos registrados por los usuarios, incluyendo fecha, hora y datos del usuario.

- **UsuarioController.java** maneja la petición:
```javascript
@GetMapping("/historial-accesos")
public List<Map<String, Object>> obtenerHistorialAccesos() throws Exception {
    return usuarioService.obtenerHistorialAccesos();
}
```

- **UsuarioService.java** consulta Firestore:
```javascript
public List<Map<String, Object>> obtenerHistorialAccesos() throws ExecutionException, InterruptedException {
    Query query = db.collection("accesosUsuario").orderBy("fechaAcceso", Query.Direction.DESCENDING);
    
    List<Map<String, Object>> accesos = new ArrayList<>();
    for (QueryDocumentSnapshot doc : query.get().getDocuments()) {
        Map<String, Object> acceso = doc.getData();
        acceso.put("id", doc.getId()); 
        if (acceso.containsKey("fechaAcceso")) {
            acceso.put("fechaAcceso", acceso.get("fechaAcceso").toString());
        }
        accesos.add(acceso);
    }
    return accesos;
}
```

El método `obtenerHistorialAccesos()` recupera desde Firestore todos los accesos de usuarios almacenados en la colección `accesosUsuario`, ordenados por fecha de forma descendente. Cada acceso se convierte en un mapa que incluye los datos del usuario, el ID del documento y la fecha en formato de texto. Devuelve una lista con todos los registros, para mostrar un historial cronológico en el frontend.

## 3. Componente `HistorialAccesos` - Llamado al Endpoint

### Funcionalidad:
- Realiza una petición `GET` al endpoint `/usuarios/historial-accesos`.
- Muestra en una tabla los accesos registrados, con nombre, email, fecha y proveedor.

```javascript
useEffect(() => {
  const obtenerHistorial = async () => {
    try {
      const respuesta = await fetch("http://localhost:8080/usuarios/historial-accesos");
      const datos = await respuesta.json();
      setHistorial(datos);
    } catch (error) {
      console.error("Error al obtener el historial:", error);
    }
  };

  obtenerHistorial();
}, []);
```

---

Con esto se puede ver y controlar el acceso historico de los diferentes usarios.