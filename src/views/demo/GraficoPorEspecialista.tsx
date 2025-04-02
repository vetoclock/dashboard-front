import Chart from 'react-apexcharts'
import { COLORS } from '@/constants/chart.constant'

const GraficoPorEspecialista = () => {
    const data = [
        {
            name: 'Session Duration',
            data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
        },
    ]

    return (
        <div className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-xl font-bold mb-4">Gráfico por Especialista</h2>
            <Chart
                options={{
                    chart: {
                        height: 350,
                        type: 'line',
                        zoom: { enabled: false },
                    },
                    colors: [COLORS[0]], // Solo el color de la primera serie
                    dataLabels: { enabled: false },
                    stroke: {
                        width: 3,
                        curve: 'straight',
                    },
                    markers: {
                        size: 4,
                        hover: { sizeOffset: 4 },
                    },
                    xaxis: {
                        categories: [
                            '01 Jan',
                            '02 Jan',
                            '03 Jan',
                            '04 Jan',
                            '05 Jan',
                            '06 Jan',
                            '07 Jan',
                            '08 Jan',
                            '09 Jan',
                            '10 Jan',
                            '11 Jan',
                            '12 Jan',
                        ],
                    },
                    tooltip: {
                        y: {
                            title: {
                                formatter: (val) => `${val} (mins)`,
                            },
                        },
                    },
                    grid: { borderColor: '#f1f1f1' },
                }}
                series={data}
                height={300}
            />
        </div>
    )
}

export default GraficoPorEspecialista
