import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import Perfil from "../images/perfill.jpg";

export const Register_account = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
    rol: "optometra", 
  });

  const [error, setError] = useState("");

  const infoInput = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const controlarRegistro = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredencial = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredencial.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.email,
        telefono: userData.telefono,
        rol: userData.rol,
      });

      navigate("/login");
    } catch (err) {
      setError("Error al registrar: " + err.message);
    }
  };

  return (
    <div className="bg-slate-200">
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white text-center rounded-3xl px-8 w-[360px] border-2 shadow-lg">
          <h1 className="pt-4 text-[20px]">REGISTRARSE</h1>
          <div className="flex justify-center items-center my-4">
            <img className="w-[120px]" src={Perfil} alt="perfil" />
          </div>

          <form onSubmit={controlarRegistro} className="grid items-center text-center py-2 px-4">
            <input name="nombre" onChange={infoInput} className="py-1 bg-[#f4f4f4] mb-2 px-2 rounded-lg" placeholder="Nombre" type="text" required />
            <input name="apellido" onChange={infoInput} className="py-1 bg-[#f4f4f4] mb-2 px-2 rounded-lg" placeholder="Apellido" type="text" required />
            <input name="email" onChange={infoInput} className="py-1 bg-[#f4f4f4] mb-2 px-2 rounded-lg" placeholder="Correo electrónico" type="email" required />
            <input name="telefono" onChange={infoInput} className="py-1 bg-[#f4f4f4] mb-2 px-2 rounded-lg" placeholder="Teléfono" type="text" required />
            <input name="password" onChange={infoInput} className="py-1 bg-[#f4f4f4] mb-2 px-2 rounded-lg" placeholder="Contraseña" type="password" required />

            <select name="rol" onChange={infoInput} className="py-1 bg-[#f4f4f4] mb-2 px-2 rounded-lg">
              <option value="optometra">Optometrista</option>
              <option value="secretaria">Secretario/a</option>
            </select>

            <button type="submit" className="cursor-pointer bg-blue-500 text-white rounded-lg py-1 mb-2">
              Registrarse
            </button>

            <button onClick={() => navigate("/login")} type="button" className="cursor-pointer text-[15px] mb-2 hover:bg-blue-500 hover:text-[white] rounded-lg py-1">
              Volver a iniciar Sesión
            </button>

            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register_account;