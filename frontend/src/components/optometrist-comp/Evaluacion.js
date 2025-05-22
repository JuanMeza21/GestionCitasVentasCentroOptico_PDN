import React, { useState } from "react";

const EvaluacionesVisuales = () => {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [nuevaEval, setNuevaEval] = useState({
    paciente: "",
    agudezaVisual: "",
    presionIntraocular: "",
    observaciones: "",
  });

  const handleChange = (e) => {
    setNuevaEval({ ...nuevaEval, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !nuevaEval.paciente ||
      !nuevaEval.agudezaVisual ||
      !nuevaEval.presionIntraocular ||
      !nuevaEval.observaciones
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    setEvaluaciones([...evaluaciones, nuevaEval]);
    setNuevaEval({
      paciente: "",
      agudezaVisual: "",
      presionIntraocular: "",
      observaciones: "",
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Evaluaciones Visuales</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow">
        <input
          type="text"
          name="paciente"
          placeholder="Nombre del paciente"
          value={nuevaEval.paciente}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="agudezaVisual"
          placeholder="Agudeza Visual"
          value={nuevaEval.agudezaVisual}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="presionIntraocular"
          placeholder="Presión Intraocular"
          value={nuevaEval.presionIntraocular}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="observaciones"
          placeholder="Observaciones"
          value={nuevaEval.observaciones}
          onChange={handleChange}
          className="p-2 border rounded col-span-2"
        />
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Guardar Evaluación
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Listado de Evaluaciones</h3>
        <table className="w-full border-collapse bg-white shadow rounded">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-2 border">Paciente</th>
              <th className="p-2 border">Agudeza Visual</th>
              <th className="p-2 border">Presión Intraocular</th>
              <th className="p-2 border">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {evaluaciones.map((evaluacion, index) => (
              <tr key={index}>
                <td className="p-2 border">{evaluacion.paciente}</td>
                <td className="p-2 border">{evaluacion.agudezaVisual}</td>
                <td className="p-2 border">{evaluacion.presionIntraocular}</td>
                <td className="p-2 border">{evaluacion.observaciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EvaluacionesVisuales;
