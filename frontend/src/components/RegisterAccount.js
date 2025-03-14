import React from 'react';
import { useNavigate } from 'react-router-dom';
import Perfil from "../images/perfill.jpg";
import { useEffect, useState } from "react";

export const Register_account = () => {
  
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const registrarClick = () => {
    navigate("/login");
  }

  useEffect(() => {
    fetch("http://localhost:8080/register")
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className='bg-slate-200'>
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white text-center rounded-3xl px-8 w-[360px] border-2 shadow-lg">

          <h1 className="pt-4 text-[20px]">REGISTRARSE</h1>
          <div className="flex justify-center items-center my-4">
            <img className="w-[120px]" src={Perfil} alt="perfil" />
          </div>

          <form className="grid items-center text-center py-2 px-4">
            <input className="py-1 focus:outline-none bg-[#f4f4f4] mb-2 px-2 rounded-lg" placeholder="Nombre" type="text" required/>
            <input className="py-1 focus:outline-none bg-[#f4f4f4] mb-2 px-2 rounded-lg" placeholder="Segundo nombre" type="text"/>
            <input className="py-1 focus:outline-none bg-[#f4f4f4] mb-2 px-2 rounded-lg" placeholder="Primer apellido" type="text" required/>
            <input className="py-1 focus:outline-none bg-[#f4f4f4] mb-2 px-2 rounded-lg" placeholder="Segundo apellido" type="text"/>
            <input className="py-1 focus:outline-none bg-[#f4f4f4] mb-2 px-2 rounded-lg" placeholder="Correo electrónico" type="email" required/>
            <input className="py-1 focus:outline-none bg-[#f4f4f4] mb-2 px-2 rounded-lg" placeholder="Teléfono" type="text" required />
            <input className="py-1 focus:outline-none bg-[#f4f4f4] mb-2 px-2 rounded-lg" placeholder="Contraseña" type='password' required></input>

            <button type="submit" className="cursor-pointer bg-blue-500 text-white rounded-lg py-1 mb-2">
              Registrarse
            </button>

            <button onClick={registrarClick} type="button" className="cursor-pointer text-[15px] mb-2 hover:bg-blue-500 hover:text-[white] rounded-lg py-1">
              Volver a iniciar Sesión
            </button>

            <div>
              <h1>{message}</h1>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register_account;