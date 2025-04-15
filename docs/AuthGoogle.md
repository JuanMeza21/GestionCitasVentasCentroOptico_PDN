
# 🔐 Autenticación con Google

## 🔍 Descripción

En el sistema **Gestión de Citas y Ventas - Centro Óptico PDN**, se implementó un método de autenticación con Google mediante **Firebase Authentication**. Esta funcionalidad permite a los usuarios iniciar sesión con su cuenta de Google de forma rápida, segura y sin necesidad de crear una contraseña adicional para el sistema.

Esta autenticación se complementa con la verificación del **rol del usuario** (optometrista o secretario/a), gestionado a través del backend en Spring Boot y Firestore.

---

## ⚙️ Tecnologías Utilizadas

| Tecnología         | Propósito                                  |
|--------------------|---------------------------------------------|
| React              | Desarrollo del frontend                     |
| Firebase Auth      | Autenticación con Google                    |
| Cloud Firestore    | Almacenamiento de usuarios y roles          |
| Spring Boot        | API REST para la verificación de roles      |

---

## 🔧 Configuración Inicial en Firebase

1. En la [Consola de Firebase](https://console.firebase.google.com/):
   - Se habilitó **Google** como proveedor de autenticación.
   - No requiere configuración adicional (como Client ID o Secret), ya que Google está integrado directamente.

---

## 🔄 Flujo de Autenticación

1. El usuario hace clic en **"Iniciar sesión con Google"**.
2. Se ejecuta `signInWithPopup(auth, googleProvider)` para iniciar sesión mediante una ventana emergente.
3. Se guarda la información básica del usuario en **Firestore** si no existe.
4. Se consulta el backend (`/autenticacion/getRole/{userId}`) para obtener el **rol** del usuario.
5. Si no tiene rol, se le solicita al usuario que seleccione uno.
6. El rol se guarda en Firestore y se redirige al **dashboard correspondiente**.

---

## 📄 Código Relevante

### 🔐 Autenticación con Google (React)

```js
const result = await signInWithPopup(auth, googleProvider);
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

#### 📝 Descripción

- `signInWithPopup`: Lanza una ventana emergente para autenticación con Google.
- `user`: Contiene los datos del usuario autenticado.
- `setDoc(..., { merge: true })`: Crea o actualiza el documento del usuario en Firestore sin sobrescribir los datos existentes.
- `fetch(...)`: Consulta el backend para obtener el **rol** del usuario según su UID.

---

### 👥 Asignación de Rol (si no tiene uno)

```js
await setDoc(
  doc(db, "usuarios", tempUser.uid),
  {
    rol: selectedRole,
  },
  { merge: true }
);
```

#### 📝 Descripción

- Si el usuario aún no tiene rol, se le solicita seleccionarlo (por ejemplo, **optometrista** o **secretario/a**).
- Este rol se guarda en el mismo documento de Firestore con `merge: true`.

---

## ✅ Beneficios

- Inicio de sesión sencillo y sin necesidad de recordar contraseñas.
- Mejora de la experiencia del usuario.
- Seguridad robusta proporcionada por Google y Firebase.
- Flexibilidad en la gestión de usuarios y roles.

---

## 🚀 Estado Actual

La autenticación con Google está completamente funcional. Los usuarios pueden ingresar al sistema, obtener su rol y acceder a las funcionalidades correspondientes de acuerdo a su perfil.

---

¿Quieres que te lo prepare como archivo `.md` descargable o lo quieres junto al de GitHub en un solo documento?