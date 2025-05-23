import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const ConsultaHistoriaClinicaSecretaria = () => {
  const [historias, setHistorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [historiaSeleccionada, setHistoriaSeleccionada] = useState(null);

  const historiasRef = collection(db, 'historias');

  const traerHistorias = async () => {
    const data = await getDocs(historiasRef);
    setHistorias(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    traerHistorias();
  }, []);

  const historiasFiltradas = historias.filter(historia =>
    historia.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    historia.documento.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-blue-800">Consulta de Historias Clínicas</h2>

      <input
        type="text"
        placeholder="Buscar por nombre o documento..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6"
      />

      <div className="overflow-x-auto">
        <table className="w-full table-auto border">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-2 py-1 border">Nombre</th>
              <th className="px-2 py-1 border">Documento</th>
              <th className="px-2 py-1 border">Fecha</th>
              <th className="px-2 py-1 border">Dx Principal</th>
              <th className="px-2 py-1 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {historiasFiltradas.map(historia => (
              <tr key={historia.id}>
                <td className="border px-2 py-1">{historia.nombre}</td>
                <td className="border px-2 py-1">{historia.documento}</td>
                <td className="border px-2 py-1">{historia.fecha}</td>
                <td className="border px-2 py-1">{historia.dxprincipal}</td>
                <td className="border px-2 py-1 text-center">
                  <button
                    onClick={() => setHistoriaSeleccionada(historia)}
                    className="bg-blue-600 px-3 py-1 rounded text-white hover:bg-blue-700"
                  >
                    Ver más
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {historiaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative">
            <button
              onClick={() => setHistoriaSeleccionada(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4 text-blue-800">Detalle de Historia Clínica</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Nombre:</strong> {historiaSeleccionada.nombre}</p>
              <p><strong>Edad:</strong> {historiaSeleccionada.edad}</p>
              <p><strong>Género:</strong> {historiaSeleccionada.genero}</p>
              <p><strong>Documento:</strong> {historiaSeleccionada.documento}</p>
              <p><strong>Motivo de consulta:</strong> {historiaSeleccionada.motivo}</p>
              <p><strong>Antecedentes:</strong> {historiaSeleccionada.antecedentes}</p>
              <p><strong>Agudeza visual OD:</strong> {historiaSeleccionada.agudezaOD}</p>
              <p><strong>Agudeza visual OI:</strong> {historiaSeleccionada.agudezaOI}</p>
              <p><strong>Dx Principal:</strong> {historiaSeleccionada.dxprincipal}</p>
              <p><strong>Dx Complementario:</strong> {historiaSeleccionada.dxcomplementario}</p>
              <p><strong>Recomendaciones:</strong> {historiaSeleccionada.recomendaciones}</p>
              <p><strong>Fecha:</strong> {historiaSeleccionada.fecha}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultaHistoriaClinicaSecretaria;
