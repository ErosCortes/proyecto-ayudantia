import { useState } from "react";
import apiClient from "../../config/apiClient";

const ESTADOS = [
  { value: "COMPLETADA", label: "Completadas (para pago)" },
  { value: "TODOS", label: "Todas" },
  { value: "INCOMPLETA", label: "Incompletas" },
  { value: "CANCELADA", label: "Canceladas" },
];

function ExportPayments() {
  const [estado, setEstado] = useState("COMPLETADA");
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError(null);

      const res = await apiClient(`/history/export_excel/?estado=${estado}`);

      if (!res.ok) {
        // El backend puede devolver JSON de error en vez del archivo
        let mensaje = "Error al generar el Excel";
        try {
          const errData = await res.json();
          mensaje = errData.error || errData.detail || mensaje;
        } catch {
          // si no es JSON, se deja el mensaje genérico
        }
        throw new Error(mensaje);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ayudantias_pago.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section>
      <h2 className="text-4xl font-bold text-[#003057]">Exportar Pagos de Ayudantías</h2>
      <p className="mt-2 text-gray-500">
        Descarga un Excel con el historial de ayudantías, listo para el proceso de pago.
      </p>

      <div className="bg-white rounded-2xl shadow-md p-6 mt-6 max-w-xl">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estado a exportar
        </label>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00AEEF] bg-white mb-4"
        >
          {ESTADOS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="bg-[#003057] text-white px-5 py-2 rounded-lg hover:bg-[#004b87] transition text-sm disabled:opacity-50"
        >
          {downloading ? "Generando..." : "↓ Descargar Excel"}
        </button>

        <p className="text-xs text-gray-400 mt-3">
          Incluye nombre, RUT, correo institucional, curso, NRC, semestre, año y
          estado. No incluye datos bancarios.
        </p>
      </div>
    </section>
  );
}

export default ExportPayments;