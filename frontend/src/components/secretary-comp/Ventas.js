import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [formData, setFormData] = useState({
    cliente: '',
    producto: '',
    cantidad: '',
    precio: '',
    fecha: '',
  });

  const ventasRef = collection(db, 'ventas');

  const traerVentas = async () => {
    const data = await getDocs(ventasRef);
    setVentas(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    traerVentas();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { cliente, producto, cantidad, precio, fecha } = formData;

    if (!cliente || !producto || !cantidad || !precio || !fecha) {
      alert('Por favor completa todos los campos.');
      return;
    }

    try {
      await addDoc(ventasRef, {
        ...formData,
        total: parseFloat(precio) * parseInt(cantidad),
      });

      setFormData({
        cliente: '',
        producto: '',
        cantidad: '',
        precio: '',
        fecha: '',
      });

      traerVentas();
    } catch (error) {
      console.error('Error al registrar la venta:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Deseas eliminar esta venta?')) {
      await deleteDoc(doc(db, 'ventas', id));
      traerVentas();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4 text-green-800">Registro de Ventas</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input name="cliente" value={formData.cliente} onChange={handleChange} placeholder="Nombre del cliente" className="input" />
        <input name="producto" value={formData.producto} onChange={handleChange} placeholder="Producto" className="input" />
        <input type="number" name="cantidad" value={formData.cantidad} onChange={handleChange} placeholder="Cantidad" className="input" />
        <input type="number" name="precio" value={formData.precio} onChange={handleChange} placeholder="Precio unitario" className="input" />
        <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} className="input" />
        <button type="submit" className="col-span-1 md:col-span-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Registrar Venta
        </button>
      </form>

      <table className="w-full table-auto border">
        <thead className="bg-green-100">
          <tr>
            <th className="px-2 py-1 border">Cliente</th>
            <th className="px-2 py-1 border">Producto</th>
            <th className="px-2 py-1 border">Cantidad</th>
            <th className="px-2 py-1 border">Precio</th>
            <th className="px-2 py-1 border">Total</th>
            <th className="px-2 py-1 border">Fecha</th>
            <th className="px-2 py-1 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id}>
              <td className="border px-2 py-1">{venta.cliente}</td>
              <td className="border px-2 py-1">{venta.producto}</td>
              <td className="border px-2 py-1">{venta.cantidad}</td>
              <td className="border px-2 py-1">${venta.precio}</td>
              <td className="border px-2 py-1">${venta.total}</td>
              <td className="border px-2 py-1">{venta.fecha}</td>
              <td className="border px-2 py-1">
                <button onClick={() => handleDelete(venta.id)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
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

export default Ventas;
