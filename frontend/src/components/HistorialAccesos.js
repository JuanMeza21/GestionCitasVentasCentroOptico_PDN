import React, { useEffect, useState } from "react";
import { FaGoogle, FaGithub, FaFacebook, FaEnvelope } from "react-icons/fa";

const formatearFechaHora = (fechaISO) => {
  const fecha = new Date(fechaISO);

  const opcionesFecha = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const opcionesHora = {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  const fechaFormateada = fecha.toLocaleDateString("es-ES", opcionesFecha);
  const horaFormateada = fecha.toLocaleTimeString("es-ES", opcionesHora);

  return `${fechaFormateada}, ${horaFormateada}`;
};

const HistorialAccesos = () => {
  const [accesos, setAccesos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    const fetchAccesos = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/usuarios/historial-accesos"
        );
        const data = await response.json();
        setAccesos(data);
      } catch (err) {
        console.error("Error al obtener historial de accesos:", err);
      }
    };

    fetchAccesos();
  }, []);

  const totalPages = Math.ceil(accesos.length / recordsPerPage);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = accesos.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getProviderIcon = (proveedor) => {
    switch (proveedor?.toLowerCase()) {
      case "google":
        return <FaGoogle className="text-red-500" size={18} />;
      case "github":
        return <FaGithub className="text-gray-800" size={18} />;
      case "facebook":
        return <FaFacebook className="text-blue-600" size={18} />;
      case "email":
        return <FaEnvelope className="text-gray-600" size={18} />;
      default:
        return <FaEnvelope className="text-gray-400" size={18} />;
    }
  };

  const getRolColor = (rol) => {
    switch (rol?.toLowerCase()) {
      case "secretario/a":
        return "bg-green-100 text-green-800";
      case "optometrista":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="px-6 py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Historial de accesos</h2>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-[15px] text-left">
          <thead className="text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3 text-center">Proveedor</th>
              <th className="px-4 py-3 text-center">Rol</th>
              <th className="px-4 py-3">Fecha de acceso</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((acceso) => (
              <tr key={acceso.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  {acceso.nombre} {acceso.apellido}
                </td>
                <td className="px-4 py-3">{acceso.email}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    {getProviderIcon(acceso.proveedor)}
                  </div>
                </td>
                <td className="px-4 py-3 flex justify-center">
                  <span
                    className={`text-[12px] font-semibold px-3 py-1 rounded-full ${getRolColor(
                      acceso.rol
                    )} inline-block text-center min-w-[100px]`}
                  >
                    {acceso.rol}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {formatearFechaHora(acceso.fechaAcceso)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <nav className="inline-flex rounded-md shadow">
          <button onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}disabled={currentPage === 1}className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Anterior
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 border-t border-b border-gray-300 ${
                currentPage === number
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {number}
            </button>
          ))}

          <button onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}disabled={currentPage === totalPages}className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Siguiente
          </button>
        </nav>
      </div>
    </div>
  );
};

export default HistorialAccesos;