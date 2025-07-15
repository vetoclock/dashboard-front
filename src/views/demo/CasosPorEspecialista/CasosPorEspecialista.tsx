import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import Select from "react-select";
import DatePickerComponent from "../DatePickerComponent/DatePickerComponent";
import "./CasosPorEspecialista.css";
import Spinner from "../Spinner";

interface DataItem {
  nombre_usuario: string;
  nombre_grupo: string;
  empresa: string;
  tipo_urgencia: string;
  tipo_locale: string;
  mes_anio: string;
  total_casos: string;
}

interface ChartData {
  series: number[];
  options: ApexOptions;
}

interface OptionType {
  value: string;
  label: string;
}

const CasosPorEspecialista = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [grupo, setGrupo] = useState<string>("");
  const [grupos, setGrupos] = useState<string[]>([]);
  const [empresa, setEmpresa] = useState<string>("");
  const [empresas, setEmpresas] = useState<string[]>([]);
  const [tiposUrgencia, setTiposUrgencia] = useState<string[]>([]);
  const [tipoUrgencia, setTipoUrgencia] = useState<string>("");
  const [tiposCaso, setTiposCaso] = useState<string[]>([]);
  const [tipoCaso, setTipoCaso] = useState<string>("");
  const [dataItems, setDataItems] = useState<DataItem[]>([]);

  // Convertir arrays a opciones para react-select
  const empresasOptions: OptionType[] = [
    { value: "", label: "Todas las empresas" },
    ...empresas.map((emp) => ({ value: emp, label: emp })),
  ];

  const tiposCasoOptions: OptionType[] = [
    { value: "", label: "Todos los tipos de caso" },
    ...tiposCaso.map((tipo) => ({ value: tipo, label: tipo })),
  ];

  useEffect(() => {
    fetch("/.netlify/functions/fetchCasos?fuente=casos")
      .then((response) => response.json())
      .then((data: DataItem[]) => {
        if (!data || data.length === 0) return;
        setDataItems(data);

        setGrupos([...new Set(data.map((item) => item.nombre_grupo))].sort());
        setEmpresas([...new Set(data.map((item) => item.empresa))].sort());
        setTiposUrgencia(
          [...new Set(data.map((item) => item.tipo_urgencia))].sort()
        );
        setTiposCaso([...new Set(data.map((item) => item.tipo_locale))].sort());
      })
      .catch((error) => console.error("Error cargando los datos:", error));
  }, []);

  // 🔥 Filtrar empresas por grupo seleccionado
  useEffect(() => {
    if (grupo) {
      const empresasFiltradas = [
        ...new Set(
          dataItems
            .filter((item) => item.nombre_grupo === grupo)
            .map((item) => item.empresa)
        ),
      ].sort();
      setEmpresas(empresasFiltradas);

      // Si la empresa seleccionada ya no está disponible, la reseteamos
      if (!empresasFiltradas.includes(empresa)) {
        setEmpresa("");
      }
    } else {
      // Si no hay grupo seleccionado, mostramos todas las empresas
      setEmpresas([...new Set(dataItems.map((item) => item.empresa))]);
    }
  }, [grupo, dataItems]);

  useEffect(() => {
    let filteredData = dataItems;

    if (startDate && endDate) {
      const startStr = startDate.toISOString().slice(0, 7);
      const endStr = endDate.toISOString().slice(0, 7);
      filteredData = filteredData.filter(
        (item) => item.mes_anio >= startStr && item.mes_anio <= endStr
      );
    }
    if (grupo) {
      filteredData = filteredData.filter((item) => item.nombre_grupo === grupo);
    }
    if (empresa) {
      filteredData = filteredData.filter((item) => item.empresa === empresa);
    }
    if (tipoUrgencia) {
      filteredData = filteredData.filter(
        (item) => item.tipo_urgencia === tipoUrgencia
      );
    }
    if (tipoCaso) {
      filteredData = filteredData.filter(
        (item) => item.tipo_locale === tipoCaso
      );
    }

    const casosPorEspecialista = filteredData.reduce<Record<string, number>>(
      (acc, item) => {
        const especialista = item.nombre_usuario || "Desconocido";
        const total = parseInt(item.total_casos, 10) || 0;
        acc[especialista] = (acc[especialista] || 0) + total;
        return acc;
      },
      {}
    );

    const sortedCasos = Object.entries(casosPorEspecialista)
      .map(([especialista, total]) => ({ x: especialista, y: total }))
      .sort((a, b) => b.y - a.y);

    const labels = sortedCasos.map((item) => item.x);
    const series = sortedCasos.map((item) => item.y);

    setChartData({
      options: {
        chart: { type: "pie", width: "auto" },
        labels: labels,
        colors: [
          "#FF8C00",
          "#FFA500",
          "#FFD700",
          "#FF4500",
          "#FF6347",
          "#FF7F50",
          "#FFA07A",
          "#FFDAB9",
          "#FFE4B5",
          "#FFFACD",
        ],
        legend: { position: "right" },
        title: {
          text: "",
          align: "left",
          offsetX: 10,
          style: {
            fontSize: "25px",
            fontWeight: "bold",
            color: "#000000",
          },
        },
        tooltip: {
          theme: "dark",
          style: { fontSize: "14px" },
          fillSeriesColor: false,
          marker: { show: true },
          y: {
            formatter: (value: number) => value.toLocaleString("es-ES"),
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: { width: 200 },
              legend: { position: "bottom" },
            },
          },
        ],
      },
      series: series,
    });
  }, [startDate, endDate, grupo, empresa, tipoUrgencia, tipoCaso, dataItems]);

  if (!chartData) {
    return <Spinner />;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Casos por especialista
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
            <option value="">Todos los grupos</option>
            {grupos.map((grp) => (
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
            <option value="">Todos los tipos de urgencia</option>
            {tiposUrgencia.map((urg) => (
              <option key={urg} value={urg}>
                {urg}
              </option>
            ))}
          </select>
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
      </div>
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
        type="pie"
        height={500}
      />
    </div>
  );
};

export default CasosPorEspecialista;
