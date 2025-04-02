import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import DatePickerComponent from './DatePickerComponent/DatePickerComponent'
import { Spinner } from '@/components/ui'

interface DataItem {
    nombre_grupo: string
    mes_anio: string
    total_casos: string
    total_precio: string
}

interface ChartData {
    series: number[]
    options: ApexOptions
}

const VentasPorCliente = () => {
    const [chartData, setChartData] = useState<ChartData | null>(null)
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

                // Aquí cambiamos a total_precio o total_coste según lo que necesites
                const ingresosPorGrupo = filteredData.reduce<
                    Record<string, number>
                >((acc, item) => {
                    const grupo = item.nombre_grupo || 'Desconocido'
                    const total = parseFloat(item.total_precio) || 0 // Cambia total_casos por total_precio o total_coste
                    acc[grupo] = (acc[grupo] || 0) + total
                    return acc
                }, {})

                const sortedIngresos = Object.entries(ingresosPorGrupo)
                    .map(([grupo, total]) => ({ x: grupo, y: total }))
                    .sort((a, b) => b.y - a.y)

                setChartData({
                    options: {
                        chart: { type: 'pie', width: 'auto' },
                        labels: sortedIngresos.map((item) => item.x),
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
                        ],
                        legend: {
                            position: 'right',
                            floating: false,
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
                            y: {
                                formatter: (value: number) =>
                                    value.toLocaleString('es-ES', {
                                        style: 'currency',
                                        currency: 'EUR', // Ajusta la moneda si es necesario
                                    }),
                            },
                        },
                        responsive: [
                            {
                                breakpoint: 768,
                                options: {
                                    legend: { position: 'bottom' },
                                },
                            },
                        ],
                    },
                    series: sortedIngresos.map((item) => item.y),
                })
            })
            .catch((error) => console.error('Error cargando los datos:', error))
    }, [startDate, endDate])

    if (!chartData) {
        return <Spinner />
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Ingresos por cliente:
            </h2>
            <div className="flex w-full lg:w-[40%] justify-start items-center p-3 bg-gray-100 rounded-lg shadow-sm mb-6">
                <DatePickerComponent
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />
            </div>
            <Chart
                options={chartData.options}
                series={chartData.series}
                height={390}
                type="pie"
            />
        </div>
    )
}

export default VentasPorCliente
