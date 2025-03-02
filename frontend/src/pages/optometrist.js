import React, { useState } from 'react';
import Home from "../components/optometrist-comp/HomeO";
import Historia from "../components/optometrist-comp/Historia";
import Evaluacion from "../components/optometrist-comp/Evaluacion";
import Calendario from "../components/optometrist-comp/Calendario";

export const Optometrist = () => {
  const [selectedComponent, setSelectedComponent] = useState("home");

  const seleccionarComponente = (componente) => {
    setSelectedComponent(componente);
  };

  return (
    <div className="min-h-screen flex bg-blue-500 h-screen p-[1px]">
      <div className="bg-blue-500 py-4 text-white w-1/5 h-screen flex flex-col">
        <ol className="pl-5 flex-1">
          <h1 className='px-2 text-[20px] mb-8 bg-blue-400 rounded-l-lg'>Optometra</h1>
          <li className="cursor-pointer hover:bg-blue-400 px-2 rounded-l-lg mt-1" onClick={() => seleccionarComponente('home')}>Inicio</li>
          <li className="cursor-pointer hover:bg-blue-400 px-2 rounded-l-lg mt-1" onClick={() => seleccionarComponente('historia')}>Historias clínicas</li>
          <li className="cursor-pointer hover:bg-blue-400 px-2 rounded-l-lg mt-1" onClick={() => seleccionarComponente('evaluacion')}>Evaluaciones visuales</li>
          <li className="cursor-pointer hover:bg-blue-400 px-2 rounded-l-lg mt-1" onClick={() => seleccionarComponente('calendario')}>Calendario de citas</li>
        </ol>

        <div className='pl-5'>
          <button className="w-full text-left bg-blue-900 hover:bg-blue-950 text-white py-2 px-2 rounded-l-lg mt-auto">
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="w-4/5 bg-[#fff] m-[1px] px-2 py-4">
        {selectedComponent === 'home' && <Home />}
        {selectedComponent === 'historia' && <Historia />}
        {selectedComponent === 'evaluacion' && <Evaluacion />}
        {selectedComponent === 'calendario' && <Calendario />}
      </div>
    </div>
  );
}

export default Optometrist;