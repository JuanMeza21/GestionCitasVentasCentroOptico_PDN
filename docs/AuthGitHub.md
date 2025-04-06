# Autenticación con GitHub vía Firebase - Gestión de Citas y Ventas en Centro Óptico _PDN_

## Tecnologías Utilizadas

- **Frontend**: React, Firebase Auth
- **Backend**: Spring Boot, Firebase Admin SDK
- **Base de datos**: Cloud Firestore

## Autenticación con GitHub

### Configuración Inicial en Firebase

Se ctiva **GitHub** como proveedor de autenticación:
   - En el menú izquierdo, entra a **Authentication** > **Método de inicio de sesión**.
   - Se configura con:
     - `Client ID` y `Client Secret` 


### Flujo de Autenticación (Frontend)

1. El usuario hace clic en **"Ingresar con GitHub"**.
2. Se ejecuta `signInWithPopup(auth, githubProvider)` para autenticar al usuario.
3. Se guarda la información básica del usuario en Firestore (si no existe).
4. Se realiza una petición al backend para consultar el **rol** asociado al usuario (`/autenticacion/getRole/{userId}`).
5. Si no tiene rol, se solicita al usuario que seleccione uno (ej: `optometrista`, `secretario/a`).
6. Se guarda el rol en Firestore y se redirige al dashboard correspondiente.



### Código Relevante (React)

#### Login con GitHub

```js
const result = await signInWithPopup(auth, githubProvider);
const user = result.user;

await setDoc(doc(db, "usuarios", user.uid), {
  uid: user.uid,
  nombre: user.displayName || "",
  email: user.email || "",
  telefono: "",
}, { merge: true });

const rolFetch = await fetch(`http://localhost:8080/autenticacion/getRole/${user.uid}`);
const rol = await rolFetch.text();
```

#### Guardado de Rol

```js
await setDoc(doc(db, "usuarios", tempUser.uid), {
  uid: tempUser.uid,
  nombre: tempUser.displayName || "",
  email: tempUser.email || "",
  telefono: "",
  rol: selectedRole,
});
```

## Clase `Usuario`

```java
public class Usuario {
    private String uid;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private String rol;
}
```

### Atributos:
- `uid`: Identificador único del usuario (Firestore document ID).
- `nombre`: Nombre del usuario.
- `apellido`: Apellido del usuario.
- `email`: Correo electrónico del usuario.
- `telefono`: Número de teléfono.
- `rol`: Rol del usuario dentro del sistema (Ej. admin, cliente, etc).

---

## UsuarioService

Clase que realiza operaciones CRUD en la colección `usuarios` de Firestore.

### Métodos

#### `List<Usuario> obtenerUsuarios()`
Obtiene la lista completa de usuarios almacenados en Firestore.

#### `String actualizarUsuario(String uid, Usuario usuario)`
Actualiza el documento con el UID especificado en Firestore.

#### `String eliminarUsuario(String uid)`
Elimina el documento correspondiente al UID.

---

## UsuarioController

Controlador REST con mapeos HTTP para interactuar con los servicios de usuarios.

### Endpoints

| Método | Endpoint              | Descripción                            |
|--------|-----------------------|----------------------------------------|
| GET    | `/usuarios`           | Obtiene todos los usuarios             |
| PUT    | `/usuarios/{uid}`     | Actualiza un usuario existente         |
| DELETE | `/usuarios/{uid}`     | Elimina un usuario por UID             |
