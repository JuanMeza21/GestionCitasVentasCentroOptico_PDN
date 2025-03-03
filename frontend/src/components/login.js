import React from 'react';
import { useNavigate } from 'react-router-dom';
import Perfil from '../images/perfill.jpg';

export const Login = () => {

  const navigate = useNavigate();

  const registrarClick = () => {
    navigate("/registro");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-200">
      <div className="bg-[#ffffff] text-center rounded-3xl px-8 w-[360px] border-2 shadow-lg">

        <h1 className="pt-4 text-[20px]">INICIAR SESIÓN</h1>

        <div className="flex justify-center items-center my-4">
          <img className="w-[120px]" src={Perfil} alt="perfil" />
        </div>

        <form className="grid items-center text-center py-2 px-4">
          <input className="py-1 focus:outline-none bg-[#f4f4f4] mb-2 px-2 rounded-lg" placeholder="Correo electrónico" type='email' required></input>
          <input className="py-1 focus:outline-none bg-[#f4f4f4] mb-2 px-2 rounded-lg" placeholder="Contraseña" type='password' required></input>

          <button type="submit" className="cursor-pointer bg-blue-500 text-white rounded-lg py-1 mb-2">
            Ingresar
          </button>
          <button type="button"onClick={registrarClick}  className="cursor-pointer text-[15px] mb-2 hover:bg-blue-500 hover:text-[white] rounded-lg py-1">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;