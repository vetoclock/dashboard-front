import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { Spinner } from '@/components/ui'

interface DataItem {
    nombre_grupo: string
    empresa: string
    mes_anio: string
    total_casos: string
    nombre_usuario: string
    tipo_urgencia: string
    tipo_locale: string
    total_coste: string
    total_precio: string
    margen: string
}

interface ChartData {
    series: {
        name: string
        data: number[]
    }[]
    options: ApexOptions
}

const TotalVentasHome = () => {
    const [chartData, setChartData] = useState<ChartData | null>(null)
    const navigate = useNavigate()
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

    // Detectar si la pantalla es de móvil
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const fetchData = useCallback(() => {
        fetch('/.netlify/functions/fetchCasos?fuente=casos')
            .then((response) => response.json())
            .then((json) => {
                if (!Array.isArray(json)) {
                    console.error('Datos no disponibles o formato incorrecto.')
                    return
                }

                const currentDate = new Date()
                const lastThreeMonths: string[] = []

                for (let i = 3; i >= 1; i--) {
                    const tempDate = new Date(currentDate)
                    tempDate.setMonth(currentDate.getMonth() - i)
                    const monthYear = tempDate.toISOString().slice(0, 7)
                    lastThreeMonths.push(monthYear)
                }

                const filteredData = json.filter((item: DataItem) =>
                    lastThreeMonths.includes(item.mes_anio),
                )

                if (filteredData.length === 0) {
                    console.error(
                        'No se encontraron datos para los últimos 3 meses.',
                    )
                    return
                }

                const ventasTotalesPorMes = lastThreeMonths.map((mes) => {
                    return filteredData
                        .filter((item) => item.mes_anio === mes)
                        .reduce(
                            (total, item) =>
                                total + parseFloat(item.total_precio),
                            0,
                        )
                })

                const monthsFormatted = lastThreeMonths.map((mes) => {
                    const dateObj = new Date(mes + '-01')
                    const options: Intl.DateTimeFormatOptions = {
                        month: 'long',
                        year: 'numeric',
                    }
                    return dateObj
                        .toLocaleDateString('es-ES', options)
                        .replace(/^\w/, (c) => c.toUpperCase())
                })

                const data: ChartData = {
                    series: [
                        {
                            name: 'Ingresos totales',
                            data: ventasTotalesPorMes,
                        },
                    ],
                    options: {
                        chart: {
                            type: 'line',
                            zoom: { enabled: false },
                            events: {
                                click: () => {
                                    if (!isMobile) {
                                        navigate('/ingresos-historico-anual')
                                    }
                                },
                            },
                        },
                        dataLabels: { enabled: false },
                        stroke: { curve: 'smooth', width: 3 },
                        colors: ['#3B82F6'],
                        xaxis: { categories: monthsFormatted },
                        yaxis: { min: 0 },
                    },
                }

                setChartData(data)
            })
            .catch((error) => {
                console.error('Error cargando los datos:', error)
            })
    }, [isMobile, navigate])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <div className="w-full mt-8">
            {chartData ? (
                <div className="cursor-pointer">
                    <Chart
                        options={chartData.options}
                        series={chartData.series}
                        height={300}
                    />
                </div>
            ) : (
                <Spinner />
            )}
        </div>
    )
}

export default TotalVentasHome
