import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cliente from './Cliente';
import Inventario from './Inventario';
import RegistroCitas from './RegistroCitas';
import Ventas from './Ventas';

const HomeSecretaria = () => {
  const secciones = [
    { nombre: "Clientes", ruta: "./Cliente" },
    { nombre: "Citas", ruta: "/secretaria/citas" },
    { nombre: "Ventas", ruta: "/secretaria/ventas" },
    { nombre: "Ver inventario", ruta: "/secretaria/inventario" },
    { nombre: "Calendario de citas", ruta: "/secretaria/calendario" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Bienvenida al Panel de Secretaria</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {secciones.map((sec) => (
          <Link
            to={sec.ruta}
            key={sec.nombre}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg border border-gray-200 transition duration-300 hover:bg-blue-50"
          >
            <h2 className="text-xl font-semibold text-blue-700">{sec.nombre}</h2>
            <p className="text-gray-600 mt-2">Ir a la sección de {sec.nombre.toLowerCase()}.</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomeSecretaria;
