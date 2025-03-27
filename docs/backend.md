# 🛠️ BACKEND - Gestión de Citas y Ventas en Centro Óptico _PDN_

## 📌 Documentación  

El backend de **GestiónCitasVentasCentroOptico_PDN** está desarrollado con **Spring Boot** y utiliza **PostgreSQL** como base de datos. Su propósito es manejar la lógica de negocio, gestionar la autenticación de usuarios y exponer una **API REST** para la comunicación con el frontend.  

---

## ⚙️ **Configuración del Entorno**  

Para ejecutar el backend correctamente, asegúrate de tener los siguientes requisitos instalados en tu sistema:  

### 🔹 **Requisitos Previos**  

| Tecnología  | Propósito  |
|------------|-----------|
| **Java 17+** | Lenguaje de programación requerido para ejecutar Spring Boot. |
| **Spring Boot 3** | Framework que simplifica el desarrollo de aplicaciones Java. |
| **Gradle** | Herramienta de automatización para gestionar dependencias y compilación. |
| **PostgreSQL** | Base de datos relacional para almacenar la información del sistema. |
| **IntelliJ IDEA** | IDE recomendado para desarrollar con Spring Boot. |
| **Firebase** | Servicio en la nube para autenticación y almacenamiento. |

---

## 📂 **Estructura de Carpetas**  

```plaintext
📦 backend
 ┣ 📂 src
 ┃ ┣ 📂 main
 ┃ ┃ ┣ 📂 java/com/example/backend_GCVCO
 ┃ ┃ ┃ ┣ 📂 HomeController        # Controlador principal
 ┃ ┃ ┃ ┣ 📂 RegisterController    # Controlador de registro
 ┃ ┃ ┃ ┗ 📜 BackendGcvcoApplication.java  # Clase principal de la aplicación
 ┃ ┃ ┣ 📂 resources
 ┃ ┃ ┃ ┣ 📜 application.properties  # Configuración del proyecto (DB, puerto, etc.)
 ┃ ┃ ┃ ┗ 📜 data.sql  # Datos iniciales para la base de datos
 ┣ 📜 build.gradle   # Archivo de configuración para Gradle
 ┣ 📜 .gitignore     # Archivos y carpetas ignorados en Git
 ┣ 📜 README.md      # Documentación del backend
