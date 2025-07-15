// Filtros.tsx
import React from "react";
import Select from "react-select";

interface FiltrosProps {
  tipoUrgencia: string;
  setTipoUrgencia: React.Dispatch<React.SetStateAction<string>>;
  grupo: string;
  setGrupo: React.Dispatch<React.SetStateAction<string>>;
  empresa: string;
  setEmpresa: React.Dispatch<React.SetStateAction<string>>;
  tipoCaso: string;
  setTipoCaso: React.Dispatch<React.SetStateAction<string>>;
  especialista: string;
  setEspecialista: React.Dispatch<React.SetStateAction<string>>;
  tiposUrgencia: string[];
  grupos: string[];
  empresas: string[];
  tiposCaso: string[];
  especialistas: string[];
}

interface OptionType {
  value: string;
  label: string;
}

const Filtros: React.FC<FiltrosProps> = ({
  tipoUrgencia,
  setTipoUrgencia,
  grupo,
  setGrupo,
  empresa,
  setEmpresa,
  tipoCaso,
  setTipoCaso,
  especialista,
  setEspecialista,
  tiposUrgencia,
  grupos,
  empresas,
  tiposCaso,
  especialistas,
}) => {
  // Convertir arrays a opciones para react-select
  const empresasOptions: OptionType[] = [
    { value: "", label: "Todas" },
    ...empresas.sort().map((emp) => ({ value: emp, label: emp })),
  ];

  const tiposCasoOptions: OptionType[] = [
    { value: "", label: "Todos" },
    ...tiposCaso.sort().map((tipo) => ({ value: tipo, label: tipo })),
  ];

  const especialistasOptions: OptionType[] = [
    { value: "", label: "Todos" },
    ...especialistas.sort().map((esp) => ({ value: esp, label: esp })),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {/* Filtro por Grupo - Select estándar */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Filtrar por grupo:
        </label>
        <select
          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={grupo}
          onChange={(e) => setGrupo(e.target.value)}
        >
          <option value="">Todos</option>
          {grupos.sort().map((grp) => (
            <option key={grp} value={grp}>
              {grp}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro por Empresa - React Select */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Filtrar por empresa:
        </label>
        <Select<OptionType>
          value={empresasOptions.find((opt) => opt.value === empresa)}
          onChange={(option) => setEmpresa(option?.value || "")}
          options={empresasOptions}
          className="react-select-container"
          classNamePrefix="react-select"
          isClearable={false}
          placeholder="Selecciona empresa"
          maxMenuHeight={200}
        />
      </div>

      {/* Filtro por Tipo de Caso - React Select */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Filtrar por tipo de caso:
        </label>
        <Select<OptionType>
          value={tiposCasoOptions.find((opt) => opt.value === tipoCaso)}
          onChange={(option) => setTipoCaso(option?.value || "")}
          options={tiposCasoOptions}
          className="react-select-container"
          classNamePrefix="react-select"
          isClearable={false}
          placeholder="Selecciona tipo de caso"
          maxMenuHeight={200}
        />
      </div>

      {/* Filtro por Tipo de Urgencia - Select estándar */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Filtrar por tipo de urgencia:
        </label>
        <select
          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={tipoUrgencia}
          onChange={(e) => setTipoUrgencia(e.target.value)}
        >
          <option value="">Todos</option>
          {tiposUrgencia.sort().map((urgencia) => (
            <option key={urgencia} value={urgencia}>
              {urgencia}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro por Especialista - React Select */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Filtrar por especialista:
        </label>
        <Select<OptionType>
          value={especialistasOptions.find((opt) => opt.value === especialista)}
          onChange={(option) => setEspecialista(option?.value || "")}
          options={especialistasOptions}
          className="react-select-container"
          classNamePrefix="react-select"
          isClearable={false}
          placeholder="Selecciona especialista"
          maxMenuHeight={200}
        />
      </div>
    </div>
  );
};

export default Filtros;
