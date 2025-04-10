import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; 
import { getDoc } from "firebase/firestore"; 

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, githubProvider } from "../firebaseConfig";
import Perfil from "../images/perfill.jpg";
import { googleProvider } from "../firebaseConfig";

export const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showRoleInput, setShowRoleInput] = useState(false);
  const [tempUser, setTempUser] = useState(null); 
  const [selectedRole, setSelectedRole] = useState("");

  const infoInput = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const registrarClick = () => {
    navigate("/registro");
  };

  const loginConGitHub = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;

      console.log(user);

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
        "Error al iniciar sesión con GitHub:",
        err.code,
        err.message
      );
      setError("Error al iniciar sesión con GitHub: " + err.message);
    }
  };

  const loginConGoogle = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
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
      console.error("Error al iniciar sesión con Google:", err.code, err.message);
      setError("Error al iniciar sesión con Google: " + err.message);
    }
  };



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
    } else {
      setError("No se encontró un rol válido.");
    }
  };

  const controlarLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredencial = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      const user = userCredencial.user;

      const rolFetch = await fetch(`http://localhost:8080/autenticacion/getRole/${user.uid}`);
      const rol = await rolFetch.text();

      redirigirSegunRol(rol);
    } catch (err) {
      console.error("Error al iniciar sesión:", err.code, err.message);
      setError("Error al iniciar sesión: " + err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-200">
      <div className="bg-white text-center rounded-3xl px-8 w-[360px] border-2 shadow-lg">
        <h1 className="pt-4 text-[20px]">INICIAR SESIÓN</h1>

        <div className="flex justify-center items-center my-4">
          <img className="w-[120px]" src={Perfil} alt="perfil" />
        </div>

        {showRoleInput ? (
          <div className="flex flex-col items-center py-4">
            <label className="mb-2 text-sm font-semibold">Selecciona tu rol:</label>
            <select value={selectedRole}onChange={(e) => setSelectedRole(e.target.value)}className="mb-4 p-1 rounded-md bg-slate-100">
              <option value="">Selecciona</option>
              <option value="optometrista">Optometrista</option>
              <option value="secretario/a">Secretario/a</option>
            </select>
            <button onClick={guardarRol}className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-green-600">
              Guardar Rol
            </button>
          </div>
        ) : (
          <form onSubmit={controlarLogin} className="grid items-center text-center py-2 px-4">
            <input name="email" onChange={infoInput} className="py-1 focus:outline-none bg-[#f4f4f4] mb-2 px-2 rounded-lg" placeholder="Correo electrónico" type="email" required />
            <input name="password" onChange={infoInput} className="py-1 focus:outline-none bg-[#f4f4f4] mb-2 px-2 rounded-lg" placeholder="Contraseña" type="password" required />

            <button type="submit" className="cursor-pointer bg-blue-500 text-white rounded-lg py-1 mb-2">
              Ingresar
            </button>

            <button type="button" onClick={registrarClick} className="cursor-pointer text-[15px] mb-2 hover:bg-blue-500 hover:text-[white] rounded-lg py-1">
              Registrarse
            </button>

            <div className="bg-[#f4f4f4] h-1 rounded-lg"></div>
            <div className="flex flex-col items-center justify-center text-center pb-4 mt-4">
              <h1 className="mb-2">Ingresar con</h1>
              <div className="flex gap-1">
                <button type="button" onClick={loginConGitHub} className="cursor-pointer bg-black text-white rounded-lg py-1 px-2 hover:bg-gray-800">
                  GitHub
                </button>
                <button type="button" onClick={loginConGoogle} className="cursor-pointer bg-green-600 text-white rounded-lg py-1 px-2 hover:bg-green-700">
                  Google
                </button>


                <button type="button" className="cursor-pointer bg-blue-600 text-white rounded-lg py-1 px-2 hover:bg-blue-700">
                  Facebook
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