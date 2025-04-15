# 🔐 Autenticación con Facebook

## 🔍 Descripción

En el sistema **Gestión de Citas y Ventas - Centro Óptico PDN**, se implementó un método de autenticación con Facebook mediante **Firebase Authentication**. Esta funcionalidad permite a los usuarios iniciar sesión con su cuenta de Facebook de forma rápida, segura y sin necesidad de crear una contraseña específica para el sistema.

Esta autenticación está integrada con la verificación del **rol del usuario** (optometrista o secretario/a), utilizando un backend en Spring Boot y Firestore para guardar y recuperar información relacionada al perfil del usuario.

---

## ⚙️ Tecnologías Utilizadas

| Tecnología         | Propósito                                  |
|--------------------|---------------------------------------------|
| React              | Desarrollo del frontend                     |
| Firebase Auth      | Autenticación con Facebook                  |
| Cloud Firestore    | Almacenamiento de usuarios y roles          |
| Spring Boot        | API REST para la verificación de roles      |

---

## 🔧 Configuración Inicial en Firebase

1. En la [Consola de Firebase](https://console.firebase.google.com/):
   - Se habilitó **Facebook** como proveedor de autenticación.
   - Se configuró el **App ID** y **App Secret** de Facebook desde la plataforma [Meta for Developers](https://developers.facebook.com/).
   - Se agregó la URL de redirección autorizada que Firebase proporciona.

---

## 🔄 Flujo de Autenticación

1. El usuario hace clic en **"Iniciar sesión con Facebook"**.
2. Se ejecuta `signInWithPopup(auth, facebookProvider)` para iniciar sesión mediante una ventana emergente.
3. Se guarda la información básica del usuario en **Firestore** si no existe aún.
4. Se consulta el backend (`/autenticacion/getRole/{userId}`) para obtener el **rol** del usuario.
5. Si el usuario no tiene un rol asignado, se le solicita seleccionarlo (por ejemplo, optometrista o secretario/a).
6. El rol se guarda en Firestore y se redirige automáticamente al **dashboard correspondiente**.

---

## 📄 Código Relevante

### 🔐 Autenticación con Facebook (React)

```js
const result = await signInWithPopup(auth, facebookProvider);
const user = result.user;

const userDocRef = doc(db, "usuarios", user.uid);
const existingDoc = await getDoc(userDocRef);

if (!existingDoc.exists()) {
  await setDoc(userDocRef, {
    uid: user.uid,
    nombre: user.displayName || user.email?.split("@")[0] || "",
    apellido: "",
    email: user.email || "",
    telefono: "",
  });
}

const rolFetch = await fetch(`http://localhost:8080/autenticacion/getRole/${user.uid}`);
const rol = await rolFetch.text();
```

#### 📝 Descripción

- `signInWithPopup`: Abre una ventana emergente para autenticarse con Facebook.
- `getDoc`: Verifica si el usuario ya existe en Firestore.
- `setDoc`: Crea un nuevo documento de usuario si no existe.
- `fetch(...)`: Consulta al backend para recuperar el rol del usuario según su UID.

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

- Si el usuario no tiene rol, se le muestra un selector para elegir uno.
- El rol se guarda en el mismo documento en Firestore usando `merge: true` para no sobrescribir otros campos.

---

## ✅ Beneficios

- Acceso fácil con una cuenta de Facebook ya existente.
- Flujo consistente con la autenticación por otros proveedores (como Google o GitHub).
- Almacenamiento de datos y roles en tiempo real.
- Mejora la experiencia del usuario al reducir pasos innecesarios.

---

## 🚀 Estado Actual

La autenticación con Facebook está completamente funcional. Los usuarios pueden autenticarse, registrarse automáticamente en Firestore si es su primera vez, asignar su rol y ser redirigidos a su panel correspondiente.

---

¿Quieres que este archivo lo prepare en formato descargable `.md` o lo añadimos al mismo documento donde tienes la autenticación de Google y GitHub?