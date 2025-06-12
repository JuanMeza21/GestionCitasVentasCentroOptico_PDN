import React, { useEffect, useState } from "react";
import { FaGoogle, FaGithub, FaFacebook, FaEnvelope, FaSearch, FaFilter, FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TIMEZONE_OFFSET = -5 * 60 * 60 * 1000; 

const toUTC5 = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return new Date(d.getTime() + d.getTimezoneOffset() * 60000 + TIMEZONE_OFFSET);
};

const formatearFechaHoraUTC5 = (fechaISO) => {
  if (!fechaISO) return "Fecha no disponible";
  
  try {
    const fecha = toUTC5(fechaISO);
    if (isNaN(fecha.getTime())) return "Fecha inválida";

    const dia = fecha.getDate();
    const mes = fecha.toLocaleString('es-ES', { month: 'long' });
    const año = fecha.getFullYear();
    
    let horas = fecha.getHours();
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segundos = fecha.getSeconds().toString().padStart(2, '0');
    
    const ampm = horas >= 12 ? 'PM' : 'AM';
    horas = horas % 12 || 12;

    return `${dia} de ${mes} de ${año}, ${horas}:${minutos}:${segundos} ${ampm} (UTC-5)`;
  } catch (err) {
    console.error("Error formateando fecha:", err);
    return "Error en fecha";
  }
};
const sonMismoDiaUTC5 = (fecha1, fecha2) => {
  if (!fecha1 || !fecha2) return false;
  
  const d1 = toUTC5(fecha1);
  const d2 = toUTC5(fecha2);
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const HistorialAccesos = () => {
  const [accesos, setAccesos] = useState([]);
  const [filteredAccesos, setFilteredAccesos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateOptions, setDateOptions] = useState([]);
  const [showAllDates, setShowAllDates] = useState(true);
  const recordsPerPage = 10;

  useEffect(() => {
    const fetchAccesos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:8080/usuarios/historial-accesos");
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();
        setAccesos(data);
        setFilteredAccesos(data);
        
        const fechasUnicas = [...new Set(data.map(acceso => {
          const fecha = acceso.fechaAcceso ? new Date(acceso.fechaAcceso) : null;
          return fecha ? fecha.toISOString().split('T')[0] : null;
        }))].filter(Boolean).sort().reverse();
        
        setDateOptions(fechasUnicas.map(fecha => ({
          label: new Date(fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
          value: fecha
        })));
      } catch (err) {
        console.error("Error al obtener historial de accesos:", err);
        setError("No se pudo cargar el historial de accesos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccesos();
  }, []);

  useEffect(() => {
    let result = [...accesos];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(acceso => 
        (acceso.nombre?.toLowerCase().includes(term) ||
        (acceso.apellido?.toLowerCase().includes(term)) ||
        (acceso.email?.toLowerCase().includes(term)) ||
        (acceso.rol?.toLowerCase().includes(term))
      ));
    }

    if (!showAllDates && selectedDate) {
      result = result.filter(acceso => 
        sonMismoDiaUTC5(acceso.fechaAcceso, selectedDate)
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (sortConfig.key === 'fechaAcceso') {
          const dateA = new Date(a.fechaAcceso).getTime();
          const dateB = new Date(b.fechaAcceso).getTime();
          return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
        }
        
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    setFilteredAccesos(result);
    setCurrentPage(1);
  }, [accesos, searchTerm, selectedDate, sortConfig, showAllDates]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowAllDates(false);
  };

  const handleShowAllDates = () => {
    setShowAllDates(true);
    setSelectedDate(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDate(null);
    setShowAllDates(true);
    setSortConfig({ key: null, direction: 'ascending' });
  };

  const totalPages = Math.max(Math.ceil(filteredAccesos.length / recordsPerPage), 1);
  const indexOfLastRecord = Math.min(currentPage * recordsPerPage, filteredAccesos.length);
  const indexOfFirstRecord = Math.max(indexOfLastRecord - recordsPerPage, 0);
  const currentRecords = filteredAccesos.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => {
    const page = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(page);
  };

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const getProviderIcon = (proveedor) => {
    if (!proveedor) return <FaEnvelope className="text-gray-400" size={18} />;
    
    const provider = proveedor.toLowerCase();
    const icons = {
      google: <FaGoogle className="text-red-500" size={18} />,
      github: <FaGithub className="text-gray-800" size={18} />,
      facebook: <FaFacebook className="text-blue-600" size={18} />,
      email: <FaEnvelope className="text-gray-600" size={18} />
    };
    
    return icons[provider] || icons.email;
  };

  const getRolColor = (rol) => {
    if (!rol) return "bg-gray-100 text-gray-800";
    
    const rolLower = rol.toLowerCase();
    const colors = {
      "secretario/a": "bg-green-100 text-green-800",
      "optometrista": "bg-purple-100 text-purple-800",
      "admin": "bg-orange-100 text-orange-800"
    };
    
    return colors[rolLower] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="px-6 py-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Historial de accesos</h2>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por fecha</label>
              <div className="flex gap-2">
                <button
                  onClick={handleShowAllDates}
                  className={`px-3 py-2 text-sm rounded-md ${showAllDates ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Todas las fechas
                </button>
                <div className="flex-1">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Seleccione fecha"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    isClearable
                    maxDate={new Date()}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors disabled:opacity-50"
                disabled={!searchTerm && !selectedDate && showAllDates}
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-2 text-sm text-gray-600">
        Mostrando {filteredAccesos.length} registros
        {!showAllDates && selectedDate && ` (filtrados por fecha: ${selectedDate.toLocaleDateString('es-ES')})`}
        {showAllDates && ' (mostrando todas las fechas históricas)'}
        {searchTerm && ` (filtrados por término: "${searchTerm}")`}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-[15px] text-left">
          <thead className="text-gray-700 uppercase bg-gray-100">
            <tr>
              <th 
                className="px-4 py-3 cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => requestSort('nombre')}
              >
                <div className="flex items-center">
                  Usuario
                  {sortConfig.key === 'nombre' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => requestSort('email')}
              >
                <div className="flex items-center">
                  Correo
                  {sortConfig.key === 'email' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-center">Proveedor</th>
              <th className="px-4 py-3 text-center">Rol</th>
              <th 
                className="px-4 py-3 cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => requestSort('fechaAcceso')}
              >
                <div className="flex items-center">
                  Fecha de acceso
                  {sortConfig.key === 'fechaAcceso' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((acceso) => (
                <tr key={acceso.id || Math.random()} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    {acceso.nombre || 'N/A'} {acceso.apellido || ''}
                  </td>
                  <td className="px-4 py-3">{acceso.email || 'N/A'}</td>
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
                      {acceso.rol || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {formatearFechaHoraUTC5(acceso.fechaAcceso)}
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
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`px-3 py-1 border-t border-b border-gray-300 ${
                    currentPage === pageNum
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-500">
                ...
              </span>
            )}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                onClick={() => paginate(totalPages)}
                className={`px-3 py-1 border-t border-b border-gray-300 ${
                  currentPage === totalPages
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {totalPages}
              </button>
            )}

            <button 
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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