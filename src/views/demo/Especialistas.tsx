import { useEffect, useState } from 'react'
import DatePickerComponent from './DatePickerComponent/DatePickerComponent'

interface Especialista {
    x: string
    y: number
    porcentaje?: number
}

interface DataItem {
    nombre_usuario: string
    mes_anio: string
    total_coste: string
}

const Especialistas = () => {
    const [especialistas, setEspecialistas] = useState<Especialista[]>([])
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)

    useEffect(() => {
        fetch('/.netlify/functions/fetchCasos?fuente=casos')
            .then((response) => response.json())
            .then((data: DataItem[]) => {
                if (!data || data.length === 0) return

                let filteredData = data
                if (startDate && endDate) {
                    const startStr = startDate.toISOString().slice(0, 7)
                    const endStr = endDate.toISOString().slice(0, 7)
                    filteredData = data.filter(
                        (item) =>
                            item.mes_anio >= startStr &&
                            item.mes_anio <= endStr,
                    )
                }

                const costesPorEspecialista = filteredData.reduce<
                    Record<string, number>
                >((acc, item) => {
                    const especialista = item.nombre_usuario || 'Desconocido'
                    const total = parseFloat(item.total_coste) || 0
                    acc[especialista] = (acc[especialista] || 0) + total
                    return acc
                }, {})

                const totalCostes = Object.values(costesPorEspecialista).reduce(
                    (sum, cost) => sum + cost,
                    0,
                )
                const especialistasConPorcentaje = Object.entries(
                    costesPorEspecialista,
                )
                    .map(([nombre, total]) => ({
                        x: nombre,
                        y: total,
                        porcentaje:
                            totalCostes > 0 ? (total / totalCostes) * 100 : 0,
                    }))
                    .sort((a, b) => b.y - a.y) // Ordenar de mayor a menor

                setEspecialistas(especialistasConPorcentaje)
            })
            .catch((error) =>
                console.error('Error cargando especialistas:', error),
            )
    }, [startDate, endDate])

    return (
        <div className="w-full mt-8 p-6 bg-white shadow rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-bold">Costes especialistas</h1>
            </div>

            {/* Selector de Fechas */}
            <div className="flex w-full lg:w-[40%] justify-start items-center p-3 bg-gray-100 rounded-lg shadow-sm mb-6">
                <DatePickerComponent
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />
            </div>

            <div className="space-y-4">
                {especialistas.map((especialista, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <span className="w-40 truncate">{especialista.x}</span>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500"
                                style={{ width: `${especialista.porcentaje}%` }}
                            ></div>
                        </div>
                        <span className="ml-2 text-sm whitespace-nowrap">
                            {especialista.y.toLocaleString('es-ES', {
                                style: 'currency',
                                currency: 'EUR',
                            })}{' '}
                            ({especialista.porcentaje?.toFixed(2)}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Especialistas
