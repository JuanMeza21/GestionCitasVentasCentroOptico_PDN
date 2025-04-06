import React, { useState } from 'react';
import { Home as HomeIcon, Users, Calendar, ShoppingCart, ClipboardList, PackageSearch, LogOut } from 'lucide-react';

import Home from "../components/secretary-comp/HomeS";
import Ventas from "../components/secretary-comp/Ventas";
import Inventario from "../components/secretary-comp/Inventario";
import Registro from "../components/secretary-comp/RegistroCitas";
import Calendario from "../components/optometrist-comp/Calendario";
import Clientes from "../components/secretary-comp/Cliente";
import Usuarios from "../components/secretary-comp/Usuarios";

import { getAuth, signOut } from "firebase/auth";

export const Secretary = () => {
  const [selectedComponent, setSelectedComponent] = useState("home");

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
      case 'home': return <Home />;
      case 'ventas': return <Ventas />;
      case 'registro': return <Registro />;
      case 'inventario': return <Inventario />;
      case 'calendario': return <Calendario />;
      case 'clientes': return <Clientes />;
      case 'usuarios': return <Usuarios />;

      default: return <Home />;
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-500">
      <div className="w-1/5 bg-blue-600 py-6 text-white flex flex-col">
        <h1 className='text-xl font-semibold px-5 mb-8'>Panel de secretario/a</h1>

        <nav className="flex-1">
          <ul className="pl-5 space-y-1">
            <MenuItem label="Inicio" icon={<HomeIcon size={18} />} active={selectedComponent === "home"} onClick={() => seleccionarComponente("home")} />
            <MenuItem label="Clientes" icon={<Users size={18} />} active={selectedComponent === "clientes"} onClick={() => seleccionarComponente("clientes")} />
            <MenuItem label="Citas" icon={<ClipboardList size={18} />} active={selectedComponent === "registro"} onClick={() => seleccionarComponente("registro")} />
            <MenuItem label="Ventas" icon={<ShoppingCart size={18} />} active={selectedComponent === "ventas"} onClick={() => seleccionarComponente("ventas")} />
            <MenuItem label="Ver inventario" icon={<PackageSearch size={18} />} active={selectedComponent === "inventario"} onClick={() => seleccionarComponente("inventario")} />
            <MenuItem label="Calendario de citas" icon={<Calendar size={18} />} active={selectedComponent === "calendario"} onClick={() => seleccionarComponente("calendario")} />
            <MenuItem label="Usuarios del sistema" icon={<Users size={18} />} active={selectedComponent === "usuarios"} onClick={() => seleccionarComponente("usuarios")} />
          </ul>
        </nav>

        <div className="pl-5 mt-4">
            <button onClick={cerrarSesion}className="w-full flex items-center gap-2 bg-blue-900 hover:bg-blue-950 text-white py-2 px-3 rounded-l-lg">
              <LogOut size={18} /> 
              Cerrar sesión
            </button>
        </div>
      </div>

      <div className="w-4/5 bg-white m-[1px] px-6 py-2 overflow-auto">
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