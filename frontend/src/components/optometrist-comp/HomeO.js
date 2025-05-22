import React from 'react';
import { useNavigate } from 'react-router-dom';

const OptometraHome = () => {
  const navigate = useNavigate();
  const nombre = localStorage.getItem('nombre') || 'Optómetra';

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/login');  
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-700">
        Bienvenido(a), {nombre} 👩‍⚕️
      </h1>
      <p className="text-gray-600 mb-6">Panel principal de gestión</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg font-semibold text-blue-700"
          onClick={() => navigate('/optometrist/historia-clinica')}
        >
          Historia Clínica
        </button>

        <button
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg font-semibold text-blue-700"
          onClick={() => navigate('/optometrist/pacientes')}
        >
          Pacientes
        </button>

        <button
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg font-semibold text-blue-700"
          onClick={() => navigate('/optometrist/agendar-cita')}
        >
          Agendar Cita
        </button>

        <button
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg font-semibold text-blue-700"
          onClick={() => navigate('/optometrist/citas-hoy')}
        >
          Citas de Hoy
        </button>

        <button
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg font-semibold text-blue-700"
          onClick={() => navigate('/optometrist/reportes')}
        >
          Reportes
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 p-6 rounded-xl shadow-md hover:bg-red-600 font-semibold text-white"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default OptometraHome;
