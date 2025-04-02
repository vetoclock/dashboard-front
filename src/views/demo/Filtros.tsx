// Filtros.tsx
import React from 'react'

interface FiltrosProps {
    tipoUrgencia: string
    setTipoUrgencia: React.Dispatch<React.SetStateAction<string>>
    grupo: string
    setGrupo: React.Dispatch<React.SetStateAction<string>>
    empresa: string
    setEmpresa: React.Dispatch<React.SetStateAction<string>>
    tipoCaso: string
    setTipoCaso: React.Dispatch<React.SetStateAction<string>>
    especialista: string
    setEspecialista: React.Dispatch<React.SetStateAction<string>>
    tiposUrgencia: string[]
    grupos: string[]
    empresas: string[]
    tiposCaso: string[]
    especialistas: string[]
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
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Filtro por Grupo */}
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
                    {grupos.map((grp) => (
                        <option key={grp} value={grp}>
                            {grp}
                        </option>
                    ))}
                </select>
            </div>

            {/* Filtro por Empresa */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                    Filtrar por empresa:
                </label>
                <select
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                >
                    <option value="">Todas</option>
                    {empresas.map((empr) => (
                        <option key={empr} value={empr}>
                            {empr}
                        </option>
                    ))}
                </select>
            </div>

            {/* Filtro por Tipo de Caso */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                    Filtrar por tipo de caso:
                </label>
                <select
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={tipoCaso}
                    onChange={(e) => setTipoCaso(e.target.value)}
                >
                    <option value="">Todos</option>
                    {tiposCaso.map((caso) => (
                        <option key={caso} value={caso}>
                            {caso}
                        </option>
                    ))}
                </select>
            </div>

            {/* Filtro por Tipo de Urgencia */}
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
                    {tiposUrgencia.map((urgencia) => (
                        <option key={urgencia} value={urgencia}>
                            {urgencia}
                        </option>
                    ))}
                </select>
            </div>

            {/* Filtro por Especialista */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                    Filtrar por especialista:
                </label>
                <select
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={especialista}
                    onChange={(e) => setEspecialista(e.target.value)}
                >
                    <option value="">Todos</option>
                    {especialistas.map((esp) => (
                        <option key={esp} value={esp}>
                            {esp}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default Filtros
