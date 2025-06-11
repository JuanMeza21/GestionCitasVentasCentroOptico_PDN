import React, { useEffect, useState } from "react";
import { FaGoogle, FaGithub, FaFacebook, FaEnvelope, FaSearch, FaFilter } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const [filteredAccesos, setFilteredAccesos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);
  const recordsPerPage = 10;

  useEffect(() => {
    const fetchAccesos = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/usuarios/historial-accesos"
        );
        const data = await response.json();
        setAccesos(data);
        setFilteredAccesos(data);
      } catch (err) {
        console.error("Error al obtener historial de accesos:", err);
      }
    };

    fetchAccesos();
  }, []);

  // Aplicar filtros y búsqueda
  useEffect(() => {
    let result = [...accesos];

    // Filtro por búsqueda de texto
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(acceso => 
        acceso.nombre.toLowerCase().includes(term) ||
        acceso.apellido.toLowerCase().includes(term) ||
        acceso.email.toLowerCase().includes(term) ||
        acceso.rol.toLowerCase().includes(term)
      );
    }

    // Filtro por fecha
    if (selectedDate) {
      const selectedDateStr = selectedDate.toISOString().split('T')[0];
      result = result.filter(acceso => {
        const accesoDate = new Date(acceso.fechaAcceso).toISOString().split('T')[0];
        return accesoDate === selectedDateStr;
      });
    }

    // Ordenamiento
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredAccesos(result);
    setCurrentPage(1); // Resetear a la primera página al aplicar filtros
  }, [accesos, searchTerm, selectedDate, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDate(null);
    setSortConfig({ key: null, direction: 'asc' });
  };

  const totalPages = Math.ceil(filteredAccesos.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredAccesos.slice(indexOfFirstRecord, indexOfLastRecord);

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
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          <FaFilter /> {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nombre, email o rol..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha específica</label>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                placeholderText="Seleccione una fecha"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                isClearable
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-2 text-sm text-gray-600">
        Mostrando {filteredAccesos.length} registros
        {selectedDate && ` (filtrados por fecha: ${selectedDate.toLocaleDateString('es-ES')})`}
        {searchTerm && ` (filtrados por término: "${searchTerm}")`}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-[15px] text-left">
          <thead className="text-gray-700 uppercase bg-gray-100">
            <tr>
              <th 
                className="px-4 py-3 cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort('nombre')}
              >
                <div className="flex items-center">
                  Usuario
                  {sortConfig.key === 'nombre' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort('email')}
              >
                <div className="flex items-center">
                  Correo
                  {sortConfig.key === 'email' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-center">Proveedor</th>
              <th className="px-4 py-3 text-center">Rol</th>
              <th 
                className="px-4 py-3 cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort('fechaAcceso')}
              >
                <div className="flex items-center">
                  Fecha de acceso
                  {sortConfig.key === 'fechaAcceso' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((acceso) => (
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
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  No se encontraron registros con los filtros aplicados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <nav className="inline-flex rounded-md shadow">
            <button 
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
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

            <button 
              onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default HistorialAccesos;