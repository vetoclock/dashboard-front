import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import DatePickerComponent from './DatePickerComponent/DatePickerComponent'
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
    series: number[]
    options: ApexOptions
}

const TiposDeCaso = () => {
    const [chartData, setChartData] = useState<ChartData | null>(null)
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)

    useEffect(() => {
        fetch('/.netlify/functions/fetchCasos?fuente=casos')
            .then((response) => response.json())
            .then((data: DataItem[]) => {
                if (!data || data.length === 0) return

                let filteredData = data

                // Filtrar por fecha si hay rango seleccionado
                if (startDate && endDate) {
                    const startStr = startDate.toISOString().slice(0, 7)
                    const endStr = endDate.toISOString().slice(0, 7)

                    filteredData = data.filter(
                        (item) =>
                            item.mes_anio >= startStr &&
                            item.mes_anio <= endStr,
                    )
                }

                // Agrupar por tipo de caso (tipo_locale)
                const casosPorTipo = filteredData.reduce<
                    Record<string, number>
                >((acc, item) => {
                    const tipo = item.tipo_locale || 'Desconocido'
                    const total = parseInt(item.total_casos, 10) || 0
                    acc[tipo] = (acc[tipo] || 0) + total
                    return acc
                }, {})

                // Convertir a array y ordenar de mayor a menor
                const sortedCasos = Object.entries(casosPorTipo)
                    .map(([tipo, total]) => ({ x: tipo, y: total }))
                    .sort((a, b) => b.y - a.y)
                    .slice(0, 10) // 🔥 Mostrar solo los 10 más importantes

                const labels = sortedCasos.map((item) => item.x)
                const series = sortedCasos.map((item) => item.y)

                setChartData({
                    options: {
                        chart: {
                            type: 'pie',
                            width: 'auto',
                        },
                        labels: labels,
                        colors: [
                            '#FF8C00',
                            '#FFA500',
                            '#FFD700',
                            '#FF4500',
                            '#FF6347',
                            '#FF7F50',
                            '#FFA07A',
                            '#FFDAB9',
                            '#FFE4B5',
                            '#FFFACD',
                        ], // 🔥 Gama de naranjas
                        legend: {
                            position: 'right',
                        },
                        title: {
                            text: '',
                            align: 'left',
                            offsetX: 10,
                            style: {
                                fontSize: '25px',
                                fontWeight: 'bold',
                                color: '#000000',
                            },
                        },
                        tooltip: {
                            theme: 'dark',
                            style: { fontSize: '14px' },
                            fillSeriesColor: false,
                            marker: { show: true },
                            y: {
                                formatter: (value: number) =>
                                    value.toLocaleString('es-ES'),
                            },
                        },
                        responsive: [
                            {
                                breakpoint: 480,
                                options: {
                                    chart: { width: 200 },
                                    legend: { position: 'bottom' },
                                },
                            },
                        ],
                    },
                    series: series,
                })
            })
            .catch((error) => console.error('Error cargando los datos:', error))
    }, [startDate, endDate]) // 🔥 Se actualiza cuando cambia el selector de fechas

    if (!chartData) {
        return <Spinner />
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            {/* 🔥 Título */}
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Tipos de caso:
            </h2>

            {/* 🔥 Selector de Fechas debajo del título */}
            <div className="flex w-full lg:w-[40%] justify-start items-center p-3 bg-gray-100 rounded-lg shadow-sm mb-6">
                <DatePickerComponent
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />
            </div>

            {/* 📊 Gráfico */}
            <Chart
                options={chartData.options}
                series={chartData.series}
                height={390}
                type="pie"
            />
        </div>
    )
}

export default TiposDeCaso
