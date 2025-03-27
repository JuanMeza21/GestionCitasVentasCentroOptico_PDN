# 🎨 FRONTEND - Gestión de Citas y Ventas en Centro Óptico _PDN_

## 📌 Documentación  

El frontend de este sistema web está diseñado para facilitar la gestión de citas, ventas e historias clínicas en un centro óptico. Se implementa con **React.js** y **Tailwind CSS**, proporcionando una interfaz dinámica, responsiva e intuitiva.  

---

## 🏥 **Estructura y Funcionalidades**  

### 👩‍💼 **Rol: Secretaria**  
La secretaria tendrá acceso a las siguientes opciones dentro de la barra de navegación:  

- **📊 Inicio:** Vista general de citas, ventas e información clave.  
- **📝 Registrar Cliente/Cita:**  
  - Si el cliente no está registrado, se agregará a la base de datos.  
  - Si el cliente ya existe, se registrará una nueva cita.  
- **💰 Ventas:**  
  - Creación de facturas.  
  - Registro de ventas (citas y productos del inventario).  
- **📦 Inventario:** Visualización de los productos disponibles en stock.  
- **📅 Calendario de Citas:** Consulta de citas programadas con detalles del paciente y fecha.  

---

### 👨‍⚕️ **Rol: Optómetra**  
La optómetra tendrá acceso a las siguientes opciones dentro de la barra de navegación:  

- **📊 Inicio:** Resumen general de citas, ventas e información relevante.  
- **📖 Historias Clínicas:**  
  - Consultar, crear y actualizar historias clínicas de los clientes.  
- **👀 Evaluaciones Visuales:**  
  - Registro y actualización de diagnósticos y resultados de exámenes visuales.  
- **📅 Calendario de Citas:**  
  - Consulta de citas programadas con detalles del paciente y fecha.  

> 📌 **Nota:** La opción seleccionada en la barra de navegación se mostrará dinámicamente en la interfaz.  

---

## ⚙️ **Configuración del Entorno**  

Para desarrollar y ejecutar el frontend, se recomienda el siguiente stack tecnológico:  

### 🖥️ **IDE - Visual Studio Code**  
- Editor de código gratuito y extensible.  
- Compatible con extensiones útiles para React y Tailwind CSS.  

### 🏗️ **Frameworks y Bibliotecas**  
| Tecnología  | Propósito  |
|------------|-----------|
| **React.js** | Desarrollo del frontend basado en componentes. |
| **Tailwind CSS** | Framework CSS para diseño responsivo y personalizable. |
| **Vite** | Herramienta de desarrollo para React, más rápida que CRA. |

### 🌐 **Lenguajes de Programación**  
- **JavaScript (JSX):** Lenguaje principal para el desarrollo del frontend.  
- **CSS (con Tailwind CSS):** Estilización de la interfaz de usuario.  

---

## 📂 **Estructura de Carpetas**  

```plaintext
📦 frontend
 ┣ 📂 src
 ┃ ┣ 📂 assets          # Recursos estáticos (imágenes, íconos)
 ┃ ┣ 📂 components      # Componentes reutilizables
 ┃ ┃ ┣ 📂 optometrist-comp  # Componentes relacionados con la optómetra
 ┃ ┃ ┣ 📂 secretary-comp    # Componentes relacionados con la secretaria
 ┃ ┃ ┣ 📜 login.jsx         # Componente de inicio de sesión
 ┃ ┃ ┣ 📜 RegisterAccount.jsx  # Componente de registro de usuario
 ┃ ┣ 📂 pages          # Páginas principales de la aplicación
 ┃ ┣ 📂 routes         # Definición de rutas del frontend
 ┃ ┣ 📂 services       # Conexión con el backend (API requests)
 ┃ ┣ 📂 styles         # Estilos globales
 ┃ ┗ 📜 main.jsx       # Punto de entrada principal de la aplicación
 ┣ 📜 .gitignore       # Archivos y carpetas a ignorar en Git
 ┣ 📜 package.json     # Dependencias y scripts del proyecto
 ┣ 📜 vite.config.js   # Configuración de Vite
 ┗ 📜 README.md        # Documentación del frontend
