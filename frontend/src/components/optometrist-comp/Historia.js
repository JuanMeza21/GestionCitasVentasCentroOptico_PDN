import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

const HistoriaClinicaForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    genero: '',
    documento: '',
    motivo: '',
    antecedentes: '',
    agudezaOD: '',
    agudezaOI: '',
    dxprincipal: '',
    dxcomplementario: '',
    recomendaciones: '',
    fecha: new Date().toISOString().slice(0, 10),
  });

  const [historias, setHistorias] = useState([]);
  const [editId, setEditId] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const historiasRef = collection(db, 'historias');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const traerHistorias = async () => {
    const data = await getDocs(historiasRef);
    setHistorias(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    traerHistorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const camposIncompletos = Object.entries(formData).filter(([_, v]) => !v.trim());
    if (camposIncompletos.length > 0) {
      alert('Por favor completa todos los campos antes de guardar.');
      return;
    }

    try {
      if (editId) {
        const historiaDoc = doc(db, 'historias', editId);
        await updateDoc(historiaDoc, formData);
        setEditId(null);
      } else {
        await addDoc(historiasRef, formData);
      }
      setFormData({
        nombre: '',
        edad: '',
        genero: '',
        documento: '',
        motivo: '',
        antecedentes: '',
        agudezaOD: '',
        agudezaOI: '',
        dxprincipal: '',
        dxcomplementario: '',
        recomendaciones: '',
        fecha: new Date().toISOString().slice(0, 10),
      });
      traerHistorias();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás segura de eliminar esta historia clínica?')) {
      await deleteDoc(doc(db, 'historias', id));
      traerHistorias();
    }
  };

  const handleEdit = (historia) => {
    setFormData({ ...historia });
    setEditId(historia.id);
  };

  const historiasFiltradas = historias.filter((historia) =>
    historia.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    historia.documento.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-blue-800">Historia Clínica</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre completo" className="input" required />
          <input name="edad" value={formData.edad} onChange={handleChange} placeholder="Edad" className="input" required />
          <select name="genero" value={formData.genero} onChange={handleChange} className="input" required>
            <option value="">Seleccione género</option>
            <option value="Femenino">Femenino</option>
            <option value="Masculino">Masculino</option>
            <option value="Otro">Otro</option>
          </select>
          <input name="documento" value={formData.documento} onChange={handleChange} placeholder="Documento de identidad" className="input" required />
        </div>

        <textarea name="motivo" value={formData.motivo} onChange={handleChange} placeholder="Motivo de consulta" className="textarea" required />
        <textarea name="antecedentes" value={formData.antecedentes} onChange={handleChange} placeholder="Antecedentes médicos, quirúrgicos, familiares..." className="textarea" required />

        <div className="grid grid-cols-2 gap-4">
          <input name="agudezaOD" value={formData.agudezaOD} onChange={handleChange} placeholder="Agudeza visual OD" className="input" required />
          <input name="agudezaOI" value={formData.agudezaOI} onChange={handleChange} placeholder="Agudeza visual OI" className="input" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input name="dxprincipal" value={formData.dxprincipal} onChange={handleChange} placeholder="Dx Principal" className="input" required />
          <input name="dxcomplementario" value={formData.dxcomplementario} onChange={handleChange} placeholder="Dx Complementario" className="input" required />
        </div>

        <textarea name="recomendaciones" value={formData.recomendaciones} onChange={handleChange} placeholder="Plan de manejo" className="textarea" required />

        <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} className="input" required />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editId ? 'Actualizar' : 'Guardar'}
        </button>
      </form>

      {/* Barra de búsqueda */}
      <div className="mt-10 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o documento..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Tabla de historias clínicas */}
      <table className="w-full table-auto border mt-4">
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
          {historiasFiltradas.map((historia) => (
            <tr key={historia.id}>
              <td className="border px-2 py-1">{historia.nombre}</td>
              <td className="border px-2 py-1">{historia.documento}</td>
              <td className="border px-2 py-1">{historia.fecha}</td>
              <td className="border px-2 py-1">{historia.dxprincipal}</td>
              <td className="border px-2 py-1 space-x-2">
                <button onClick={() => handleEdit(historia)} className="bg-yellow-400 px-2 py-1 rounded text-white">Editar</button>
                <button onClick={() => handleDelete(historia.id)} className="bg-red-600 px-2 py-1 rounded text-white">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoriaClinicaForm;
