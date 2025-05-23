import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';

const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    cantidad: '',
    precio: '',
  });

  const productosRef = collection(db, 'inventario');

  const obtenerProductos = async () => {
    const data = await getDocs(productosRef);
    setProductos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombre, categoria, cantidad, precio } = formData;

    if (!nombre || !categoria || !cantidad || !precio) {
      alert('Completa todos los campos');
      return;
    }

    try {
      await addDoc(productosRef, {
        ...formData,
        cantidad: parseInt(cantidad),
        precio: parseFloat(precio),
      });

      setFormData({ nombre: '', categoria: '', cantidad: '', precio: '' });
      obtenerProductos();
    } catch (error) {
      console.error('Error al registrar producto:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este producto?')) {
      await deleteDoc(doc(db, 'inventario', id));
      obtenerProductos();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4 text-purple-800">Inventario</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre del producto" className="input" />
        <input name="categoria" value={formData.categoria} onChange={handleChange} placeholder="Categoría" className="input" />
        <input type="number" name="cantidad" value={formData.cantidad} onChange={handleChange} placeholder="Cantidad" className="input" />
        <input type="number" name="precio" value={formData.precio} onChange={handleChange} placeholder="Precio" className="input" />
        <button type="submit" className="col-span-1 md:col-span-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Agregar Producto
        </button>
      </form>

      <table className="w-full table-auto border">
        <thead className="bg-purple-100">
          <tr>
            <th className="px-2 py-1 border">Nombre</th>
            <th className="px-2 py-1 border">Categoría</th>
            <th className="px-2 py-1 border">Cantidad</th>
            <th className="px-2 py-1 border">Precio</th>
            <th className="px-2 py-1 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.id}>
              <td className="border px-2 py-1">{prod.nombre}</td>
              <td className="border px-2 py-1">{prod.categoria}</td>
              <td className="border px-2 py-1">{prod.cantidad}</td>
              <td className="border px-2 py-1">${prod.precio}</td>
              <td className="border px-2 py-1">
                <button onClick={() => handleDelete(prod.id)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
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

export default Inventario;
