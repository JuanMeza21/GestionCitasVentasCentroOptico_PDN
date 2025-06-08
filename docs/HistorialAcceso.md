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

### Endpoint para listar accesos
**Ruta:** `GET /usuarios/historial-accesos`  
**Funcionalidad:** Devuelve una lista de todos los accesos registrados por los usuarios, incluyendo fecha, hora y datos del usuario.

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