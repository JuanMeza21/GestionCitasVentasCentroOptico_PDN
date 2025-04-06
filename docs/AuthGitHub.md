# Autenticación con GitHub vía Firebase - Gestión de Citas y Ventas en Centro Óptico _PDN_

## Tecnologías Utilizadas

- **Frontend**: React, Firebase Auth
- **Backend**: Spring Boot, Firebase 
- **Base de datos**: Cloud Firestore

## Autenticación con GitHub

### Configuración Inicial en Firebase

Se ctiva **GitHub** como proveedor de autenticación:
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

## Autenticación con GitHub

La siguiente parte de codigo describe el proceso de autenticación con GitHub utilizando Firebase Authentication y cómo se registra o actualiza al usuario en Firestore.

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

### Descripción

- **`signInWithPopup`**: Lanza una ventana emergente para autenticación con GitHub.
- **`user`**: Contiene los datos del usuario autenticado.
- **`setDoc(..., { merge: true })`**: Registra o actualiza los datos del usuario en Firestore sin sobrescribir campos existentes.
- **`fetch(...)`**: Solicita al backend (por ejemplo, en Spring Boot) el rol asociado al usuario autenticado mediante su `uid`.

---

## Guardado o asignación de rol

Esta parte de codigo se usa para guardar completamente un nuevo usuario con rol incluido
```js
await setDoc(
    doc(db, "usuarios", tempUser.uid),
    {
        rol: selectedRole,
    },
    { merge: true }
);
```

### Descripción

- **`setDoc`**: Registra el rol asignado luego de logearse con github
