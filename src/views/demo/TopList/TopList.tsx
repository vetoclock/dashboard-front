import { Card } from '@/components/ui'

interface TopItem {
    x: string
    porcentaje: number
    y: number
}

interface TopListProps {
    title: string
    link: string
    linkText: string
    items: TopItem[]
    icon: string
}

const TopList: React.FC<TopListProps> = ({
    title,
    link,
    linkText,
    items,
    icon,
}) => {
    return (
        <Card bordered={false} className="mt-6">
            <div className="flex justify-between items-center">
                <h5>{title}</h5>
                <a href={link} className="text-blue-500 hover:underline">
                    {linkText}
                </a>
            </div>
            <div className="clientes mt-6 space-y-6">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`flex items-center space-x-2 w-full ${index === 0 ? 'font-bold text-lg' : ''}`}
                    >
                        <img
                            src={icon}
                            alt={`${title} ${index + 1}`}
                            className="w-10 h-10 rounded-full"
                        />
                        <span>{item.x}</span>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${index === 0 ? 'bg-gray-800' : 'bg-blue-500'}`}
                                style={{
                                    width: `${Math.min(item.porcentaje, 100)}%`, // 🔥 Ajuste para evitar más del 100%
                                    transition: 'width 0.3s ease-in-out',
                                }}
                            ></div>
                        </div>
                        <span className="ml-2 text-sm whitespace-nowrap">
                            {item.y.toLocaleString('es-ES')}
                            {item.x === 'Variación %' ? '%' : ''}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default TopList
