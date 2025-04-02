import type { Handler } from '@netlify/functions'
import fetch from 'node-fetch'

const handler: Handler = async (event) => {
    const fuente = event.queryStringParameters?.fuente

    let url = ''
    switch (fuente) {
        case 'casos':
            url = 'https://www.vetoclock-iberia.com/mivet/casos_dashboard.json'
            break
        case 'tiempo':
            url =
                'https://www.vetoclock-iberia.com/mivet/tiempo_medio_respuesta.json'
            break
        default:
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Fuente no válida' }),
            }
    }

    try {
        const response = await fetch(url)
        const data = await response.json()

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify(data),
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Error al obtener el JSON remoto',
                detalle:
                    error instanceof Error
                        ? error.message
                        : 'Error desconocido',
            }),
        }
    }
}

export { handler }
