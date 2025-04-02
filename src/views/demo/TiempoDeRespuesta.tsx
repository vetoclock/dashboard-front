import { useEffect, useState } from 'react'

interface AsignadoItem {
    asignado_nombre: string
    total_casos: string
    tiempo_medio_horas: string
}

const TiempoDeRespuesta = () => {
    const [topAsignados, setTopAsignados] = useState<AsignadoItem[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch de los datos de tiempo medio de respuesta
                const response = await fetch(
                    '/.netlify/functions/fetchCasos?fuente=tiempo',
                )
                const data: AsignadoItem[] = await response.json()
                setTopAsignados(data)
            } catch (error) {
                console.error('Error cargando datos:', error)
            }
        }

        fetchData()
    }, [])

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Tiempo de respuesta</h2>
            <div className="space-y-4">
                {topAsignados.map((asignado, index) => (
                    <div
                        key={index}
                        className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {asignado.asignado_nombre}
                            </h3>
                            <p className="text-sm text-gray-600">{`${asignado.total_casos} casos`}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-xl font-semibold text-blue-600">
                                {asignado.tiempo_medio_horas} hrs
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TiempoDeRespuesta
