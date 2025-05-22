import { doc,setDoc,getDoc,collection,query,where,getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword,signInWithPopup,GithubAuthProvider,GoogleAuthProvider,FacebookAuthProvider,sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Perfil from "../images/perfill.jpg";
import Swal from "sweetalert2";

export const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showRoleInput, setShowRoleInput] = useState(false);
  const [tempUser, setTempUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const githubProvider = new GithubAuthProvider();
  githubProvider.addScope("user:email");
  githubProvider.addScope("read:user");

  const googleProvider = new GoogleAuthProvider();
  googleProvider.addScope("profile");
  googleProvider.addScope("email");

  const facebookProvider = new FacebookAuthProvider();
  facebookProvider.addScope("email");
  facebookProvider.addScope("public_profile");

  const infoInput = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const registrarClick = () => {
    navigate("/registro");
  };

  const recuperarContraseña = async () => {
    setError("");
    const correo = loginData.email.trim();

    if (!correo) {
      setError("Por favor ingresa tu correo electrónico primero.");
      return;
    }

    try {
      const usuariosRef = collection(db, "usuarios");
      const consulta = query(usuariosRef, where("email", "==", correo));
      const resultado = await getDocs(consulta);

      if (resultado.empty) {
        setError("Este correo no está registrado.");
        return;
      }
      await sendPasswordResetEmail(auth, correo);
      Swal.fire({
        text: "Correo de recuperacion enviado correctamente. Ingresa la nueva contraseña.",
        icon: "success",
        confirmButtonText: "Ok",
        customClass: {
          confirmButton: "text-lg bg-blue-600 rounded-lg text-white",
          popup: "text-base w-[300px]",
        },
      });
    } catch (err) {
      setError("No se pudo enviar el correo de recuperación.");
    }
  };

  const controladorProveedorLogin = async (provider, providerName) => {
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const infoAdicionalUser = result._tokenResponse || {};

      let userEmail = user.email || infoAdicionalUser.email 

      let userName = user.displayName ||infoAdicionalUser.displayName || infoAdicionalUser.screenName || userEmail.split("@")[0];

      console.log("Datos:", {
        user: result.user,
        providerData: result.user.providerData,
        tokenResponse: result._tokenResponse,
      });

      const userDocRef = doc(db, "usuarios", user.uid);
      const existingDoc = await getDoc(userDocRef);

      if (!existingDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          nombre: userName,
          apellido: "",
          email: userEmail,
          telefono: "",
          proveedor: providerName,
        });
      } else {
        await setDoc(
          userDocRef,
          {
            proveedor: providerName,
          },
          { merge: true }
        );
      }

      const rolFetch = await fetch(
        `http://localhost:8080/autenticacion/getRole/${user.uid}`
      );
      const rol = await rolFetch.text();

      if (rol === "null" || rol === "" || rol === "Usuario no encontrado") {
        setTempUser(user);
        setShowRoleInput(true);
      } else {
        redirigirSegunRol(rol);
      }
    } catch (err) {
      console.error(
        `Error al iniciar sesión con ${providerName}:`,
        err.code,
        err.message
      );
      setError(`Error al iniciar sesión con ${providerName}: ${err.message}`);

      if (err.code === "auth/account-exists-with-different-credential") {
        setError(
          "Ya existe una cuenta con este email usando otro proveedor. Inicia sesión con ese método."
        );
      }
    }
  };

  const loginConGitHub = () => controladorProveedorLogin(githubProvider, "github");
  const loginConGoogle = () => controladorProveedorLogin(googleProvider, "google");
  const loginConFacebook = () => controladorProveedorLogin(facebookProvider, "facebook");

  const guardarRol = async () => {
    if (!selectedRole || !tempUser) {
      setError("Debe seleccionar un rol.");
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
      redirigirSegunRol(selectedRole);
    } catch (err) {
      console.error("Error al guardar el rol:", err);
      setError("Error al guardar el rol.");
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
      setError("No se encontró un rol válido.");
    }
  };

  const controlarLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredencial = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );
      const user = userCredencial.user;

      const rolFetch = await fetch(
        `http://localhost:8080/autenticacion/getRole/${user.uid}`
      );
      const rol = await rolFetch.text();

      redirigirSegunRol(rol);
    } catch (err) {
      console.error("Error al iniciar sesión:", err.code, err.message);
      setError("Error al iniciar sesión: " + err.message);
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
            <input name="email"onChange={infoInput}className="py-1 focus:outline-none bg-[#f4f4f4] mb-2 px-2 rounded-lg"placeholder="Correo electrónico"type="email"required/>
            <input name="password"onChange={infoInput}className="py-1 focus:outline-none bg-[#f4f4f4] mb-2 px-2 rounded-lg"placeholder="Contraseña"type="password"required/>

            <button type="submit"className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-1 mb-2">
              Ingresar
            </button>
            <button type="button"onClick={registrarClick}className="cursor-pointer text-[15px] mb-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg py-1">
              Registrarse
            </button>

            <button type="button"onClick={recuperarContraseña}className="text-[13px] hover:text-blue-500 mb-3">
              ¿Olvidaste tu contraseña?
            </button>

            <div className="bg-[#f4f4f4] h-1 rounded-lg"></div>
            <div className="flex flex-col items-center justify-center text-center pb-4 mt-4">
              <h1 className="mb-2">Ingresar con</h1>
              <div className="flex justify-center gap-1 w-full">
                <button type="button"onClick={loginConGitHub}className="flex items-center justify-center gap-2 cursor-pointer bg-black text-white rounded-lg py-1.5 px-3 border-2 border-black hover:bg-gray-700 hover:border-gray-700 transition">
                  <FaGithub size={20} color="white" />
                </button>

                <button type="button"onClick={loginConGoogle}className="flex items-center justify-center gap-2 cursor-pointer bg-white text-black rounded-lg py-1.5 px-3 border-2 hover:border-gray-800 transition">
                  <FcGoogle size={20} />
                </button>

                <button type="button"onClick={loginConFacebook}className="flex items-center justify-center gap-2 cursor-pointer bg-blue-600 text-white rounded-lg py-1.5 px-3 border-2 border-blue-600 hover:bg-blue-800 hover:border-blue-800 transition">
                  <FaFacebook size={20} color="white" />
                </button>
              </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;