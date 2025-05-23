import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';

const RegistroCitas = () => {
  const [citas, setCitas] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    documento: '',
    fecha: '',
    hora: '',
    motivo: '',
  });

  const citasRef = collection(db, 'citas');

  const traerCitas = async () => {
    const data = await getDocs(citasRef);
    setCitas(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    traerCitas();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some((v) => !v.trim())) {
      alert('Por favor completa todos los campos.');
      return;
    }

    try {
      await addDoc(citasRef, formData);
      setFormData({
        nombre: '',
        documento: '',
        fecha: '',
        hora: '',
        motivo: '',
      });
      traerCitas();
    } catch (error) {
      console.error('Error al registrar la cita:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Deseas eliminar esta cita?')) {
      await deleteDoc(doc(db, 'citas', id));
      traerCitas();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-800">Registro de Citas</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre del paciente" className="input" />
        <input name="documento" value={formData.documento} onChange={handleChange} placeholder="Documento" className="input" />
        <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} className="input" />
        <input type="time" name="hora" value={formData.hora} onChange={handleChange} className="input" />
        <input name="motivo" value={formData.motivo} onChange={handleChange} placeholder="Motivo" className="input" />
        <button type="submit" className="col-span-1 md:col-span-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Registrar Cita
        </button>
      </form>

      <table className="w-full table-auto border">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-2 py-1 border">Nombre</th>
            <th className="px-2 py-1 border">Documento</th>
            <th className="px-2 py-1 border">Fecha</th>
            <th className="px-2 py-1 border">Hora</th>
            <th className="px-2 py-1 border">Motivo</th>
            <th className="px-2 py-1 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita) => (
            <tr key={cita.id}>
              <td className="border px-2 py-1">{cita.nombre}</td>
              <td className="border px-2 py-1">{cita.documento}</td>
              <td className="border px-2 py-1">{cita.fecha}</td>
              <td className="border px-2 py-1">{cita.hora}</td>
              <td className="border px-2 py-1">{cita.motivo}</td>
              <td className="border px-2 py-1">
                <button onClick={() => handleDelete(cita.id)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegistroCitas;
