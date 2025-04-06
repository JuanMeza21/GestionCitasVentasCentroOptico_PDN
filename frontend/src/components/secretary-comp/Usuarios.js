import React, { useEffect, useState, useCallback } from "react";
import { Pencil,Trash2,Check,X,} from "lucide-react";

const Usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    uid: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    rol: "",
  });
  const [editMode, setEditMode] = useState(false);

  const obtenerUsuarios = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8080/usuarios");
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  }, []);

  useEffect(() => {
    obtenerUsuarios();
  }, [obtenerUsuarios]);

  const inputInfo = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const manejarForm = async (e) => {
    e.preventDefault();
    try {
      const method = editMode ? "PUT" : "POST";
      const url = editMode
        ? `http://localhost:8080/usuarios/${form.uid}`
        : "http://localhost:8080/usuarios";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        obtenerUsuarios();
        resetForm();
      }
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  const manejarEdit = (usuario) => {
    setForm(usuario);
    setEditMode(true);
  };

  const manejarDelete = async (uid) => {
    try {
      const res = await fetch(`http://localhost:8080/usuarios/${uid}`, {
        method: "DELETE",
      });
      if (res.ok) {
        obtenerUsuarios();
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  const resetForm = () => {
    setForm({
      uid: "",
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      rol: "",
    });
    setEditMode(false);
  };

  return (
    <div className="px-6 py-4">
      {editMode && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-500">Editar usuario</h2>

          <form onSubmit={manejarForm} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid">
                <label className="font-bold pl-1" htmlFor="nombre">Nombre</label>
                <input name="nombre" value={form.nombre} onChange={inputInfo} className="border p-2 rounded" required />
              </div>
              <div className="grid">
                <label className="font-bold pl-1" htmlFor="apellido">Apellido</label>
                <input name="apellido" value={form.apellido} onChange={inputInfo} className="border p-2 rounded" />
              </div>
              <div className="grid">
                <label className="font-bold pl-1" htmlFor="email">Email</label>
                <input name="email" value={form.email} onChange={inputInfo} className="border p-2 rounded" type="email" />
              </div>
              <div className="grid">
                <label className="font-bold pl-1" htmlFor="telefono">Telefono</label>
                <input name="telefono" value={form.telefono} onChange={inputInfo} className="border p-2 rounded" />
              </div>
            </div>

            <div>
              <label className="font-bold pl-1" htmlFor="rol">Rol</label>  
              <select name="rol" value={form.rol} onChange={inputInfo} className="border p-2 rounded w-full">
                <option value="">Selecciona un rol</option>
                <option value="optometrista">Optometrista</option>
                <option value="secretario/a">Secretario/a</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded">
                <Check className="w-4 h-4" />
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Usuarios registrados</h2>
      <div className="space-y-4">
        {usuarios.map((u) => (
          <div key={u.uid} className="bg-white border shadow-sm rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold text-lg">{u.nombre} {u.apellido}</p>
              <p className="text-sm text-gray-600">{u.email}</p>
              <p className="text-sm text-gray-500">Rol: {u.rol}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => manejarEdit(u)}className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => manejarDelete(u.uid)}className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Usuario;