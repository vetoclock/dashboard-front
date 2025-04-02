import { useEffect, useState } from 'react'
import { Card } from '@/components/ui'
import TotalCasosHome from './demo/TotalCasosHome'
import TotalVentasHome from './demo/TotalVentasHome'
import TotalMargenHome from './demo/TotalMargenHome'
import TotalCostesHome from './demo/TotalCostesHome'

interface Grupo {
    x: string
    y: number
    porcentaje: number
}

interface AsignadoItem {
    asignado_nombre: string
    total_casos: string
    tiempo_medio_horas: string
}

interface DataItem {
    nombre_grupo: string
    total_casos: string
}

const Home = () => {
    const [topGrupos, setTopGrupos] = useState<Grupo[]>([])
    const [topAsignados, setTopAsignados] = useState<AsignadoItem[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch de asignados
                const asignadosResponse = await fetch(
                    '/data/tiempo_medio_respuesta.json',
                )
                const asignadosData: AsignadoItem[] =
                    await asignadosResponse.json()

                // Tomar los 6 primeros asignados
                const sortedAsignados = asignadosData.slice(0, 6)
                setTopAsignados(sortedAsignados)

                // Fetch de casos
                const casosResponse = await fetch('/data/casos_dashboard.json')
                const casosData: DataItem[] = await casosResponse.json()

                // Agrupar por nombre_grupo
                const gruposMap = casosData.reduce<Record<string, number>>(
                    (acc, item) => {
                        const grupo = item.nombre_grupo || 'Grupo Desconocido'
                        const total = parseInt(item.total_casos, 10) || 0
                        acc[grupo] = (acc[grupo] || 0) + total
                        return acc
                    },
                    {},
                )

                const gruposArray = Object.entries(gruposMap)
                    .map(([grupo, total]) => ({
                        x: grupo,
                        y: total,
                        porcentaje: 0,
                    }))
                    .sort((a, b) => b.y - a.y) // Ordenar por cantidad de casos

                const totalCasos = gruposArray.reduce(
                    (sum, item) => sum + item.y,
                    0,
                )

                const gruposConPorcentaje = gruposArray.map((grupo) => ({
                    ...grupo,
                    porcentaje:
                        totalCasos > 0 ? (grupo.y / totalCasos) * 100 : 0,
                }))

                setTopGrupos(gruposConPorcentaje.slice(0, 3))
            } catch (error) {
                console.error('Error loading JSON data:', error)
            }
        }

        fetchData()
    }, []) // Solo ejecutamos este useEffect una vez al montar el componente

    return (
        <div className="relative">
            <div className="grid grid-cols-4 gap-4 md:h-[500px]">
                <div
                    className="col-span-4 md:col-span-3 overflow-auto"
                    style={{ maxHeight: '600px' }}
                >
                    <Card bordered={false} className="flex flex-col p-0">
                        <div className="grid grid-rows-3 gap-2">
                            <div className="mb-4">
                                <h3>Casos</h3>
                                <TotalCasosHome />
                            </div>
                            <div className="mb-4">
                                <h3>Ingresos</h3>
                                <TotalVentasHome />
                            </div>
                            <div className="mb-4">
                                <h3>Costes</h3>
                                <TotalCostesHome />
                            </div>
                            <div className="mb-4">
                                <h3>Margen</h3>
                                <TotalMargenHome />
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-span-4 md:col-span-1 h-full">
                    <Card bordered={false} className="h-full flex flex-col">
                        <div className="flex justify-between items-center">
                            <h5>Tiempo de respuesta</h5>
                            <a
                                href="/tiempo-de-respuesta"
                                className="text-blue-500 hover:underline"
                            >
                                Ver todos
                            </a>
                        </div>
                        <hr />
                        <div className="flex-1 flex flex-col justify-between mt-4">
                            <div className="casos">
                                <div className="caso1 space-y-6">
                                    {topAsignados.map((asignado, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-2 mt-4"
                                        >
                                            <span>{` ${asignado.asignado_nombre}`}</span>
                                            <span className="ml-2 text-sm">
                                                {asignado.tiempo_medio_horas}{' '}
                                                hrs
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="w-full mt-8">
                <Card bordered={false}>
                    <div className="flex justify-between items-center">
                        <a
                            href="/casos-por-cliente"
                            className="text-blue-500 hover:underline"
                        >
                            Ver todos
                        </a>
                    </div>
                    <div className="clientes mt-6 space-y-6">
                        {topGrupos.map((grupo, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2 w-full"
                            >
                                <img
                                    src="/img/others/clienticon.png"
                                    alt={`Grupo ${index + 1}`}
                                    className="w-10 h-10 rounded-full"
                                />
                                <span>{grupo.x}</span>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500"
                                        style={{
                                            width: `${grupo.porcentaje}%`,
                                        }}
                                    ></div>
                                </div>
                                <span className="ml-2 text-sm">
                                    {grupo.porcentaje.toFixed(1)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Home
