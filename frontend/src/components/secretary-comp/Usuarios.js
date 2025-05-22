import React, { useEffect, useState, useCallback } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { getAuth,signOut,createUserWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { FaGoogle, FaGithub, FaFacebook, FaEnvelope } from "react-icons/fa";

const Usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    uid: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
    rol: "optometrista",
  });
  const [editMode, setEditMode] = useState(false);
  const [uidSesion, setUidSesion] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const auth = getAuth();
    const usuarioActual = auth.currentUser;
    if (usuarioActual) {
      setUidSesion(usuarioActual.uid);
    }
  }, []);

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

  const crearUsuario = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      const userData = {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        telefono: form.telefono,
        rol: form.rol,
        uid: user.uid,
        proveedor: "email", 
      };

      await setDoc(doc(db, "usuarios", user.uid), userData);

      obtenerUsuarios();
      resetForm();
      setShowCreateForm(false);

      Swal.fire({
        title: "¡Éxito!",
        text: "Usuario creado correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (err) {
      setError("Error al registrar: " + err.message);
      console.error("Error al crear usuario:", err);
    }
  };

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

  const manejarEdit = (usuario) => {
    setForm(usuario);
    setEditMode(true);
    setShowCreateForm(false);
  };

  const manejarDelete = async (uid, nombre) => {
    const auth = getAuth();
    const uidActual = auth.currentUser?.uid;

    Swal.fire({
      text: `¿Estás seguro de eliminar el perfil: ${nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:8080/usuarios/${uid}`, {
            method: "DELETE",
          });

          if (res.ok) {
            if (uid === uidActual) {
              await signOut(auth);
              window.location.href = "/login";
            } else {
              obtenerUsuarios();
            }
          }
        } catch (error) {
          console.error("Error al eliminar usuario:", error);
        }
      }
    });
  };

  const resetForm = () => {
    setForm({
      uid: "",
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      password: "",
      rol: "optometrista",
    });
    setEditMode(false);
    setShowCreateForm(false);
    setError("");
  };

  const getRolColor = (rol) => {
    switch (rol.toLowerCase()) {
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
        <h2 className="text-xl font-bold">Usuarios registrados</h2>
        <button
          onClick={() => {
            resetForm();
            setShowCreateForm(true);
          }}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          <Plus className="w-4 h-4" />
          Nuevo usuario
        </button>
      </div>

      {(editMode || showCreateForm) && (
        <div className="bg-white shadow rounded-lg mb-6">
          <h2 className="text-[16px] font-bold mb-4 bg-gray-100 py-4 px-6">
            {editMode ? "EDITAR USUARIO" : "CREAR NUEVO USUARIO"}
          </h2>

          <div className="px-6 pb-6">
            <form onSubmit={editMode ? manejarForm : crearUsuario}className="grid gap-4 text-[15px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="grid">
                  <label className="font-bold pl-1" htmlFor="nombre">
                    NOMBRE
                  </label>
                  <input name="nombre"value={form.nombre}onChange={inputInfo}className="border p-2 rounded"required/>
                </div>
                <div className="grid">
                  <label className="font-bold pl-1" htmlFor="apellido">
                    APELLIDO
                  </label>
                  <input name="apellido"value={form.apellido}onChange={inputInfo}className="border p-2 rounded"/>
                </div>
                <div className="grid">
                  <label className="font-bold pl-1" htmlFor="telefono">
                    TELÉFONO
                  </label>
                  <input name="telefono"value={form.telefono}onChange={inputInfo}className="border p-2 rounded"/>
                </div>
                {!editMode && (
                  <>
                    <div className="grid">
                      <label className="font-bold pl-1" htmlFor="email">
                        CORREO ELECTRÓNICO
                      </label>
                      <input name="email"type="email"value={form.email}onChange={inputInfo}className="border p-2 rounded"required/>
                    </div>
                    <div className="grid">
                      <label className="font-bold pl-1" htmlFor="password">
                        CONTRASEÑA
                      </label>
                      <input name="password"type="password"value={form.password}onChange={inputInfo}className="border p-2 rounded"required={!editMode}/>
                    </div>
                  </>
                )}
                <div>
                  <label className="font-bold pl-1" htmlFor="rol">
                    ROL
                  </label>
                  <select name="rol"value={form.rol}onChange={inputInfo}className="border p-2 rounded w-full">
                    <option value="optometrista">Optometrista</option>
                    <option value="secretario/a">Secretario/a</option>
                  </select>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3">
                <button type="submit"className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded">
                  {editMode ? "Actualizar" : "Crear usuario"}
                </button>
                <button type="button"onClick={resetForm}className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-[15px] text-left">
          <thead className="text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3 text-center">Proveedor</th>
              <th className="px-4 py-3 text-center">Rol</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.uid} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  {u.nombre} {u.apellido}
                </td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    {getProviderIcon(u.proveedor)}
                  </div>
                </td>
                <td className="px-4 py-3 flex justify-center">
                  <span
                    className={`text-[12px] font-semibold px-3 py-1 rounded-full ${getRolColor(
                      u.rol
                    )} inline-block text-center min-w-[100px]`}
                  >
                    {u.rol}
                    {u.uid === uidSesion && (
                      <span className="ml-2 text-[12px] font-bold text-black">
                        (Sesión actual)
                      </span>
                    )}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => manejarEdit(u)}className="text-gray-500 hover:text-blue-500">
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button onClick={() => manejarDelete(u.uid, u.nombre)}className="text-gray-500 hover:text-blue-500">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usuario;