import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword,signInWithPopup,GithubAuthProvider,GoogleAuthProvider,FacebookAuthProvider,sendPasswordResetEmail,fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Perfil from "../images/perfill.jpg";
import Swal from "sweetalert2";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({email: "",password: "",general: ""});
  const [showRoleInput, setShowRoleInput] = useState(false);
  const [tempUser, setTempUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const githubProvider = new GithubAuthProvider();
  githubProvider.addScope("user:email");
  githubProvider.addScope("read:user");

  const googleProvider = new GoogleAuthProvider();
  googleProvider.addScope("profile");
  googleProvider.addScope("email");

  const facebookProvider = new FacebookAuthProvider();
  facebookProvider.addScope("email");
  facebookProvider.addScope("public_profile");

  const validarForm = () => {
    const newErrors = { email: "", password: "", general: "" };
    let isValid = true;

    if (!loginData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
      isValid = false;
    } else if (!EMAIL_REGEX.test(loginData.email)) {
      newErrors.email = "Ingresa un correo electrónico válido";
      isValid = false;
    }

    if (!loginData.password) {
      newErrors.password = "La contraseña es obligatoria";
      isValid = false;
    } else if (loginData.password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const infoInput = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));

    if (name === "email" && value && !EMAIL_REGEX.test(value)) {
      setErrors((prev) => ({ ...prev, email: "Correo electrónico inválido" }));
    } else if (name === "email") {
      setErrors((prev) => ({ ...prev, email: "" }));
    }

    if (name === "password" && value && value.length < MIN_PASSWORD_LENGTH) {
      setErrors((prev) => ({
        ...prev,
        password: `Mínimo ${MIN_PASSWORD_LENGTH} caracteres`,
      }));
    } else if (name === "password") {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const registrarClick = () => {
    navigate("/registro");
  };

  const recuperarContraseña = async () => {
    setErrors({ email: "", password: "", general: "" });
    const correo = loginData.email.trim();

    if (!correo) {
      setErrors((prev) => ({
        ...prev,
        email: "Por favor ingresa tu correo electrónico primero.",
      }));
      return;
    }

    if (!EMAIL_REGEX.test(correo)) {
      setErrors((prev) => ({
        ...prev,
        email: "Ingresa un correo electrónico válido.",
      }));
      return;
    }

    try {
      const methods = await fetchSignInMethodsForEmail(auth, correo);
      if (methods.length === 0) {
        setErrors((prev) => ({
          ...prev,
          email: "Este correo no está registrado.",
        }));
        return;
      }

      await sendPasswordResetEmail(auth, correo);
      Swal.fire({
        text: "Correo de recuperación enviado correctamente. Por favor revisa tu bandeja de entrada.",
        icon: "success",
        confirmButtonText: "Ok",
        customClass: {
          confirmButton: "text-lg bg-blue-600 rounded-lg text-white",
          popup: "text-base w-[300px]",
        },
      });
    } catch (err) {
      console.error("Error al enviar correo de recuperación:", err);
      setErrors((prev) => ({
        ...prev,
        general:
          "No se pudo enviar el correo de recuperación. Intenta nuevamente.",
      }));
    }
  };

  const controladorProveedorLogin = async (provider, providerName) => {
    if (isSubmitting) return;

    setErrors({ email: "", password: "", general: "" });
    setIsSubmitting(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const infoAdicionalUser = result._tokenResponse || {};

      let userEmail = user.email || infoAdicionalUser.email;
      let userName = user.displayName || infoAdicionalUser.displayName || infoAdicionalUser.screenName || userEmail.split("@")[0];

      const userDocRef = doc(db, "usuarios", user.uid);
      const existingDoc = await getDoc(userDocRef);

      const userData = {
        uid: user.uid,
        nombre: userName,
        apellido: "",
        email: userEmail,
        telefono: "",
        proveedor: providerName,
        rol: "",
      };

      if (!existingDoc.exists()) {
        await setDoc(userDocRef, userData);
      } else {
        await setDoc(userDocRef, { proveedor: providerName }, { merge: true });
        userData.rol = existingDoc.data().rol || "";
        userData.nombre = existingDoc.data().nombre || userName;
        userData.apellido = existingDoc.data().apellido || "";
        userData.telefono = existingDoc.data().telefono || "";
      }

      const rolFetch = await fetch(
        `http://localhost:8080/autenticacion/getRole/${user.uid}`
      );
      const rol = await rolFetch.text();

      if (rol === "null" || rol === "" || rol === "Usuario no encontrado") {
        setTempUser(user);
        setShowRoleInput(true);
      } else {
        userData.rol = rol;
        await registrarAccesoUsuario(userData);
        redirigirSegunRol(rol);
      }
    } catch (err) {
      console.error(
        `Error al iniciar sesión con ${providerName}:`,
        err.code,
        err.message
      );

      let errorMessage = `Error al iniciar sesión con ${providerName}`;

      if (err.code === "auth/popup-closed-by-user") {
        errorMessage =
          "El popup de autenticación fue cerrado antes de completar el proceso.";
      } else if (err.code === "auth/cancelled-popup-request") {
        errorMessage = "Solicitud de autenticación cancelada.";
      }

      setErrors((prev) => ({ ...prev, general: errorMessage }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginConGitHub = () => controladorProveedorLogin(githubProvider, "github");
  const loginConGoogle = () => controladorProveedorLogin(googleProvider, "google");
  const loginConFacebook = () => controladorProveedorLogin(facebookProvider, "facebook");

  const registrarAccesoUsuario = async (userData) => {
    try {
      await fetch("http://localhost:8080/usuarios/registrar-acceso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error("Error al registrar acceso:", error);
    }
  };

  const guardarRol = async () => {
    if (!selectedRole || !tempUser) {
      setErrors((prev) => ({ ...prev, general: "Debe seleccionar un rol." }));
      return;
    }

    try {
      await setDoc(
        doc(db, "usuarios", tempUser.uid),
        {
          rol: selectedRole,
        },
        { merge: true }
      );

      const userDocRef = doc(db, "usuarios", tempUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        await registrarAccesoUsuario(userData);
      }

      redirigirSegunRol(selectedRole);
    } catch (err) {
      console.error("Error al guardar el rol:", err);
      setErrors((prev) => ({ ...prev, general: "Error al guardar el rol." }));
    }
  };

  const redirigirSegunRol = (rol) => {
    if (rol === "optometrista") {
      navigate("/optometrist");
    } else if (rol === "secretario/a") {
      navigate("/secretary");
    } else if (rol === "admin") {
      navigate("/admin");
    } else {
      setErrors((prev) => ({
        ...prev,
        general: "No se encontró un rol válido.",
      }));
    }
  };

  const controlarLogin = async (e) => {
    e.preventDefault();

    if (!validarForm() || isSubmitting) return;

    setIsSubmitting(true);
    setErrors({ email: "", password: "", general: "" });

    try {
      const userCredencial = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );
      const user = userCredencial.user;

      const userDocRef = doc(db, "usuarios", user.uid);
      const userDoc = await getDoc(userDocRef);

      let userData = {
        uid: user.uid,
        nombre: user.displayName || "",
        apellido: "",
        email: user.email || "",
        telefono: "",
        proveedor: "email",
        rol: "",
      };

      if (userDoc.exists()) {
        userData = {
          ...userData,
          nombre: userDoc.data().nombre || userData.nombre,
          apellido: userDoc.data().apellido || userData.apellido,
          telefono: userDoc.data().telefono || userData.telefono,
          rol: userDoc.data().rol || userData.rol,
        };
      }

      await registrarAccesoUsuario(userData);

      const rolFetch = await fetch(
        `http://localhost:8080/autenticacion/getRole/${user.uid}`
      );
      const rol = await rolFetch.text();

      redirigirSegunRol(rol);
    } catch (err) {
      console.error("Error al iniciar sesión:", err.code, err.message);

      let errorMessage = "Error al iniciar sesión";

      if (err.code === "auth/user-not-found") {
        errorMessage = "Usuario no encontrado. Verifica tu correo electrónico.";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Contraseña incorrecta. Intenta nuevamente.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Correo electrónico inválido.";
      }

      setErrors((prev) => ({ ...prev, general: errorMessage }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-200">
      <div className="bg-white text-center rounded-3xl px-6 w-[360px] border-2 shadow-lg">
        <h1 className="pt-4 text-[20px]">INICIAR SESIÓN</h1>

        <div className="flex justify-center items-center my-4">
          <img className="w-[120px]" src={Perfil} alt="perfil" />
        </div>

        {showRoleInput ? (
          <div className="flex flex-col items-center py-4">
            <label className="mb-2 text-sm font-semibold">
              Selecciona tu rol:
            </label>
            <select value={selectedRole}onChange={(e) => setSelectedRole(e.target.value)}className="mb-4 p-1 rounded-md bg-slate-100">
              <option value="">Selecciona</option>
              <option value="optometrista">Optometrista</option>
              <option value="secretario/a">Secretario/a</option>
            </select>
            <button onClick={guardarRol}className="bg-blue-500 text-white py-1 mb-2 px-3 rounded-lg hover:bg-blue-600">
              Guardar rol
            </button>
          </div>
        ) : (
          <form onSubmit={controlarLogin}className="grid items-center text-center py-2 px-4">
            <div className="mb-2">
              <input
                name="email"
                onChange={infoInput}
                value={loginData.email}
                className={`py-1 focus:outline-none bg-[#f4f4f4] w-full px-2 rounded-lg ${
                  errors.email ? "border border-red-500" : ""
                }`}
                placeholder="Correo electrónico"
                type="email"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-red-500 text-xs text-left mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="mb-2">
              <input
                name="password"
                onChange={infoInput}
                value={loginData.password}
                className={`py-1 focus:outline-none bg-[#f4f4f4] w-full px-2 rounded-lg ${
                  errors.password ? "border border-red-500" : ""
                }`}
                placeholder="Contraseña"
                type="password"
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="text-red-500 text-xs text-left mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-1 mb-2 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </button>

            <button
              type="button"
              onClick={registrarClick}
              disabled={isSubmitting}
              className={`cursor-pointer text-[15px] mb-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg py-1 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Registrarse
            </button>

            <button
              type="button"
              onClick={recuperarContraseña}
              disabled={isSubmitting}
              className={`text-[13px] hover:text-blue-500 mb-3 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              ¿Olvidaste tu contraseña?
            </button>

            <div className="bg-[#f4f4f4] h-1 rounded-lg"></div>
            <div className="flex flex-col items-center justify-center text-center pb-4 mt-4">
              <h1 className="mb-2">Ingresar con</h1>
              <div className="flex justify-center gap-1 w-full">
                <button
                  type="button"
                  onClick={loginConGitHub}
                  disabled={isSubmitting}
                  className={`flex items-center justify-center gap-2 cursor-pointer bg-black text-white rounded-lg py-1.5 px-3 border-2 border-black hover:bg-gray-700 hover:border-gray-700 transition ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FaGithub size={20} color="white" />
                </button>

                <button
                  type="button"
                  onClick={loginConGoogle}
                  disabled={isSubmitting}
                  className={`flex items-center justify-center gap-2 cursor-pointer bg-white text-black rounded-lg py-1.5 px-3 border-2 hover:border-gray-800 transition ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FcGoogle size={20} />
                </button>

                <button
                  type="button"
                  onClick={loginConFacebook}
                  disabled={isSubmitting}
                  className={`flex items-center justify-center gap-2 cursor-pointer bg-blue-600 text-white rounded-lg py-1.5 px-3 border-2 border-blue-600 hover:bg-blue-800 hover:border-blue-800 transition ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FaFacebook size={20} color="white" />
                </button>
              </div>
            </div>

            {errors.general && (
              <div className="text-red-500 mb-1">
                <p>{errors.general}</p>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
