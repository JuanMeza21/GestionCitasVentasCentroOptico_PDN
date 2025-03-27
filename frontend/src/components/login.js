import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Perfil from "../images/perfill.jpg";

export const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const infoInput = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const registrarClick = () => {
    navigate("/registro");
  };

  const controlarLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredencial = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      const user = userCredencial.user;

      const rolFetch = await fetch(`http://localhost:8080/autenticacion/getRole/${user.uid}`);

      const rol = await rolFetch.text();
 
      if (rol === "optometra") {
        navigate("/optometrist");
      } else if (rol === "secretaria") {
        navigate("/secretary");
      } else {
        setError("No se encontró un rol válido.");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err.code, err.message);
      setError("Error al iniciar sesión: " + err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-200">
      <div className="bg-[#ffffff] text-center rounded-3xl px-8 w-[360px] border-2 shadow-lg">
        <h1 className="pt-4 text-[20px]">INICIAR SESIÓN</h1>

        <div className="flex justify-center items-center my-4">
          <img className="w-[120px]" src={Perfil} alt="perfil" />
        </div>

        <form onSubmit={controlarLogin}className="grid items-center text-center py-2 px-4">
          <input name="email"onChange={infoInput}className="py-1 focus:outline-none bg-[#f4f4f4] mb-2 px-2 rounded-lg"placeholder="Correo electrónico"type="email"required/>
          <input name="password"onChange={infoInput}className="py-1 focus:outline-none bg-[#f4f4f4] mb-2 px-2 rounded-lg"placeholder="Contraseña"type="password"required/>

          <button type="submit" className="cursor-pointer bg-blue-500 text-white rounded-lg py-1 mb-2">
            Ingresar
          </button>

          <button type="button"onClick={registrarClick}className="cursor-pointer text-[15px] mb-2 hover:bg-blue-500 hover:text-[white] rounded-lg py-1">
            Registrarse
          </button>

          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
