import { useEffect, useState } from 'react'
import { COLOR_1 } from '@/constants/chart.constant'
import { ApexOptions } from 'apexcharts'
import DatePickerComponent from './DatePickerComponent/DatePickerComponent'
import TopList from './TopList/TopList'
import Filtros from './Filtros'
import ChartComponent from './ChartComponent'
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

interface Cliente {
    x: string
    y: number
    porcentaje: number
}

const obtenerFechaEnEspañol = (fecha: string) => {
    const meses = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
    ]
    const fechaObj = new Date(fecha + '-01')
    const mes = meses[fechaObj.getMonth()]
    const año = fechaObj.getFullYear()
    return `${mes} ${año}`
}

const convertirFechaAFormato = (fecha: Date) => {
    const año = fecha.getFullYear()
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
    return `${año}-${mes}`
}

const VentasHistoricoAnual = () => {
    const [chartData, setChartData] = useState<ChartData | null>(null)
    const [tipoUrgencia, setTipoUrgencia] = useState<string>('')
    const [tiposUrgencia, setTiposUrgencia] = useState<string[]>([])
    const [grupo, setGrupo] = useState<string>('')
    const [grupos, setGrupos] = useState<string[]>([])
    const [items, setItems] = useState<DataItem[]>([])
    const [startDate, setStartDate] = useState<Date | null>(
        new Date(new Date().setMonth(new Date().getMonth() - 3)), // 3 meses atrás
    )
    const [endDate, setEndDate] = useState<Date | null>(new Date()) // Fecha actual
    const [empresa, setEmpresa] = useState<string>('')
    const [empresas, setEmpresas] = useState<string[]>([])
    const [topClientes, setTopClientes] = useState<Cliente[]>([])
    const [tipoCaso, setTipoCaso] = useState<string>('')
    const [tiposCaso, setTiposCaso] = useState<string[]>([])
    const [especialista, setEspecialista] = useState<string>('')
    const [especialistas, setEspecialistas] = useState<string[]>([])
    const [totalCasos, setTotalCasos] = useState<number>(0)
    const [totalCasosAnioAnterior, setTotalCasosAnioAnterior] =
        useState<number>(0)
    const [diferencia, setDiferencia] = useState<number>(0)
    const [variacionPorcentaje, setVariacionPorcentaje] = useState<number>(0)

    useEffect(() => {
        fetch('/.netlify/functions/fetchCasos?fuente=casos')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`❌ Error HTTP: ${response.status}`)
                }
                return response.json()
            })
            .then((data: DataItem[] | { data: DataItem[] }) => {
                const parsedData: DataItem[] = Array.isArray(data)
                    ? data
                    : data.data

                if (!parsedData || parsedData.length === 0) {
                    return
                }

                // El resto de tu código igual (sin tocarlo)
                const casosPorCliente: { [key: string]: number } = {}

                parsedData.forEach((item) => {
                    const cliente = item.empresa
                    const casos = parseInt(item.total_precio, 10) || 0

                    if (casosPorCliente[cliente]) {
                        casosPorCliente[cliente] += casos
                    } else {
                        casosPorCliente[cliente] = casos
                    }
                })

                const clientesFiltrados = Object.entries(casosPorCliente).map(
                    ([x, y]) => ({
                        x: x || 'Cliente Desconocido',
                        y: y,
                        porcentaje: 0,
                    }),
                )

                const sortedClientes = clientesFiltrados.sort(
                    (a, b) => b.y - a.y,
                )

                const totalCasos = sortedClientes.reduce(
                    (sum, item) => sum + item.y,
                    0,
                )

                const clientesConPorcentaje = sortedClientes.map((cliente) => ({
                    ...cliente,
                    porcentaje:
                        totalCasos > 0 ? (cliente.y / totalCasos) * 100 : 0,
                }))

                setTopClientes(clientesConPorcentaje.slice(0, 3))
                setItems(parsedData)

                setGrupos(
                    Array.from(
                        new Set(parsedData.map((item) => item.nombre_grupo)),
                    ).sort(),
                )

                setTiposUrgencia(
                    Array.from(
                        new Set(parsedData.map((item) => item.tipo_urgencia)),
                    ).sort(),
                )

                setTiposCaso(
                    Array.from(
                        new Set(parsedData.map((item) => item.tipo_locale)),
                    ).sort(),
                )
                setEspecialistas(
                    Array.from(
                        new Set(parsedData.map((item) => item.nombre_usuario)),
                    ).sort(),
                )
            })
            .catch((error) => {
                console.error('💥 Error al cargar el JSON remoto:', error)
            })
    }, [])

    // Filtrar empresas cuando se selecciona un grupo
    useEffect(() => {
        if (grupo) {
            const empresasFiltradas = [
                ...new Set(
                    items
                        .filter((item) => item.nombre_grupo === grupo)
                        .map((item) => item.empresa),
                ),
            ].sort()
            setEmpresas(empresasFiltradas)

            if (!empresasFiltradas.includes(empresa)) {
                setEmpresa('')
            }
        } else {
            setEmpresas([...new Set(items.map((item) => item.empresa))])
        }
    }, [grupo, items, empresa])

    // Filtrar tipos de casos cuando se selecciona un especialista
    useEffect(() => {
        if (especialista) {
            const tiposDeCasoFiltrados = [
                ...new Set(
                    items
                        .filter((item) => item.nombre_usuario === especialista)
                        .map((item) => item.tipo_locale),
                ),
            ].sort()
            setTiposCaso(tiposDeCasoFiltrados)
        } else {
            setTiposCaso(
                [...new Set(items.map((item) => item.tipo_locale))].sort(),
            )
        }
    }, [especialista, items])

    // Filtrar los datos según la fecha, grupo, empresa, urgencia, etc.
    useEffect(() => {
        if (items.length === 0 || !startDate || !endDate) return

        const fechaInicial = convertirFechaAFormato(startDate)
        const fechaFinal = convertirFechaAFormato(endDate)

        const startDateLastYear = new Date(startDate)
        startDateLastYear.setFullYear(startDate.getFullYear() - 1)
        const endDateLastYear = new Date(endDate)
        endDateLastYear.setFullYear(endDate.getFullYear() - 1)

        const fechaInicialAnterior = convertirFechaAFormato(startDateLastYear)
        const fechaFinalAnterior = convertirFechaAFormato(endDateLastYear)

        const grouped = items.reduce<{
            [key: string]: { total: number; filtro: number }
        }>((acc, item) => {
            if (grupo && item.nombre_grupo !== grupo) return acc
            if (especialista && item.nombre_usuario !== especialista) return acc
            if (empresa && empresa !== '' && item.empresa !== empresa)
                return acc
            if (tipoCaso && item.tipo_locale !== tipoCaso) return acc

            const key = item.mes_anio
            const casos = parseInt(item.total_precio, 10) || 0

            if (key >= fechaInicial && key <= fechaFinal) {
                acc[key] = acc[key] || { total: 0, filtro: 0 }
                acc[key].total += casos
                if (!tipoUrgencia || item.tipo_urgencia === tipoUrgencia) {
                    acc[key].filtro += casos
                }
            }

            return acc
        }, {})

        const totalCasosCalculado = Object.values(grouped).reduce(
            (sum, item) => sum + item.filtro,
            0,
        )

        const groupedAnioAnterior = items.reduce<{
            [key: string]: { total: number; filtro: number }
        }>((acc, item) => {
            if (grupo && item.nombre_grupo !== grupo) return acc
            if (especialista && item.nombre_usuario !== especialista) return acc
            if (empresa && empresa !== '' && item.empresa !== empresa)
                return acc
            if (tipoCaso && item.tipo_locale !== tipoCaso) return acc

            const key = item.mes_anio
            const casos = parseInt(item.total_precio, 10) || 0

            if (key >= fechaInicialAnterior && key <= fechaFinalAnterior) {
                acc[key] = acc[key] || { total: 0, filtro: 0 }
                acc[key].total += casos
                if (!tipoUrgencia || item.tipo_urgencia === tipoUrgencia) {
                    acc[key].filtro += casos
                }
            }

            return acc
        }, {})

        const totalCasosAnioAnteriorCalculado = Object.values(
            groupedAnioAnterior,
        ).reduce((sum, item) => sum + item.filtro, 0)

        setTotalCasos(totalCasosCalculado)
        setTotalCasosAnioAnterior(totalCasosAnioAnteriorCalculado)

        const diferencia = totalCasosCalculado - totalCasosAnioAnteriorCalculado
        const variacionPorcentaje =
            totalCasosAnioAnteriorCalculado > 0
                ? ((totalCasosCalculado - totalCasosAnioAnteriorCalculado) /
                      totalCasosAnioAnteriorCalculado) *
                  100
                : 0

        setDiferencia(diferencia)
        setVariacionPorcentaje(variacionPorcentaje)

        const fechasOrdenadas = Object.keys(grouped).reverse()
        const data = fechasOrdenadas.filter((item) => {
            const fechaInicial = convertirFechaAFormato(startDate)
            const fechaFinal = convertirFechaAFormato(endDate)
            return item >= fechaInicial && item <= fechaFinal
        })

        const maxTotal = Math.max(...data.map((date) => grouped[date].total), 0)
        const maxFiltrado = Math.max(
            ...data.map((date) => grouped[date].filtro),
            0,
        )
        const maxY = Math.max(maxTotal, maxFiltrado) || 10

        setChartData({
            series: [
                {
                    name: 'Ingresos Filtrados',
                    data: data.map((date) => grouped[date].filtro),
                },
                {
                    name: 'Total Ingresos',
                    data: data.map((date) => grouped[date].total),
                },
            ],
            options: {
                chart: {
                    type: 'line',
                    zoom: { enabled: false },
                },
                colors: [COLOR_1, '#D3D3D3'],
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.9,
                        stops: [0, 80, 100],
                    },
                },
                dataLabels: { enabled: false },
                stroke: { curve: 'smooth', width: 3 },
                xaxis: {
                    categories: data.map(obtenerFechaEnEspañol),
                    type: 'category',
                },
                yaxis: { opposite: true, max: maxY },
                legend: { horizontalAlign: 'left' },
            },
        })
    }, [
        tipoUrgencia,
        grupo,
        items,
        startDate,
        endDate,
        empresa,
        tipoCaso,
        especialista,
    ])

    if (!chartData) return <Spinner />

    const maxClientes = Math.max(
        totalCasos,
        totalCasosAnioAnterior, // 🔥 Ahora este valor es correcto
        ...topClientes.map((cliente) => cliente.y || 1), // Evitar errores con 1
    )

    const totalCasosAnioAnteriorPercent =
        maxClientes > 0
            ? Math.max((totalCasosAnioAnterior / maxClientes) * 100, 30) // 🔥 Ajuste dinámico
            : 0

    // Asegurar que la barra de "Total Casos" nunca se vea demasiado pequeña
    const totalCasosPercent =
        maxClientes > 0
            ? Math.max((totalCasos / maxClientes) * 100, 30) // 🔥 Nunca será menor al 30%
            : 0
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Ingresos
            </h2>

            <Filtros
                tipoUrgencia={tipoUrgencia}
                setTipoUrgencia={setTipoUrgencia}
                grupo={grupo}
                setGrupo={setGrupo}
                empresa={empresa}
                setEmpresa={setEmpresa}
                tipoCaso={tipoCaso}
                setTipoCaso={setTipoCaso}
                especialista={especialista}
                setEspecialista={setEspecialista}
                tiposUrgencia={tiposUrgencia}
                grupos={grupos}
                empresas={empresas}
                tiposCaso={tiposCaso}
                especialistas={especialistas}
            />
            {/* Selector de Fechas */}
            <div className="flex w-full lg:w-[40%] justify-start items-center p-3 bg-gray-100 rounded-lg shadow-sm mb-6">
                <DatePickerComponent
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />
            </div>

            {/* Gráfico */}
            {chartData ? (
                <ChartComponent chartData={chartData} />
            ) : (
                <div>Cargando gráfico...</div>
            )}

            <hr />

            <TopList
                title=""
                link="ingresos-por-cliente"
                linkText="Ver todos"
                items={[
                    {
                        x: 'Total',
                        porcentaje: totalCasosPercent,
                        y: totalCasos, // 🔥 Se mantiene el total en la primera fila
                    },
                    {
                        x: `Variación`,
                        porcentaje: totalCasosAnioAnteriorPercent, // 🔥 La barra sigue siendo proporcional
                        y: diferencia, // 🔥 En lugar del total del año anterior, mostramos la diferencia
                    },
                    {
                        x: 'Variación %',
                        porcentaje: Math.min(
                            Math.abs(variacionPorcentaje),
                            100,
                        ),
                        y: Number(variacionPorcentaje.toFixed(2)), // 🔥 Convertimos a número
                    },
                ]}
                icon="/img/others/clienticon.png"
            />
        </div>
    )
}

export default VentasHistoricoAnual
