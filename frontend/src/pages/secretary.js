import React, { useState } from 'react';
import Home from "../components/secretary-comp/HomeS";
import Ventas from "../components/secretary-comp/Ventas";
import Inventario from "../components/secretary-comp/Inventario";
import Registro from "../components/secretary-comp/RegistroCitas";
import Calendario from "../components/optometrist-comp/Calendario"
import { getAuth, signOut } from "firebase/auth";

export const Secretary = () => {
  const[selectedComponent, setSelectedComponent] = useState("home");

  const seleccionarComponente = (componente) => {
    setSelectedComponent(componente);
  }

  const cerrarSesion = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="min-h-screen flex h-screen bg-blue-500 p-[1px]">
      <div className="w-1/5 bg-blue-500 py-4 text-white h-screen flex flex-col">
        <ol className="pl-5 flex-1">
          <h1 className='px-2 text-[20px] mb-8 bg-blue-400 rounded-l-lg'>Secretaria</h1>
          <li className="cursor-pointer hover:bg-blue-400 px-2 rounded-l-lg mt-1" onClick={() => seleccionarComponente("home")}>Inicio</li>
          <li className="cursor-pointer hover:bg-blue-400 px-2 rounded-l-lg mt-1" onClick={() => seleccionarComponente("registro")}>Registrar cliente/cita</li>
          <li className="cursor-pointer hover:bg-blue-400 px-2 rounded-l-lg mt-1" onClick={() => seleccionarComponente("ventas")}>Ventas</li>
          <li className="cursor-pointer hover:bg-blue-400 px-2 rounded-l-lg mt-1" onClick={() => seleccionarComponente("inventario")}>Ver inventario</li>
          <li className="cursor-pointer hover:bg-blue-400 px-2 rounded-l-lg mt-1" onClick={() => seleccionarComponente("calendario")}>Calendario de citas</li>
        </ol>

        <div className='pl-5'>
          <button onClick={cerrarSesion} className="w-full text-left bg-blue-900 hover:bg-blue-950 text-white py-2 px-2 rounded-l-lg mt-auto">
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="w-4/5 bg-[#fff] m-[1px] px-2 py-4">
        {selectedComponent === 'home' && <Home />}
        {selectedComponent === 'ventas' && <Ventas />}
        {selectedComponent === 'registro' && <Registro />}
        {selectedComponent === 'inventario' && <Inventario />}
        {selectedComponent === 'calendario' && <Calendario />}
      </div>
    </div>
  );
}

export default Secretary;