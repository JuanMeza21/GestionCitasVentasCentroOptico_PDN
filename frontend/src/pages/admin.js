import React, { useState } from 'react';
import { Users, LogOut, History } from 'lucide-react';

import Usuarios from "../components/secretary-comp/Usuarios";
import HistorialAccesos from "../components/HistorialAccesos";

import { getAuth, signOut } from "firebase/auth";

export const Secretary = () => {
  const [selectedComponent, setSelectedComponent] = useState("usuarios");

  const seleccionarComponente = (componente) => {
    setSelectedComponent(componente);
  };

  const cerrarSesion = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'usuarios': return <Usuarios />;
      case 'historial': return <HistorialAccesos />;

      default: return <Usuarios />;
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-500">
      <div className="w-1/6 bg-blue-600 py-6 text-white flex flex-col">
        <h1 className='text-xl font-semibold px-5 mb-8'>Panel de administrador</h1>

        <nav className="flex-1">
          <ul className="pl-5 space-y-1">
            <MenuItem label="Usuarios del sistema" icon={<Users size={18} />} active={selectedComponent === "usuarios"} onClick={() => seleccionarComponente("usuarios")} />
            <MenuItem label="Historial de accesos" icon={<History size={18} />} active={selectedComponent === "historial"} onClick={() => seleccionarComponente("historial")} />
          </ul>
        </nav>

        <div className="pl-5 mt-4">
            <button onClick={cerrarSesion}className="w-full flex items-center gap-2 bg-blue-900 hover:bg-blue-950 text-white py-2 px-3 rounded-l-lg">
              <LogOut size={18} /> 
              Cerrar sesión
            </button>
        </div>
      </div>

      <div className="w-5/6 bg-white m-[1px] px-6 py-2 overflow-auto">
        {renderComponent()}
      </div>
    </div>
  );
};

const MenuItem = ({ label, icon, active, onClick }) => (
  <li className={`cursor-pointer px-3 py-2 rounded-l-lg flex items-center gap-2 ${active ? "bg-blue-800 font-semibold" : "hover:bg-blue-500"}`}onClick={onClick}>
    {icon} {label}
  </li>
);

export default Secretary;